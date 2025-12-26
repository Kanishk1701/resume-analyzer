📄 AI-Powered Resume Analyzer

An AI-powered web application that analyzes resumes against job descriptions, evaluates ATS compatibility, identifies skill gaps, and provides actionable improvement suggestions using NLP and ML techniques.

🚀 Features

📊 Resume–Job Description matching using text similarity

🤖 ATS compatibility scoring

🧠 Skill gap identification

✍️ Resume improvement suggestions

🌐 Web-based interface for real-time analysis

🛠️ Tech Stack
Backend

Python

NLP & ML (TF-IDF / Cosine Similarity / spaCy or equivalent)

FastAPI / Flask

Frontend

React / Next.js

HTML, CSS, JavaScript

Other

REST APIs

Git & GitHub

🧩 Project Structure
resume-analyzer/
├── backend/          # API, ML models, NLP logic
├── frontend/         # Web interface
├── .gitignore
├── README.md

⚙️ How It Works

User uploads a resume and a job description

Text is cleaned and processed using NLP

ML models compute similarity and ATS score

System highlights missing skills and improvements

Results are displayed on the web dashboard

▶️ How to Run Locally
Backend
cd backend
pip install -r requirements.txt
python main.py

Frontend
cd frontend
npm install
npm run dev

📌 Use Cases

Job seekers optimizing resumes

Students preparing for placements

Understanding ATS-based resume screening

📈 Future Enhancements

LLM-based resume feedback

Multi-job comparison

Resume keyword optimization

PDF report generation

👤 Author

Kanishk Pandey
