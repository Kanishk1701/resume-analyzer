import uvicorn
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse
import os
import shutil
from utils import extract_text_from_pdf, extract_skills, calculate_similarity

app = FastAPI()

# Ensure upload directory exists
UPLOAD_DIR = 'uploads'
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def read_root():
    return {"message": "Backend is running"}

@app.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    try:
        # Create a file path within the upload directory
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        
        # Save the uploaded file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Extract text from the PDF
        extracted_text = extract_text_from_pdf(file_path)
        
        # Clean up the uploaded file
        os.remove(file_path)
        
        if not extracted_text:
            raise HTTPException(status_code=400, detail="Failed to extract text from PDF")
            
        return {
            "filename": file.filename,
            "text": extracted_text
        }
        
    except Exception as e:
        # Clean up in case of error
        if 'file_path' in locals() and os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    try:
        # Create a file path within the upload directory
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        
        # Save the uploaded file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Extract text from the PDF
        resume_text = extract_text_from_pdf(file_path)
        
        # Clean up the uploaded file
        os.remove(file_path)
        
        if not resume_text:
            raise HTTPException(status_code=400, detail="Failed to extract text from PDF")
        
        # Calculate similarity score
        score = calculate_similarity(resume_text, job_description)
        
        # Extract skills from resume and job description
        resume_skills = extract_skills(resume_text)
        jd_skills = extract_skills(job_description)
        
        # Find missing skills
        missing_skills = list(set(jd_skills) - set(resume_skills))
        
        return {
            "score": score,
            "resume_skills": resume_skills,
            "missing_skills": missing_skills
        }
        
    except Exception as e:
        # Clean up in case of error
        if 'file_path' in locals() and os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)