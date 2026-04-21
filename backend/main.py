import os
os.environ["USE_TORCH"] = "1"
os.environ["USE_TF"] = "0"
import uuid
import json
import shutil
import hashlib
from fastapi import FastAPI, UploadFile, File, Form, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

from rag.ingest import ingest_documents
from rag.retriever import retrieve_context
from rag.question_engine import QuestionEngine

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories
UPLOADS_DIR = "uploads"
SESSIONS_DIR = "sessions"
os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(SESSIONS_DIR, exist_ok=True)
RESUMES_DIR = "resumes"
os.makedirs(RESUMES_DIR, exist_ok=True)
USERS_DIR = "users"
os.makedirs(USERS_DIR, exist_ok=True)

engine = QuestionEngine()

class AnswerRequest(BaseModel):
    session_id: str
    answer: str

@app.post("/upload")
async def upload_files(
    mode: str = Form(...),
    difficulty: str = Form(...),
    max_questions: Optional[int] = Form(None),
    resume: Optional[UploadFile] = File(None),
    jd: Optional[UploadFile] = File(None)
):
    session_id = str(uuid.uuid4())
    session_path = os.path.join(SESSIONS_DIR, f"{session_id}.json")
    
    resume_path = None
    jd_path = None
    
    if resume:
        resume_path = os.path.join(UPLOADS_DIR, f"{session_id}_resume.pdf")
        with open(resume_path, "wb") as f:
            shutil.copyfileobj(resume.file, f)
            
    if jd:
        jd_path = os.path.join(UPLOADS_DIR, f"{session_id}_jd.txt")
        with open(jd_path, "wb") as f:
            shutil.copyfileobj(jd.file, f)
            
    # Ingest into ChromaDB
    try:
        ingest_documents(resume_path, jd_path, session_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to ingest documents: {str(e)}")
    
    # Determine max questions
    final_max_q = max_questions if max_questions else (5 if difficulty == "easy" else 7 if difficulty == "medium" else 10)
    
    # Initialize session state
    session_data = {
        "session_id": session_id,
        "mode": mode,
        "difficulty": difficulty,
        "history": [],
        "current_question": None,
        "question_count": 0,
        "max_questions": final_max_q,
        "time_limit": 120 if difficulty == "easy" else 90 if difficulty == "medium" else 60
    }
    
    with open(session_path, "w") as f:
        json.dump(session_data, f)
        
    return {"session_id": session_id}

@app.post("/start")
async def start_interview(session_id: str = Query(...), difficulty: str = Query(...)):
    session_path = os.path.join(SESSIONS_DIR, f"{session_id}.json")
    if not os.path.exists(session_path):
        raise HTTPException(status_code=404, detail="Session not found")
        
    with open(session_path, "r") as f:
        session_data = json.load(f)
        
    # Retrieve context and generate first question
    context = retrieve_context("General introduction and background", session_id)
    first_question = engine.generate_initial_question(context, difficulty)
    
    session_data["current_question"] = first_question
    session_data["question_count"] = 1
    
    with open(session_path, "w") as f:
        json.dump(session_data, f)
        
    return {
        "question": first_question,
        "total_questions": session_data["max_questions"],
        "time_limit": session_data["time_limit"]
    }

@app.post("/answer")
async def submit_answer(req: AnswerRequest):
    session_path = os.path.join(SESSIONS_DIR, f"{req.session_id}.json")
    if not os.path.exists(session_path):
        raise HTTPException(status_code=404, detail="Session not found")
        
    with open(session_path, "r") as f:
        session_data = json.load(f)
        
    # Retrieve context for current question
    context = retrieve_context(session_data["current_question"], req.session_id)
    
    # Evaluate answer and get next question
    evaluation = engine.evaluate_answer(context, session_data["current_question"], req.answer)
    
    # Store in history
    session_data["history"].append({
        "question": session_data["current_question"],
        "answer": req.answer,
        "score": evaluation["score"],
        "feedback": evaluation["feedback"],
        "missing": evaluation["missing"]
    })
    
    if session_data["question_count"] >= session_data["max_questions"]:
        session_data["status"] = "completed"
        with open(session_path, "w") as f:
            json.dump(session_data, f)
        return {"status": "completed"}
    
    next_q = evaluation["next_question"]
    session_data["current_question"] = next_q
    session_data["question_count"] += 1
    
    with open(session_path, "w") as f:
        json.dump(session_data, f)
        
    return {
        "status": "next",
        "question": next_q,
        "question_number": session_data["question_count"]
    }

@app.get("/report")
async def get_report(session_id: str = Query(...)):
    session_path = os.path.join(SESSIONS_DIR, f"{session_id}.json")
    if not os.path.exists(session_path):
        raise HTTPException(status_code=404, detail="Session not found")
        
    with open(session_path, "r") as f:
        session_data = json.load(f)
        
    if not session_data.get("history"):
         raise HTTPException(status_code=400, detail="No interview history found")

    # Generate final report using LLM
    report = engine.generate_final_report(session_data["history"])
    return report

import glob
from datetime import datetime

@app.get("/history")
async def get_history():
    sessions = []
    session_files = glob.glob(os.path.join(SESSIONS_DIR, "*.json"))
    
    for sf in session_files:
        try:
            with open(sf, "r") as f:
                data = json.load(f)
                
            # Compute a rough score based on history
            score = 0
            if "history" in data and data["history"]:
                total = sum(item.get("score", 0) for item in data["history"])
                score = (total / len(data["history"])) * 10 # Scale up to 100
                
            sessions.append({
                "_id": data.get("session_id"),
                "difficulty": data.get("difficulty", "Unknown").capitalize(),
                "mode": data.get("mode", "Standard").capitalize(),
                "score": round(score),
                "qna": data.get("history", []),
                "generalFeedback": getattr(data, "summary", "A comprehensive technical interview session."),
                "createdAt": datetime.fromtimestamp(os.path.getmtime(sf)).isoformat() + "Z"
            })
        except Exception as e:
            continue
            
    # Sort descending by date
    sessions.sort(key=lambda x: x["createdAt"], reverse=True)
    return sessions

@app.post("/api/resumes")
async def save_resume(resume_data: dict):
    # Using dict to avoid strict Pydantic validation if frontend schema varies slightly
    resume_id = str(uuid.uuid4())
    resume_path = os.path.join(RESUMES_DIR, f"{resume_id}.json")
    
    resume_data["_id"] = resume_id
    resume_data["updatedAt"] = datetime.now().isoformat()
    
    with open(resume_path, "w") as f:
        json.dump(resume_data, f)
    
    return {"status": "saved", "id": resume_id}

@app.get("/api/resumes")
async def list_resumes():
    resumes = []
    resume_files = glob.glob(os.path.join(RESUMES_DIR, "*.json"))
    for rf in resume_files:
        try:
            with open(rf, "r") as f:
                resumes.append(json.load(f))
        except:
            continue
    resumes.sort(key=lambda x: x.get("updatedAt", ""), reverse=True)
    return resumes

@app.delete("/api/resumes/{resume_id}")
async def delete_resume(resume_id: str):
    resume_path = os.path.join(RESUMES_DIR, f"{resume_id}.json")
    if os.path.exists(resume_path):
        os.remove(resume_path)
        return {"status": "deleted"}
    raise HTTPException(status_code=404, detail="Resume not found")

# --- AUTH ENDPOINTS ---
def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()

@app.post("/api/auth/register")
async def register(user_data: dict):
    email = user_data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    
    user_file = os.path.join(USERS_DIR, f"{email}.json")
    if os.path.exists(user_file):
        raise HTTPException(status_code=400, detail="User already exists")
    
    user_data["password"] = hash_password(user_data["password"])
    user_data["createdAt"] = datetime.now().isoformat()
    
    with open(user_file, "w") as f:
        json.dump(user_data, f)
        
    # Don't return password
    del user_data["password"]
    return user_data

@app.post("/api/auth/login")
async def login(credentials: dict):
    email = credentials.get("email")
    password = credentials.get("password")
    
    user_file = os.path.join(USERS_DIR, f"{email}.json")
    if not os.path.exists(user_file):
        raise HTTPException(status_code=404, detail="User not found")
    
    with open(user_file, "r") as f:
        user_data = json.load(f)
        
    if user_data["password"] != hash_password(password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    del user_data["password"]
    return user_data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
