"""
Clinical Knowledge Base Ingestion Script for BMD-HS RosaNet
Indexes ACC/AHA 2020 guidelines, auscultation biomechanics, and pathophysiology into ChromaDB
using local Ollama all-minilm embeddings.
"""

import os
import glob
import chromadb
from chromadb.utils import embedding_functions

def get_disease_code(text: str) -> str:
    text_upper = text.upper()
    if "AORTIC STENOSIS" in text_upper or "(AS)" in text_upper:
        return "AS"
    if "AORTIC REGURGITATION" in text_upper or "(AR)" in text_upper:
        return "AR"
    if "MITRAL REGURGITATION" in text_upper or "(MR)" in text_upper:
        return "MR"
    if "MITRAL STENOSIS" in text_upper or "(MS)" in text_upper:
        return "MS"
    if "NORMAL" in text_upper or "PHYSIOLOGICAL" in text_upper:
        return "Normal"
    return "GENERAL"

def get_slot_type(filename: str) -> str:
    if "auscultation" in filename.lower():
        return "acoustic"
    elif "acc_aha" in filename.lower():
        return "guideline"
    elif "pathophysiology" in filename.lower():
        return "pathophysiology"
    return "general"

def ingest_knowledge_base():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    knowledge_dir = os.path.join(script_dir, "knowledge")
    chroma_db_dir = os.path.join(script_dir, "chroma_db")
    
    os.makedirs(chroma_db_dir, exist_ok=True)
    
    client = chromadb.PersistentClient(path=chroma_db_dir)
    
    # 100% Local Ollama Embedding Function (all-minilm)
    embed_fn = embedding_functions.OllamaEmbeddingFunction(
        url="http://localhost:11434/api/embeddings",
        model_name="all-minilm"
    )
    
    collection = client.get_or_create_collection(
        name="cardiology_guidelines",
        embedding_function=embed_fn,
        metadata={"hnsw:space": "cosine"}
    )
    
    files = glob.glob(os.path.join(knowledge_dir, "*.md"))
    print(f"Found {len(files)} knowledge files in {knowledge_dir}")
    
    total_chunks = 0
    for filepath in sorted(files):
        filename = os.path.basename(filepath)
        slot_type = get_slot_type(filename)
        
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
            
        sections = content.split("### ")
        for idx, sec in enumerate(sections):
            sec_clean = sec.strip()
            if not sec_clean:
                continue
            
            lines = sec_clean.split("\n")
            header = lines[0].strip()
            disease = get_disease_code(header)
            
            doc_id = f"{filename.replace('.md', '')}_{disease}_{idx}"
            full_text = f"### {sec_clean}"
            
            metadata = {
                "source": filename,
                "section": header,
                "disease": disease,
                "slot": slot_type
            }
            
            collection.upsert(
                documents=[full_text],
                metadatas=[metadata],
                ids=[doc_id]
            )
            total_chunks += 1
            print(f"Indexed [{slot_type.upper():<15}] {disease:<6} -> {header}")
            
    print(f"\nSuccessfully indexed {total_chunks} clinical chunks into {chroma_db_dir}")

if __name__ == "__main__":
    ingest_knowledge_base()
