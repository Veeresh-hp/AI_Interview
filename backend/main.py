import os                  # file and folder operations
import shutil              # delete folders
import uuid                # generate unique session IDs
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
# FastAPI    — the web framework
# UploadFile — type for file uploads
# File       — marks a parameter as a file upload
# Form       — marks a parameter as a form field (not JSON)
# HTTPException — raises HTTP errors with status codes

from fastapi.middleware.cors import CORSMiddleware
# ↑ allows React frontend (different port) to call this backend
# without this, browser blocks all requests as "cross-origin"

from pydantic import BaseModel  # used to define request body shapes
from typing import Optional     # allows None values
from dotenv import load_dotenv  # loads .env file

from backend.rag.ingest import build_vector_store       # Phase 1
from backend.rag.retriever import retrieve_context      # Phase 1
from backend.rag.question_engine import (
    generate_questions,   # Phase 2 — generates questions from context
    score_answer,         # Phase 2 — scores one answer
    generate_report       # Phase 2 — generates final report
)

load_dotenv()  # load GROQ_API_KEY from .env into environment

app = FastAPI()  # create the FastAPI application instance

# ── CORS setup ────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    # ↑ only allow requests from React dev server (Vite default port)
    # in production this would be your actual domain
    allow_methods=["*"],      # allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],      # allow all headers
)

# ── in-memory session store ───────────────────────────────────────────────────
sessions = {}
# dict that maps session_id → session data
# e.g. sessions["abc123"] = { vectorstore, mode, questions, answers, scores, current_index }
# WHY in-memory: simple for development — no database needed
# LIMITATION: data lost on server restart — will fix with Redis in production


# ── Route 1: Upload ───────────────────────────────────────────────────────────
@app.post("/upload")
async def upload_files(
    mode: str = Form(...),                      # "resume", "jd", or "both"
    resume: Optional[UploadFile] = File(None),  # PDF file — optional
    jd: Optional[UploadFile] = File(None)       # text file — optional
    # Form(...) means required form field
    # File(None) means optional file upload
):
    # validate that right files are provided for the chosen mode
    if mode == "resume" and not resume:
        raise HTTPException(status_code=400, detail="Resume required for resume mode")
    if mode == "jd" and not jd:
        raise HTTPException(status_code=400, detail="JD required for JD mode")
    if mode == "both" and (not resume or not jd):
        raise HTTPException(status_code=400, detail="Both files required for both mode")

    session_id = str(uuid.uuid4())
    # ↑ generates a unique ID like "613d4ed9-5cda-4a30-bf2e-eefd8ec8de8b"
    # uuid4() is random — virtually impossible to collide

    session_dir = f"./sessions/{session_id}"    # unique folder per session
    os.makedirs(session_dir, exist_ok=True)
    # exist_ok=True → don't raise error if folder already exists

    resume_path = None  # will be set if resume is uploaded
    jd_path = None      # will be set if JD is uploaded

    if resume:
        resume_path = f"{session_dir}/resume.pdf"
        with open(resume_path, "wb") as f:  # "wb" = write binary mode (for PDF)
            f.write(await resume.read())    # await because file reading is async
            # await means "wait for this to finish before moving on"

    if jd:
        jd_path = f"{session_dir}/jd.txt"
        with open(jd_path, "wb") as f:
            f.write(await jd.read())

    # run RAG ingestion — chunks, embeds, stores in ChromaDB
    vectorstore = build_vector_store(
        resume_path=resume_path,
        jd_path=jd_path,
        mode=mode,
        persist_dir=f"{session_dir}/chroma_db"  # each session gets its own DB
    )

    # store session state in memory
    sessions[session_id] = {
        "vectorstore": vectorstore,  # the ChromaDB object for this session
        "mode": mode,                # which mode was selected
        "questions": [],             # filled in /start
        "answers": [],               # filled as candidate answers
        "scores": [],                # filled as answers are scored
        "current_index": 0           # tracks which question we're on (0-4)
    }

    return {
        "session_id": session_id,
        "message": "Files uploaded successfully",
        "mode": mode
    }


# ── Route 2: Start interview ──────────────────────────────────────────────────
@app.post("/start")
async def start_interview(session_id: str, difficulty: str = "medium"):
    # difficulty comes as query param from frontend

    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    mode = session["mode"]

    # question count based on difficulty
    question_count_map = {
        "easy": 10,
        "medium": 10,
        "hard": 10
    }

    # time limit per question in seconds based on difficulty
    time_limit_map = {
        "easy": 120,    # 2 minutes — generous for beginners
        "medium": 90,   # 1.5 minutes — moderate pressure
        "hard": 60      # 1 minute — strict, like a real interview
    }

    query_map = {
        "resume": "projects skills experience achievements",
        "jd": "required skills responsibilities qualifications",
        "both": "technical skills projects experience requirements"
    }

    context = retrieve_context(query_map[mode], session["vectorstore"])

    questions = generate_questions(
        context=context,
        num_questions=question_count_map[difficulty],
        difficulty=difficulty,
        include_intro=difficulty in ("easy", "medium")
        # ↑ only add "introduce yourself" for easy and medium
    )

    session["questions"] = questions
    session["difficulty"] = difficulty

    return {
        "question": questions[0],
        "question_number": 1,
        "total_questions": len(questions),
        "time_limit": time_limit_map[difficulty]
        # ↑ send time limit to frontend so timer knows how long to count
    }

# ── Route 3: Submit answer ────────────────────────────────────────────────────
class AnswerRequest(BaseModel):
    # Pydantic model defines the shape of the JSON request body
    session_id: str   # which session this answer belongs to
    answer: str       # the candidate's answer text

@app.post("/answer")
async def submit_answer(request: AnswerRequest):

    if request.session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[request.session_id]
    current_index = session["current_index"]            # which question we're on
    current_question = session["questions"][current_index]  # get that question

    # score this answer against the question and context
    score_result = score_answer(
        question=current_question,
        answer=request.answer,
        vectorstore=session["vectorstore"]
    )

    session["answers"].append(request.answer)   # save answer
    session["scores"].append(score_result)       # save score
    session["current_index"] += 1               # move to next question

    # check if all questions have been answered
    if session["current_index"] >= len(session["questions"]):
        return {
            "status": "completed",
            "message": "Interview complete. Call /report to get your score."
        }

    # return next question
    next_question = session["questions"][session["current_index"]]
    return {
        "status": "ongoing",
        "question": next_question,
        "question_number": session["current_index"] + 1,
        # +1 because current_index is 0-based but display is 1-based
        "total_questions": len(session["questions"])
    }


# ── Route 4: Get report ───────────────────────────────────────────────────────
@app.get("/report")
async def get_report(session_id: str):
    # session_id passed as query param: /report?session_id=abc123

    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]

    # make sure all questions were answered before generating report
    if len(session["answers"]) < len(session["questions"]):
        raise HTTPException(status_code=400, detail="Interview not completed yet")
        # 400 = "bad request" — client sent request at wrong time

    # generate and return the full brutal honest report
    report = generate_report(
        questions=session["questions"],
        answers=session["answers"],
        scores=session["scores"]
    )

    return report  # FastAPI auto-converts dict to JSON response