import os
from flask import Blueprint, request, jsonify
from openai import OpenAI

chat_bp = Blueprint('chat', __name__)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

@chat_bp.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Get chat history from request (optional)
        chat_history = data.get('history', [])
        
        # Build messages for OpenAI API
        messages = [
            {
                "role": "system", 
                "content": "You are EezLegal, a helpful AI legal assistant. Provide clear, accurate legal information and guidance. Always remind users that this is general information and they should consult with a qualified attorney for specific legal advice. Be professional, empathetic, and helpful."
            }
        ]
        
        # Add chat history
        for msg in chat_history:
            messages.append({
                "role": msg.get('role', 'user'),
                "content": msg.get('content', '')
            })
        
        # Add current user message
        messages.append({
            "role": "user",
            "content": user_message
        })
        
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            max_tokens=1000,
            temperature=0.7
        )
        
        assistant_message = response.choices[0].message.content
        
        return jsonify({
            'message': assistant_message,
            'success': True
        })
        
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        return jsonify({
            'error': 'An error occurred while processing your request',
            'success': False
        }), 500

@chat_bp.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'service': 'eezlegal-chat'})

