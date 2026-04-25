import os
import pdfplumber
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

def extract_text_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text

def ingest_documents(resume_path=None, jd_path=None, session_id="default"):
    documents = []
    
    if resume_path:
        resume_text = extract_text_from_pdf(resume_path)
        documents.append(f"RESUME:\n{resume_text}")
    
    if jd_path:
        with open(jd_path, 'r', encoding='utf-8') as f:
            jd_text = f.read()
            documents.append(f"JOB DESCRIPTION:\n{jd_text}")
    
    if not documents:
        return None

    # Combine documents
    full_text = "\n\n---\n\n".join(documents)
    
    # Split text
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    chunks = text_splitter.split_text(full_text)
    
    # Initialize embeddings
    embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
    
    # Create vector store
    IS_VERCEL = os.environ.get("VERCEL") == "1"
    BASE_DATA_DIR = "/tmp" if IS_VERCEL else "."
    persist_directory = os.path.join(BASE_DATA_DIR, "chroma_db", session_id)
    vector_store = Chroma.from_texts(
        texts=chunks,
        embedding=embeddings,
        persist_directory=persist_directory
    )
    
    return vector_store
