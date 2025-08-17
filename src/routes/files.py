import os
import tempfile
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import PyPDF2
from docx import Document
import io

files_bp = Blueprint('files', __name__)

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'doc', 'docx'}
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_pdf(file_content):
    """Extract text from PDF file"""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        raise Exception(f"Error reading PDF: {str(e)}")

def extract_text_from_docx(file_content):
    """Extract text from DOCX file"""
    try:
        doc = Document(io.BytesIO(file_content))
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text
    except Exception as e:
        raise Exception(f"Error reading DOCX: {str(e)}")

def extract_text_from_txt(file_content):
    """Extract text from TXT file"""
    try:
        return file_content.decode('utf-8')
    except UnicodeDecodeError:
        try:
            return file_content.decode('latin-1')
        except Exception as e:
            raise Exception(f"Error reading text file: {str(e)}")

@files_bp.route('/upload', methods=['POST'])
def upload_file():
    try:
        # Check if file is present in request
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Check file size
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        
        if file_size > MAX_FILE_SIZE:
            return jsonify({'error': 'File too large. Maximum size is 16MB'}), 400
        
        # Check if file type is allowed
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not supported. Allowed types: PDF, DOC, DOCX, TXT'}), 400
        
        # Read file content
        file_content = file.read()
        filename = secure_filename(file.filename)
        file_extension = filename.rsplit('.', 1)[1].lower()
        
        # Extract text based on file type
        extracted_text = ""
        
        if file_extension == 'pdf':
            extracted_text = extract_text_from_pdf(file_content)
        elif file_extension == 'docx':
            extracted_text = extract_text_from_docx(file_content)
        elif file_extension in ['doc']:
            return jsonify({'error': 'DOC files are not supported. Please convert to DOCX format.'}), 400
        elif file_extension == 'txt':
            extracted_text = extract_text_from_txt(file_content)
        
        # Check if text was extracted
        if not extracted_text.strip():
            return jsonify({'error': 'No text could be extracted from the file'}), 400
        
        return jsonify({
            'success': True,
            'filename': filename,
            'text': extracted_text,
            'file_size': file_size,
            'file_type': file_extension
        })
        
    except Exception as e:
        print(f"Error in file upload: {str(e)}")
        return jsonify({'error': f'Error processing file: {str(e)}'}), 500

@files_bp.route('/analyze', methods=['POST'])
def analyze_document():
    """Analyze uploaded document with AI"""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Document text is required'}), 400
        
        document_text = data['text']
        analysis_type = data.get('type', 'general')
        
        # This would integrate with the chat endpoint for document analysis
        # For now, return a simple response
        return jsonify({
            'success': True,
            'analysis_type': analysis_type,
            'message': 'Document uploaded successfully. You can now ask questions about this document in the chat.'
        })
        
    except Exception as e:
        print(f"Error in document analysis: {str(e)}")
        return jsonify({'error': 'Error analyzing document'}), 500

