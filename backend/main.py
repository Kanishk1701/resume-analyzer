import uvicorn
import os
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional
from utils import extract_text_from_pdf

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

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
