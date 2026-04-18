import os
from tavily import TavilyClient
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from backend.rag.retriever import retrieve_context  # ← add this line
load_dotenv()  # reads GROQ_API_KEY from .env file and makes it available via os.getenv()


def get_llm():
    # creates and returns a Groq LLM instance
    # called fresh each time so config can change between calls if needed

    return ChatGroq(
        api_key=os.getenv("GROQ_API_KEY"),      # reads key from .env file
        model_name="llama-3.3-70b-versatile",   # current active Groq model
        temperature=0.7
        # ↑ controls randomness of output
        # 0.0 = deterministic, always same answer
        # 1.0 = very random, creative but unpredictable
        # 0.7 = balanced — varied but still focused
    )


# ── prompt template for question generation ──────────────────────────────────
QUESTION_PROMPT = PromptTemplate(
    input_variables=["context", "num_questions", "difficulty"],
    # ↑ these are the placeholders in the template below
    # .format() replaces them with actual values at runtime

    template="""
You are an expert technical interviewer. Based on the candidate's resume and job description below, generate {num_questions} {difficulty} interview questions.

Rules:
- Questions must be specific to the candidate's actual experience and the JD requirements
- Do NOT ask generic questions like "tell me about yourself"
- Mix technical and situational questions
- Number each question
- Only return the questions, nothing else

Context from Resume and Job Description:
{context}

Generate {num_questions} {difficulty} interview questions:
"""
    # WHY strict rules in prompt: without them LLM adds preamble like
    # "Sure! Here are your questions:" which breaks our parsing logic below
)
def search_web_for_context(query: str) -> str:
    """
    Called when resume mentions something the LLM doesn't know well.
    e.g. obscure framework, niche technology, rare tool.
    Returns search results as additional context.
    """
    try:
        client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))
        results = client.search(
            query=f"technical interview questions about {query}",
            max_results=3         # get top 3 results
        )
        # extract just the text content from results
        snippets = [r.get("content", "") for r in results.get("results", [])]
        return "\n".join(snippets)
    except:
        return ""   # if search fails, just return empty — don't crash

def generate_questions(context: str, num_questions: int = 5, difficulty: str = "medium",include_intro: bool = False) -> list[str]:
    # context: retrieved RAG chunks (resume + JD text)
    # num_questions: how many questions to generate
    # difficulty: "easy", "medium", or "hard"
    # -> list[str]: returns clean list of question strings

    llm = get_llm()  # get fresh LLM instance

    check_prompt = f"""
Look at this resume/JD context and list any niche technologies, 
frameworks, or tools that are uncommon or specialized (not mainstream).
Reply with just comma-separated names, or "none" if everything is common.

Context: {context[:500]}
"""
    check_response = llm.invoke(check_prompt)
    rare_tech = check_response.content.strip()

    # if rare tech found, search web for additional context
    web_context = ""
    if rare_tech.lower() != "none" and rare_tech:
        print(f"Rare tech detected: {rare_tech} — searching web...")
        web_context = search_web_for_context(rare_tech)

    # combine RAG context with web search context
    full_context = context
    if web_context:
        full_context += f"\n\nAdditional context from web search:\n{web_context}"

    intro_instruction = ""
    if include_intro:
        intro_instruction = '- The FIRST question must always be "Tell me about yourself and walk me through your background."'


    prompt = f"""
You are an expert technical interviewer. Based on the candidate's resume and job description below, generate {num_questions} {difficulty} level interview questions.

Rules:
- Questions must be specific to the candidate's actual experience and the JD requirements
- Do NOT ask generic questions EXCEPT for the intro question if specified
- Mix technical and situational questions
- Number each question
- Only return the questions, nothing else
{intro_instruction}

Difficulty guidelines:
- easy: basic conceptual questions, definitions, simple scenarios
- medium: applied questions, design decisions, moderate problem solving  
- hard: complex system design, deep technical knowledge, edge cases

Context from Resume and Job Description:
{full_context}

Generate {num_questions} {difficulty} level interview questions:
"""
    response = llm.invoke(prompt)
    raw_output = response.content

    # ── parse numbered list into Python list ─────────────────────────────────
    lines = raw_output.strip().split("\n")  # split response into individual lines
    questions = []

    for line in lines:
        line = line.strip()              # remove leading/trailing whitespace

        if line and line[0].isdigit():   # only process lines that start with a number
            # this filters out blank lines and any preamble text

            # remove "1. " prefix → split on first "." and take everything after
            question = line.split(".", 1)[-1].strip()

            # also handle "1) " format → split on first ")" and take everything after
            question = question.split(")", 1)[-1].strip()

            questions.append(question)   # add clean question to list

    return questions


