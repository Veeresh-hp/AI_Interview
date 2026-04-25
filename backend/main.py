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
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

from rag.ingest import ingest_documents
from rag.retriever import retrieve_context
from rag.question_engine import QuestionEngine

app = FastAPI()
print("🚀 Backend server is initializing...")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories
IS_VERCEL = os.environ.get("VERCEL") == "1"
BASE_DATA_DIR = "/tmp" if IS_VERCEL else "."

UPLOADS_DIR = os.path.join(BASE_DATA_DIR, "uploads")
SESSIONS_DIR = os.path.join(BASE_DATA_DIR, "sessions")
RESUMES_DIR = os.path.join(BASE_DATA_DIR, "resumes")
USERS_DIR = os.path.join(BASE_DATA_DIR, "users")

os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(SESSIONS_DIR, exist_ok=True)
os.makedirs(RESUMES_DIR, exist_ok=True)
os.makedirs(USERS_DIR, exist_ok=True)

# MongoDB Initialization
MONGODB_URI = os.environ.get("MONGODB_URI")
if not MONGODB_URI:
    # Fallback for local testing if .env isn't loaded correctly
    MONGODB_URI = "mongodb://localhost:27017"

client = MongoClient(MONGODB_URI)
db = client['resume_ai']
users_col = db['users']
resumes_col = db['resumes']
sessions_col = db['sessions']

engine = QuestionEngine()

class AnswerRequest(BaseModel):
    session_id: str
    answer: str

@app.post("/api/upload")
async def upload_files(
    mode: str = Form(...),
    difficulty: str = Form(...),
    max_questions: Optional[int] = Form(None),
    userEmail: Optional[str] = Form(None),
    resume: Optional[UploadFile] = File(None),
    jd: Optional[UploadFile] = File(None)
):
    session_id = str(uuid.uuid4())
    
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
        "_id": session_id,
        "session_id": session_id,
        "mode": mode,
        "difficulty": difficulty,
        "history": [],
        "current_question": None,
        "question_count": 0,
        "max_questions": final_max_q,
        "userEmail": userEmail,
        "time_limit": 120 if difficulty == "easy" else 90 if difficulty == "medium" else 60,
        "createdAt": datetime.now().isoformat()
    }
    
    sessions_col.insert_one(session_data)
        
    return {"session_id": session_id}

@app.post("/api/start")
async def start_interview(session_id: str = Query(...), difficulty: str = Query(...)):
    session_data = sessions_col.find_one({"_id": session_id})
    if not session_data:
        raise HTTPException(status_code=404, detail="Session not found")
        
    # Retrieve context and generate first question
    context = retrieve_context("General introduction and background", session_id)
    first_question = engine.generate_initial_question(context, difficulty)
    
    sessions_col.update_one(
        {"_id": session_id},
        {"$set": {"current_question": first_question, "question_count": 1}}
    )
        
    return {
        "question": first_question,
        "total_questions": session_data["max_questions"],
        "time_limit": session_data["time_limit"]
    }

@app.post("/api/answer")
async def submit_answer(req: AnswerRequest):
    session_data = sessions_col.find_one({"_id": req.session_id})
    if not session_data:
        raise HTTPException(status_code=404, detail="Session not found")
        
    # Retrieve context for current question
    context = retrieve_context(session_data["current_question"], req.session_id)
    
    # Evaluate answer and get next question
    evaluation = engine.evaluate_answer(context, session_data["current_question"], req.answer)
    
    # Update history and session state
    new_history_item = {
        "question": session_data["current_question"],
        "answer": req.answer,
        "score": evaluation["score"],
        "feedback": evaluation["feedback"],
        "missing": evaluation["missing"]
    }
    
    new_count = session_data["question_count"]
    status = "next"
    next_q = evaluation["next_question"]
    
    if new_count >= session_data["max_questions"]:
        status = "completed"
    else:
        new_count += 1

    sessions_col.update_one(
        {"_id": req.session_id},
        {
            "$push": {"history": new_history_item},
            "$set": {
                "current_question": next_q if status == "next" else None,
                "question_count": new_count,
                "status": status
            }
        }
    )
        
    if status == "completed":
        return {"status": "completed"}
        
    return {
        "status": "next",
        "question": next_q,
        "question_number": new_count
    }

@app.get("/api/report")
async def get_report(session_id: str = Query(...)):
    session_data = sessions_col.find_one({"_id": session_id})
    if not session_data:
        raise HTTPException(status_code=404, detail="Session not found")
        
    if not session_data.get("history"):
         raise HTTPException(status_code=400, detail="No interview history found")

    # Generate final report using LLM
    report = engine.generate_final_report(session_data["history"])
    return report

import glob
from datetime import datetime

@app.get("/api/history")
async def get_history(userEmail: Optional[str] = Query(None)):
    query = {"userEmail": userEmail} if userEmail else {}
    results = sessions_col.find(query).sort("createdAt", -1)
    
    sessions = []
    for data in results:
        try:
            # Compute a rough score based on history
            score = 0
            if "history" in data and data["history"]:
                total = sum(item.get("score", 0) for item in data["history"])
                score = (total / len(data["history"])) * 10 # Scale up to 100
                
            sessions.append({
                "_id": str(data.get("_id")),
                "difficulty": data.get("difficulty", "Unknown").capitalize(),
                "mode": data.get("mode", "Standard").capitalize(),
                "score": round(score),
                "qna": data.get("history", []),
                "generalFeedback": data.get("summary", "A comprehensive technical interview session."),
                "createdAt": data.get("createdAt")
            })
        except Exception as e:
            continue
            
    return sessions

@app.post("/api/resumes")
async def save_resume(resume_data: dict):
    resume_id = str(uuid.uuid4())
    resume_data["_id"] = resume_id
    resume_data["updatedAt"] = datetime.now().isoformat()
    
    resumes_col.insert_one(resume_data)
    return {"status": "saved", "id": resume_id}

@app.get("/api/resumes")
async def list_resumes(userEmail: Optional[str] = Query(None)):
    query = {"userEmail": userEmail} if userEmail else {}
    results = list(resumes_col.find(query).sort("updatedAt", -1))
    for r in results:
        if "_id" in r: r["_id"] = str(r["_id"])
    return results

@app.delete("/api/resumes/{resume_id}")
async def delete_resume(resume_id: str):
    result = resumes_col.delete_one({"_id": resume_id})
    if result.deleted_count > 0:
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
    
    if users_col.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="User already exists")
    
    user_data["password"] = hash_password(user_data["password"])
    user_data["createdAt"] = datetime.now().isoformat()
    
    users_col.insert_one(user_data)
        
    # Don't return password
    if "_id" in user_data: del user_data["_id"] # Remove ObjectId for JSON serialization
    del user_data["password"]
    return user_data

@app.post("/api/auth/login")
async def login(credentials: dict):
    email = credentials.get("email")
    password = credentials.get("password")
    
    user_data = users_col.find_one({"email": email})
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user_data["password"] != hash_password(password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    if "_id" in user_data: del user_data["_id"]
    del user_data["password"]
    return user_data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
