# AI Interviewer

An AI-powered interview simulator that creates personalized interview questions from a resume and job description, evaluates answers honestly, and generates a detailed performance report.

---

## Features

* Resume-based, JD-based, or combined interview modes
* Easy, Medium, and Hard difficulty levels
* Personalized questions generated using RAG
* Countdown timer for each question
* Brutally honest answer scoring
* Detailed report with strengths, weaknesses, and verdict
* Optional web search fallback for uncommon technologies

---

## Tech Stack

| Layer           | Technology                                 |
| --------------- | ------------------------------------------ |
| Frontend        | React, Vite, React Router                  |
| Backend         | FastAPI, Uvicorn                           |
| LLM             | Groq - Llama 3.3 70B                       |
| Vector Database | ChromaDB                                   |
| Embeddings      | sentence-transformers (`all-MiniLM-L6-v2`) |
| RAG Framework   | LangChain                                  |
| PDF Parsing     | pdfplumber                                 |
| Optional Search | Tavily                                     |

---

## Project Structure

```text
ai-interviewer/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── rag/
│       ├── ingest.py
│       ├── retriever.py
│       └── question_engine.py
│
├── frontend/
│   ├── package.json
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       └── pages/
│           ├── Upload.jsx
│           ├── Interview.jsx
│           └── Report.jsx
│
├── .env
├── .gitignore
└── README.md
```

---

## Interview Modes

| Mode        | Required Files           | Description                                            |
| ----------- | ------------------------ | ------------------------------------------------------ |
| Resume Only | Resume PDF               | Generates questions only from the resume               |
| JD Only     | Job Description TXT      | Generates questions only from the job description      |
| Resume + JD | Resume + Job Description | Creates realistic interview questions tailored to both |

---

## Difficulty Levels

| Difficulty | Questions | Time Per Question | Intro Question |
| ---------- | --------- | ----------------- | -------------- |
| Easy       | 5         | 2 minutes         | Yes            |
| Medium     | 7         | 90 seconds        | Yes            |
| Hard       | 10        | 60 seconds        | No             |

---

## How It Works

```text
Resume PDF / JD TXT
        ↓
Text Extraction
        ↓
Chunking using LangChain
        ↓
Embeddings using all-MiniLM-L6-v2
        ↓
Store vectors in ChromaDB
        ↓
Retrieve most relevant chunks
        ↓
Send context to Groq Llama 3.3 70B
        ↓
Generate interview questions and score answers
```

---

## API Endpoints

| Method | Endpoint  | Purpose                                     |
| ------ | --------- | ------------------------------------------- |
| POST   | `/upload` | Upload resume and/or job description        |
| POST   | `/start`  | Start interview and generate first question |
| POST   | `/answer` | Submit answer and receive next question     |
| GET    | `/report` | Get final interview report                  |

---

## Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/ai-interviewer.git
cd ai-interviewer
```

### 2. Backend Setup

```bash
python -m venv .venv
```

#### Windows

```bash
.venv\Scripts\activate
```

#### Mac/Linux

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install fastapi uvicorn python-multipart pdfplumber
pip install langchain langchain-community langchain-groq
pip install chromadb sentence-transformers
pip install python-dotenv groq tavily-python
```

Create a `.env` file:

```env
GROQ_API_KEY=your_groq_api_key
TAVILY_API_KEY=your_tavily_api_key
```

Run backend:

```bash
uvicorn backend.main:app --reload
```

Backend runs on:

```text
http://localhost:8000
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## Example Flow

1. Upload resume and/or job description
2. Select difficulty level
3. Start interview
4. Answer each question before the timer ends
5. View final report with score and feedback

---

## Sample Report Output

```text
Overall Score: 7.4 / 10
Verdict: Good Fit

Strengths:
- Strong project explanations
- Good understanding of backend concepts

Weaknesses:
- Weak confidence in system design
- Missed edge cases in coding questions
```

---

## Future Improvements

* Voice-based answers
* Authentication and saved interview history
* Export report as PDF
* Deploy using Railway and Vercel
* Add plagiarism and tab-switch detection

---

## Author

**T J Shashank**

* GitHub: [https://github.com/ShashankTallam](https://github.com/ShashankTallam)
* LinkedIn: [https://linkedin.com/in/your-profile](https://linkedin.com/in/your-profile)

---

## License

This project is licensed under the MIT License.
