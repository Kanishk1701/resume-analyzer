from pdfminer.high_level import extract_text

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