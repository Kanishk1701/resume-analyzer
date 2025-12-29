from pdfminer.high_level import extract_text
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# List of skills to search for in resumes
SKILLS_DB = [
    'Python', 'Java', 'React', 'Next.js', 'FastAPI', 'Node.js', 'Django', 'Flask',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'SQL', 'PostgreSQL', 'MongoDB',
    'Machine Learning', 'Data Science', 'Deep Learning', 'NLP', 'Computer Vision',
    'Git', 'Linux', 'REST API', 'GraphQL', 'TypeScript', 'JavaScript', 'HTML', 'CSS',
    'Communication', 'Teamwork', 'Problem Solving', 'Leadership', 'Project Management'
]

def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from a PDF file."""
    try:
        text = extract_text(file_path)
        return ' '.join(text.split()) # Clean whitespace
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""

def extract_skills(text: str) -> list:
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