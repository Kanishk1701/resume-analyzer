from pdfminer.high_level import extract_text
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load the English language model
nlp = spacy.load('en_core_web_sm')

# List of skills to search for in resumes
SKILLS_DB = [
    'Python', 'Java', 'React', 'Next.js', 'FastAPI', 'Node.js', 'Django', 'Flask',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'SQL', 'PostgreSQL', 'MongoDB',
    'Machine Learning', 'Data Science', 'Deep Learning', 'NLP', 'Computer Vision',
    'Git', 'Linux', 'REST API', 'GraphQL', 'TypeScript', 'JavaScript', 'HTML', 'CSS',
    'Communication', 'Teamwork', 'Problem Solving', 'Leadership', 'Project Management'
]

def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text from a PDF file.
    
    Args:
        file_path (str): Path to the PDF file
        
    Returns:
        str: Extracted text, or empty string if an error occurs
    """
    try:
        text = extract_text(file_path)
        # Basic cleaning: replace multiple whitespace/newlines with single space
        return ' '.join(text.split())
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""

def extract_skills(text: str) -> list:
    """
    Extract skills from text by matching against a predefined list of skills.
    
    Args:
        text (str): Input text to extract skills from
        
    Returns:
        list: List of unique skills found in the text
    """
    # Convert text to lowercase for case-insensitive matching
    text_lower = text.lower()
    found_skills = set()
    
    # Check for each skill in the text
    for skill in SKILLS_DB:
        # Convert skill to lowercase for case-insensitive matching
        if skill.lower() in text_lower:
            found_skills.add(skill)
    
    return list(found_skills)

def calculate_similarity(resume_text: str, job_desc: str) -> float:
    """
    Calculate the similarity between resume text and job description using TF-IDF and cosine similarity.
    
    Args:
        resume_text (str): Text extracted from the resume
        job_desc (str): Job description text
        
    Returns:
        float: Similarity score as a percentage (0-100), rounded to 2 decimal places
    """
    # Handle empty inputs
    if not resume_text or not job_desc:
        return 0.0
    
    try:
        # Create a list of documents
        documents = [resume_text, job_desc]
        
        # Initialize TF-IDF Vectorizer
        vectorizer = TfidfVectorizer(stop_words='english')
        
        # Create TF-IDF matrix
        tfidf_matrix = vectorizer.fit_transform(documents)
        
        # Calculate cosine similarity between the resume and job description
        similarity_matrix = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
        
        # Convert to percentage and round to 2 decimal places
        similarity_score = round(float(similarity_matrix[0][0]) * 100, 2)
        
        # Ensure the score is within 0-100 range
        return max(0.0, min(100.0, similarity_score))
        
    except Exception as e:
        print(f"Error calculating similarity: {e}")
        return 0.0