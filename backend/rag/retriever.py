import os
from langchain_community.vectorstores import Chroma

def get_retriever(session_id):
    from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings
    embeddings = HuggingFaceInferenceAPIEmbeddings(
        api_key=os.environ.get("HUGGINGFACE_API_KEY"),
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
    IS_VERCEL = os.environ.get("VERCEL") == "1"
    BASE_DATA_DIR = "/tmp" if IS_VERCEL else "."
    persist_directory = os.path.join(BASE_DATA_DIR, "chroma_db", session_id)
    
    if not os.path.exists(persist_directory):
        return None
        
    vector_store = Chroma(
        persist_directory=persist_directory,
        embedding_function=embeddings
    )
    return vector_store.as_retriever(search_kwargs={"k": 3})

def retrieve_context(query, session_id):
    retriever = get_retriever(session_id)
    if not retriever:
        return ""
    
    docs = retriever.get_relevant_documents(query)
    return "\n\n".join([doc.page_content for doc in docs])
