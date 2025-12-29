import os
import json
from typing import List
from pdfminer.high_level import extract_text
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def load_skills() -> List[str]:
    """Load skills from skills.json file."""
    try:
        # Get the directory where utils.py is located
        current_dir = os.path.dirname(os.path.abspath(__file__))
        skills_path = os.path.join(current_dir, 'skills.json')
        
        with open(skills_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading skills: {e}")
        # Return a default list if the file can't be loaded
        return [
            'Python', 'Java', 'JavaScript', 'TypeScript', 'React', 'Node.js',
            'Docker', 'AWS', 'SQL', 'Machine Learning', 'Git'
        ]

# Load skills from JSON
SKILLS_DB = load_skills()

def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from a PDF file."""
    try:
        text = extract_text(file_path)
        return ' '.join(text.split())  # Clean whitespace
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""

def extract_skills(text: str) -> List[str]:
    """Extract skills from text by matching against SKILLS_DB."""
    text_lower = text.lower()
    found_skills = set()
    
    for skill in SKILLS_DB:
        if skill.lower() in text_lower:
            found_skills.add(skill)
    
    return list(found_skills)

def calculate_similarity(resume_text: str, job_desc: str) -> float:
    """Calculate similarity using TF-IDF and cosine similarity."""
    if not resume_text or not job_desc:
        return 0.0
    
    try:
        documents = [resume_text, job_desc]
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(documents)
        
        # Calculate cosine similarity
        similarity_matrix = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
        
        # Convert to percentage (0-100)
        return max(0.0, min(100.0, round(float(similarity_matrix[0][0]) * 100, 2)))
        
    except Exception as e:
        print(f"Error calculating similarity: {e}")
        return 0.0