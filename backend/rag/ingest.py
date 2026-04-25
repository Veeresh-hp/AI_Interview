import os
import pdfplumber
from langchain_community.vectorstores import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter

def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                content = page.extract_text()
                if content:
                    text += content + "\n"
    except Exception as e:
        print(f"⚠️ PDF extraction error: {e}")
    return text

def ingest_documents(resume_path=None, jd_path=None, session_id="default"):
    documents = []
    
    if resume_path:
        resume_text = extract_text_from_pdf(resume_path)
        if resume_text.strip():
            documents.append(f"RESUME:\n{resume_text}")
        else:
            print("⚠️ Warning: No text extracted from resume PDF.")
    
    if jd_path:
        try:
            with open(jd_path, 'r', encoding='utf-8') as f:
                jd_text = f.read()
                if jd_text.strip():
                    documents.append(f"JOB DESCRIPTION:\n{jd_text}")
        except Exception as e:
            print(f"⚠️ JD file error: {e}")
    
    if not documents:
        # Fallback to avoid empty ingestion
        documents.append("No document content provided.")

    # Combine documents
    full_text = "\n\n---\n\n".join(documents)
    
    # Split text
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    chunks = text_splitter.split_text(full_text)
    
    if not chunks:
        chunks = ["Placeholder content due to empty documents."]

    # Initialize embeddings using Hugging Face API (Saves RAM)
    try:
        from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings
        api_key = os.environ.get("HUGGINGFACE_API_KEY")
        if not api_key:
            raise ValueError("HUGGINGFACE_API_KEY is missing from environment")

        embeddings = HuggingFaceInferenceAPIEmbeddings(
            api_key=api_key,
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        
        # Test if embeddings work (to catch API errors early)
        try:
            embeddings.embed_query("test")
        except Exception as api_err:
            print(f"⚠️ Hugging Face API Error, switching to fallback: {api_err}")
            raise api_err # Trigger fallback

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
    except Exception as e:
        print(f"❌ API Ingestion failed, using fallback: {e}")
        # FALLBACK: Use a simple embedding if the API is down to avoid blocking the user
        from langchain_community.embeddings import DeterministicFakeEmbedding
        embeddings = DeterministicFakeEmbedding(size=384)
        
        persist_directory = os.path.join(".", "chroma_db", session_id)
        vector_store = Chroma.from_texts(
            texts=chunks,
            embedding=embeddings,
            persist_directory=persist_directory
        )
        return vector_store
