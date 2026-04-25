import os
import json
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import SystemMessage, HumanMessage
from dotenv import load_dotenv

load_dotenv()

class QuestionEngine:
    def __init__(self, model_name="llama-3.3-70b-versatile"):
        self.llm = ChatGroq(
            api_key=os.getenv("GROQ_API_KEY"),
            model_name=model_name,
            temperature=0.7
        )

    def generate_initial_question(self, context, difficulty):
        prompt = f"""
        You are an expert HR interviewer. Based on the following Candidate Profile (Resume and/or Job Description), 
        generate the first technical or behavioral interview question.
        
        Difficulty level: {difficulty}
        
        Candidate Profile Context:
        {context}
        
        Instructions:
        - If difficulty is 'easy', focus on basics and introductory questions.
        - If difficulty is 'medium', focus on project experience and specific skills.
        - If difficulty is 'hard', focus on deep technical concepts, architecture, and problem-solving.
        - Keep the question concise and professional.
        
        Return ONLY the question text.
        """
        response = self.llm.invoke([SystemMessage(content="You are a professional AI Interviewer."), HumanMessage(content=prompt)])
        return response.content.strip()

    def evaluate_answer(self, context, question, answer):
        if not answer or len(answer.strip()) < 3:
            return {
                "score": 0,
                "feedback": "You did not provide an answer.",
                "missing": "Everything is missing. Please provide a detailed response next time.",
                "next_question": "Let's move on to the next topic. Can you tell me about your past experience?"
            }
            
        prompt = f"""
        Evaluate the candidate's answer based on the provided context.
        
        Context:
        {context}
        
        Question:
        {question}
        
        Candidate's Answer:
        {answer}
        
        Provide a JSON response with:
        - "score": (int 0-10)
        - "feedback": (string, what was good)
        - "missing": (string, what could be improved or was missing)
        - "next_question": (string, a follow-up or new question based on the performance)
        
        Return ONLY valid JSON.
        """
        response = self.llm.invoke([SystemMessage(content="You are an expert technical interviewer evaluator. Return JSON only."), HumanMessage(content=prompt)])
        try:
            # Strip markdown code blocks if necessary
            content = response.content.strip()
            if content.startswith("```json"):
                content = content[7:-3].strip()
            elif content.startswith("```"):
                content = content[3:-3].strip()
            return json.loads(content)
        except Exception as e:
            print(f"Error parsing JSON: {e}")
            return {
                "score": 5,
                "feedback": "Answer received.",
                "missing": "Could not generate detailed feedback.",
                "next_question": "Tell me more about your experience with this topic."
            }

    def generate_final_report(self, session_data):
        prompt = f"""
        Generate a final interview report based on the following session history:
        
        Session Data:
        {json.dumps(session_data, indent=2)}
        
        Provide a JSON response with:
        - "overall_score": (int 0-10)
        - "verdict": (string: 'EXCELLENT FIT', 'GOOD FIT', 'AVERAGE FIT', or 'NOT A FIT')
        - "summary": (string, 2-3 sentences overall evaluation)
        - "pros": (list of strings, top strengths)
        - "cons": (list of strings, areas for improvement)
        - "skills": {
            "Technical": (int 0-100),
            "Communication": (int 0-100),
            "Clarity": (int 0-100),
            "Problem Solving": (int 0-100),
            "Confidence": (int 0-100)
          }
        - "breakdown": (list of objects with "question", "answer", "score", "feedback", "missing")
        
        Return ONLY valid JSON.
        """
        response = self.llm.invoke([SystemMessage(content="You are a senior recruiter generating a final report. Return JSON only."), HumanMessage(content=prompt)])
        try:
            content = response.content.strip()
            if content.startswith("```json"):
                content = content[7:-3].strip()
            elif content.startswith("```"):
                content = content[3:-3].strip()
            return json.loads(content)
        except Exception as e:
            return {"error": "Failed to generate report"}
