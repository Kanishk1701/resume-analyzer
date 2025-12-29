'use client';

import { useState, useRef, ChangeEvent } from 'react';
import axios from 'axios';
import { UploadCloud, CheckCircle, AlertCircle, X, Sparkles } from 'lucide-react';

interface AnalysisResult {
  score: number;
  resume_skills: string[];
  missing_skills: string[];
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleAnalyze = async () => {
    if (!file || !jobDesc.trim()) {
      alert('Please upload a resume and enter a job description');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_description', jobDesc);

    try {
      setLoading(true);
      // Ensure this URL matches your backend URL correctly
      const response = await axios.post('http://localhost:8000/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
      // Scroll to results
      setTimeout(() => {
          document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (error) {
      console.error('Error analyzing resume:', error);
      alert('Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Updated for brighter neon colors on dark backgrounds
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-rose-400';
  };

  // Reusable Glass Card classes
  const glassCardClasses = "bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8";
  const inputGlassClasses = "bg-white/5 border border-white/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl text-white placeholder-gray-400 transition-all";

  return (
    // 1. REMOVED 'overflow-x-hidden' from here to stop the double scrollbar
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative">
      
      {/* 2. NEW CONTAINER: This handles the blobs and clips them (overflow-hidden) 
             so they don't cause horizontal scrolling, but it's separate from the content */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-cyan-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          {/* ... Rest of your component remains exactly the same ... */}
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-cyan-300 to-purple-300 mb-3 flex items-center justify-center gap-3">
            <Sparkles className="text-cyan-300" /> AI Resume Matcher
          </h1>
          <p className="text-gray-300 text-lg">Discover how well your resume matches the job description with AI precision.</p>
        </div>
        
        {/* ... Keep all the other JSX (Inputs, Buttons, Results) exactly as they were ... */}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* File Upload Glass Card */}
          <div className={glassCardClasses}>
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                1. Upload Resume <span className="text-sm font-normal text-gray-400">(PDF only)</span>
            </h2>
            <div
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all group ${
                file 
                  ? 'border-cyan-500/50 bg-cyan-500/10' 
                  : 'border-white/30 hover:border-cyan-400/70 hover:bg-white/5'
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center space-y-4">
                {file ? (
                  <>
                    <div className="w-16 h-16 bg-linear-to-br from-cyan-500/20 to-teal-500/20 rounded-full flex items-center justify-center shadow-inner border border-cyan-500/30">
                      <CheckCircle className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div className="flex items-center space-x-3 bg-white/10 px-4 py-3 rounded-lg backdrop-blur-md border border-white/10">
                      <span className="text-white font-medium truncate max-w-[200px]">{file.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="text-gray-400 hover:text-rose-400 transition-colors p-1 hover:bg-white/10 rounded-full"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform border border-white/10">
                      <UploadCloud className="w-10 h-10 text-gray-300 group-hover:text-cyan-300 transition-colors" />
                    </div>
                    <div>
                      <p className="text-lg text-gray-200 mb-1">
                        <span className="font-semibold text-cyan-300 underline-offset-4 hover:underline">Click to upload</span> or drag and drop
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Job Description Glass Card */}
          <div className={glassCardClasses}>
            <h2 className="text-xl font-semibold text-white mb-6">2. Paste Job Description</h2>
            <textarea
              id="job-desc"
              rows={11}
              className={`w-full px-4 py-3 shadow-inner resize-none ${inputGlassClasses}`}
              placeholder="Paste the text from the job posting here..."
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-center mb-16">
          <button
            onClick={handleAnalyze}
            disabled={!file || !jobDesc.trim() || loading}
            className={`px-14 py-4 rounded-full text-white font-bold text-lg shadow-lg transition-all transform ${
              (!file || !jobDesc.trim() || loading)
                ? 'bg-gray-600/50 cursor-not-allowed text-gray-400 border border-gray-600'
                : 'bg-linear-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-500 hover:shadow-cyan-500/50 hover:scale-105 border border-cyan-400/50'
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Analyze Match'}
          </button>
        </div>

        {result && (
          <div id="results-section" className={`${glassCardClasses} animate-in fade-in slide-in-from-bottom-10 duration-700`}>
            
            <div className="text-center mb-12 pt-4">
              <h2 className="text-3xl font-bold text-white mb-8">Analysis Results</h2>
              {/* Score Circle */}
              <div className="relative inline-block p-4 rounded-full bg-white/5 border border-white/10 shadow-[0_0_40px_rgba(0,255,255,0.1)]">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle
                    className="text-gray-700/30"
                    strokeWidth="16"
                    stroke="currentColor"
                    fill="transparent"
                    r="70"
                    cx="96"
                    cy="96"
                  />
                  <circle
                    className={`${getScoreColor(result.score)} transition-all duration-1000 ease-out`}
                    strokeWidth="16"
                    strokeDasharray={440}
                    strokeDashoffset={440 - (440 * result.score) / 100}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="70"
                    cx="96"
                    cy="96"
                    style={{ filter: `drop-shadow(0 0 8px currentColor)` }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-5xl font-extrabold ${getScoreColor(result.score)} drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]`}>
                    {result.score}%
                  </span>
                  <span className="text-gray-400 text-sm mt-1 font-medium uppercase tracking-wider">Match Score</span>
                </div>
              </div>
               <p className="text-xl text-gray-200 mt-6 font-medium">
                {result.score >= 70 ? '🎉 Excellent match!' : result.score >= 50 ? '👍 Good match with room for improvement.' : '🤔 Consider customizing your resume further.'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Matched Skills - Green Glass */}
              <div className="bg-linear-to-br from-emerald-900/40 to-teal-900/40 backdrop-blur-md rounded-2xl p-8 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)] relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl"></div>
                <h3 className="text-2xl font-semibold text-emerald-300 mb-6 flex items-center">
                  <CheckCircle className="mr-3 text-emerald-400" size={28} />
                  Matched Skills
                  <span className="ml-auto text-sm bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-4 py-1 rounded-full font-bold">
                    {result.resume_skills.length}
                  </span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {result.resume_skills.length > 0 ? (
                    result.resume_skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-emerald-500/10 text-emerald-200 border border-emerald-500/30 shadow-sm"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-emerald-200/70 italic">No exact skill matches found yet.</p>
                  )}
                </div>
              </div>

              {/* Missing Skills - Red/Rose Glass */}
              <div className="bg-linear-to-br from-rose-900/40 to-pink-900/40 backdrop-blur-md rounded-2xl p-8 border border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.15)] relative overflow-hidden">
                 <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-rose-500/20 rounded-full blur-2xl"></div>
                <h3 className="text-2xl font-semibold text-rose-300 mb-6 flex items-center">
                  <AlertCircle className="mr-3 text-rose-400" size={28} />
                  Missing Skills
                  <span className="ml-auto text-sm bg-rose-500/20 text-rose-300 border border-rose-500/30 px-4 py-1 rounded-full font-bold">
                    {result.missing_skills.length}
                  </span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {result.missing_skills.length > 0 ? (
                    result.missing_skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-rose-500/10 text-rose-200 border border-rose-500/30 shadow-sm"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-rose-200 font-semibold flex items-center">
                        <Sparkles className="mr-2 h-5 w-5" />
                        Perfect match! No missing keywords.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}