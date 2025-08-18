import os
import io
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import PyPDF2
from docx import Document

files_bp = Blueprint('files', __name__)

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'doc', 'docx'}
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@files_bp.route('/files/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'Unsupported file type'}), 400

    # Simple size check if available
    try:
        file.stream.seek(0, os.SEEK_END)
        size = file.stream.tell()
        file.stream.seek(0)
        if size > MAX_FILE_SIZE:
            return jsonify({'error': 'File too large'}), 400
    except Exception:
        pass

    filename = secure_filename(file.filename)

    # Extract text (basic)
    try:
        ext = filename.rsplit('.', 1)[1].lower()
        if ext == 'txt':
            content = file.read().decode('utf-8', errors='replace')
        elif ext == 'pdf':
            reader = PyPDF2.PdfReader(file)
            content = '\\n'.join(page.extract_text() or '' for page in reader.pages)
        elif ext in ('doc', 'docx'):
            data = file.read()
            doc = Document(io.BytesIO(data))
            content = '\\n'.join(p.text for p in doc.paragraphs)
        else:
            content = ''

        return jsonify({
            'success': True,
            'filename': filename,
            'preview': content[:1000]
        })
    except Exception as e:
        print(f"[files] parse error: {e}")
        return jsonify({'error': 'Could not read file'}), 500

@files_bp.route('/files/analyze', methods=['POST'])
def analyze_file():
    data = request.get_json(silent=True) or {}
    analysis_type = data.get('type', 'general')
    return jsonify({
        'success': True,
        'analysis_type': analysis_type,
        'message': 'Document uploaded successfully. You can now ask questions about this document in the chat.'
    })