def score_answer(question: str, answer: str, vectorstore) -> dict:
    # question: the interview question that was asked
    # answer: the candidate's response
    # vectorstore: ChromaDB to retrieve relevant context for scoring
    # -> dict: returns score, feedback, and missing points

    llm = get_llm()  # get fresh LLM instance

    # retrieve context relevant to THIS specific question
    # so LLM knows what a good answer should cover
    context = retrieve_context(question, vectorstore)

    prompt = f"""
You are a brutal, honest technical interviewer. Score this answer out of 10.
Be harsh — a 7 means genuinely good. A 5 means average. Below 5 means poor.

Question: {question}

Candidate's Answer: {answer}

Context (what a good answer should cover):
{context}

Respond ONLY in this exact format:
SCORE: <number>/10
FEEDBACK: <2-3 sentences of brutal honest feedback>
MISSING: <what was missing from the answer>
"""
    # WHY strict format: we parse the response line by line below
    # if LLM adds extra text it breaks parsing

    response = llm.invoke(prompt)
    raw = response.content.strip()  # get text from response

    # ── parse structured response ─────────────────────────────────────────────
    score = 0       # default score if parsing fails
    feedback = ""   # default empty feedback
    missing = ""    # default empty missing

    for line in raw.split("\n"):        # go through response line by line
        if line.startswith("SCORE:"):
            try:
                # "SCORE: 7/10" → remove "SCORE:" → "7/10" → split on "/" → "7" → int
                score = int(line.replace("SCORE:", "").strip().split("/")[0])
            except:
                score = 0   # if parsing fails, default to 0

        elif line.startswith("FEEDBACK:"):
            feedback = line.replace("FEEDBACK:", "").strip()  # remove label, keep text

        elif line.startswith("MISSING:"):
            missing = line.replace("MISSING:", "").strip()    # remove label, keep text

    return {
        "score": score,
        "feedback": feedback,
        "missing": missing
    }


def generate_report(questions: list, answers: list, scores: list) -> dict:
    # questions: list of all 5 questions asked
    # answers: list of all 5 candidate answers
    # scores: list of dicts from score_answer() — each has score, feedback, missing
    # -> dict: full report with overall score, verdict, summary, pros, cons, breakdown

    llm = get_llm()

    # calculate overall score — average of all individual scores
    total = sum(s["score"] for s in scores)         # add up all scores
    overall = round(total / len(scores), 1)          # divide by count, round to 1 decimal

    # build full transcript string for LLM to analyze
    transcript = ""
    for i, (q, a, s) in enumerate(zip(questions, answers, scores)):
        # zip() combines three lists element by element
        # enumerate() gives us the index i starting from 0
        transcript += f"""
Q{i+1}: {q}
Answer: {a}
Score: {s['score']}/10
Feedback: {s['feedback']}
---"""

    prompt = f"""
You are a brutally honest technical recruiter writing a candidate report.
Overall score: {overall}/10

Full interview transcript:
{transcript}

Write a report in this EXACT format:
SUMMARY: <3-4 sentences recruiter summary — honest, no sugarcoating>
PROS:
- <genuine strength 1>
- <genuine strength 2>
- <genuine strength 3>
CONS:
- <real weakness 1>
- <real weakness 2>
- <real weakness 3>
VERDICT: <EXCELLENT FIT / GOOD FIT / AVERAGE FIT / NOT A FIT>
"""

    response = llm.invoke(prompt)
    raw = response.content.strip()

    # ── parse the report into structured data ─────────────────────────────────
    summary = ""
    pros = []           # list of strength strings
    cons = []           # list of weakness strings
    verdict = ""
    current_section = None  # tracks which section we're currently parsing

    for line in raw.split("\n"):
        line = line.strip()

        if line.startswith("SUMMARY:"):
            summary = line.replace("SUMMARY:", "").strip()
            current_section = None      # not inside a list section

        elif line.startswith("PROS:"):
            current_section = "pros"    # next bullet lines go into pros list

        elif line.startswith("CONS:"):
            current_section = "cons"    # next bullet lines go into cons list

        elif line.startswith("VERDICT:"):
            verdict = line.replace("VERDICT:", "").strip()
            current_section = None

        elif line.startswith("-") and current_section == "pros":
            pros.append(line[1:].strip())   # remove "- " prefix and add to pros

        elif line.startswith("-") and current_section == "cons":
            cons.append(line[1:].strip())   # remove "- " prefix and add to cons

    return {
        "overall_score": overall,       # e.g. 7.4
        "verdict": verdict,             # e.g. "GOOD FIT"
        "summary": summary,             # recruiter summary paragraph
        "pros": pros,                   # list of strength strings
        "cons": cons,                   # list of weakness strings
        "breakdown": [                  # per-question detail
            {
                "question": q,
                "answer": a,
                "score": s["score"],
                "feedback": s["feedback"],
                "missing": s["missing"]
            }
            for q, a, s in zip(questions, answers, scores)
            # zip() pairs each question with its answer and score
        ]
    }