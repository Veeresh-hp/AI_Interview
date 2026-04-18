# retriever.py — loads the saved ChromaDB and retrieves relevant chunks for a query

from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings


def load_vector_store(persist_dir: str = "./chroma_db") -> Chroma:
    """Load the already-built vector store from disk."""
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    return Chroma(
        persist_directory=persist_dir,
        embedding_function=embeddings,
        collection_name="interview_context"
    )


def retrieve_context(query: str, vectorstore: Chroma, k: int = 5) -> str:
    """
    Given a query (e.g. "Python skills" or "required experience"),
    find the k most similar chunks from resume + JD.
    
    similarity_search uses cosine similarity between the query embedding
    and all stored chunk embeddings — returns the closest ones.
    
    WHY k=5: enough context for the LLM without overloading the prompt.
    """
    docs = vectorstore.similarity_search(query, k=k)
    
    # Combine chunks into one string, labelled by source
    context_parts = []
    for doc in docs:
        source = doc.metadata.get("source", "unknown")
        context_parts.append(f"[{source.upper()}]\n{doc.page_content}")
    
    return "\n\n---\n\n".join(context_parts)