import os
import requests
from flask import Blueprint, request, jsonify

simple_chat_bp = Blueprint('simple_chat', __name__)

@simple_chat_bp.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Get OpenAI API key from environment
        api_key = os.getenv('OPENAI_API_KEY')
        
        if not api_key:
            return jsonify({
                'message': 'I\'m ready to help with your legal questions! Please note that you\'ll need to set up the OpenAI API key in Railway\'s environment variables for full functionality.',
                'success': True
            })
        
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
        
        # Call OpenAI API using requests
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'model': 'gpt-4o-mini',
            'messages': messages,
            'max_tokens': 1000,
            'temperature': 0.7
        }
        
        response = requests.post(
            'https://api.openai.com/v1/chat/completions',
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            assistant_message = result['choices'][0]['message']['content']
            
            return jsonify({
                'message': assistant_message,
                'success': True
            })
        else:
            return jsonify({
                'message': 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.',
                'success': True
            })
        
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        return jsonify({
            'message': 'I\'m here to help with your legal questions. This is a demonstration of the EezLegal interface. To enable full AI functionality, please set up your OpenAI API key.',
            'success': True
        })

@simple_chat_bp.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'service': 'eezlegal-chat'})

