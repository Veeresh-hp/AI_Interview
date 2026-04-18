import os                          # used to check if folders/files exist
import re                          # used for regex to fix missing spaces in PDF text
import shutil                      # used to delete old ChromaDB folder before rebuilding
from typing import Optional        # allows function params to be None (optional)

import pdfplumber                  # reads text out of PDF files page by page

from langchain_text_splitters import RecursiveCharacterTextSplitter
# ↑ splits long text into smaller overlapping chunks
# "Recursive" means it tries to split on paragraphs first, then lines, then sentences

from langchain_community.vectorstores import Chroma
# ↑ ChromaDB wrapper — stores and searches text chunks as vectors

from langchain_community.embeddings import HuggingFaceEmbeddings
# ↑ loads a local embedding model that converts text into numbers (vectors)
# runs on your machine, no API key needed


# ── splitter is created once here and reused everywhere ──────────────────────
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,       # each chunk is max 500 characters long
    chunk_overlap=50,     # last 50 chars of chunk N appear at start of chunk N+1
                          # WHY: so a sentence split across two chunks isn't lost
    separators=["\n\n", "\n", ". ", " ", ""]
    # ↑ tries to split on double newline (paragraph) first
    # then single newline, then period+space (sentence), then word, then character
    # always prefers the most natural split point
)


def extract_text_from_pdf(pdf_path: str) -> str:
    # pdf_path: full path to the PDF file e.g. "./sessions/abc/resume.pdf"
    # -> str: returns one big string of all text from all pages

    full_text = ""                          # start with empty string

    with pdfplumber.open(pdf_path) as pdf:  # open PDF (auto-closes after block)
        for page in pdf.pages:              # loop through every page
            page_text = page.extract_text() # extract raw text from this page
            if page_text:                   # skip None (blank or image-only pages)
                full_text += page_text + "\n"  # add page text + newline separator

    # fix missing spaces between words — common Windows PDF issue
    # e.g. "AspiringSoftwareDeveloper" → "Aspiring Software Developer"
    # regex explanation: find lowercase letter followed by uppercase letter
    # and insert a space between them
    full_text = re.sub(r'([a-z])([A-Z])', r'\1 \2', full_text)

    return full_text.strip()  # strip() removes leading/trailing whitespace


def extract_text_from_txt(txt_path: str) -> str:
    # txt_path: path to plain text JD file
    # -> str: returns the full text content

    with open(txt_path, "r", encoding="utf-8") as f:
        # encoding="utf-8" handles special chars like bullet points •, em-dashes —
        return f.read().strip()  # read entire file and strip whitespace


def build_vector_store(
    resume_path: Optional[str],   # path to resume PDF — can be None if mode is "jd"
    jd_path: Optional[str],       # path to JD text file — can be None if mode is "resume"
    mode: str,                    # "resume", "jd", or "both" — controls what gets embedded
    persist_dir: str = "./chroma_db"  # folder where ChromaDB saves its data to disk
):
    # wipe old ChromaDB folder so we don't get duplicate chunks from previous runs
    if os.path.exists(persist_dir):     # check if folder already exists
        shutil.rmtree(persist_dir)      # delete entire folder and all contents

    texts = []      # list of raw text strings to embed
    metadatas = []  # list of dicts — one per chunk — stores where chunk came from

    # ── process resume if mode includes it ───────────────────────────────────
    if mode in ("resume", "both") and resume_path:
        # only process resume if mode is "resume" or "both" AND file path is given

        resume_text = extract_text_from_pdf(resume_path)  # extract raw text
        print(f"Resume: {len(resume_text)} characters")    # debug: confirm extraction

        for chunk in splitter.split_text(resume_text):
            # split_text returns a list of chunk strings
            texts.append(chunk)                        # add chunk text to list
            metadatas.append({"source": "resume"})    # tag it as coming from resume
            # WHY metadata: lets us later filter "only show resume chunks" in retrieval

    # ── process JD if mode includes it ───────────────────────────────────────
    if mode in ("jd", "both") and jd_path:
        # only process JD if mode is "jd" or "both" AND file path is given

        jd_text = extract_text_from_txt(jd_path)      # extract raw text
        print(f"JD: {len(jd_text)} characters")        # debug: confirm extraction

        for chunk in splitter.split_text(jd_text):
            texts.append(chunk)                        # add chunk text to list
            metadatas.append({"source": "jd"})         # tag it as coming from JD

    # ── embed and store ───────────────────────────────────────────────────────
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    # ↑ loads the embedding model
    # "all-MiniLM-L6-v2" converts text to 384-dimensional vectors
    # small, fast, good enough for this use case
    # first run downloads ~90MB model, then it's cached locally

    vectorstore = Chroma.from_texts(
        texts=texts,                        # list of chunk strings to embed
        embedding=embeddings,               # model that converts text → vectors
        metadatas=metadatas,                # source tags for each chunk
        persist_directory=persist_dir,      # save to disk so server restart doesn't lose data
        collection_name="interview_context" # name of this collection in ChromaDB
        # WHY collection_name: lets you have multiple collections in same DB
    )

    print(f"Stored {len(texts)} chunks in ChromaDB")
    return vectorstore  # return the vectorstore object for immediate use