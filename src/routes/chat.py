import os
from flask import Blueprint, request, jsonify, Response, stream_with_context
from openai import OpenAI
import json

chat_bp = Blueprint('chat', __name__)

# Initialize OpenAI client with modern v1+ SDK
client = OpenAI(
    api_key=os.environ.get('OPENAI_API_KEY')
)

# Legal mode prompts
LEGAL_PROMPTS = {
    'plain-english': """You are a legal assistant specializing in translating complex legal documents into plain English. 
    Your role is to help users understand legal jargon, contracts, and documents by explaining them in simple, clear language. 
    Always maintain accuracy while making legal concepts accessible to non-lawyers.""",
    
    'document-generator': """You are a legal document generator assistant. You help users create professional legal documents 
    such as contracts, agreements, letters, and forms. Provide templates and guidance while ensuring users understand 
    the importance of legal review for their specific situations.""",
    
    'dispute-resolution': """You are a dispute resolution specialist. You help users understand their rights, 
    analyze disputes, and provide guidance on recovery options. Focus on practical steps and legal remedies 
    while emphasizing the importance of proper legal counsel for complex matters.""",
    
    'deal-advisor': """You are a deal advisor specializing in business negotiations and transactions. 
    You provide strategic advice on deals, contracts, and negotiations to help users achieve favorable outcomes. 
    Focus on practical negotiation tactics and legal considerations."""
}

@chat_bp.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({'error': 'Message is required'}), 400
        
        user_message = data['message']
        mode = data.get('mode', 'general')
        
        # Get the appropriate system prompt based on mode
        system_prompt = LEGAL_PROMPTS.get(mode, 
            "You are EezLegal, a helpful AI legal assistant. Provide accurate legal information while emphasizing that users should consult with qualified attorneys for specific legal advice.")
        
        # Create messages array for the chat
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]
        
        # Add conversation history if provided
        if 'history' in data and data['history']:
            # Insert history before the current message
            messages = [{"role": "system", "content": system_prompt}] + data['history'] + [{"role": "user", "content": user_message}]
        
        # Use the modern OpenAI v1+ SDK with supported model
        response = client.chat.completions.create(
            model="gpt-4.1-mini",  # Using supported model
            messages=messages,
            max_tokens=1000,
            temperature=0.7,
            stream=False
        )
        
        # Extract the response content
        ai_response = response.choices[0].message.content
        
        return jsonify({
            'response': ai_response,
            'mode': mode
        })
        
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        return jsonify({'error': 'An error occurred while processing your request'}), 500

@chat_bp.route('/chat/stream', methods=['POST'])
def chat_stream():
    """Streaming chat endpoint for real-time responses"""
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({'error': 'Message is required'}), 400
        
        user_message = data['message']
        mode = data.get('mode', 'general')
        
        # Get the appropriate system prompt based on mode
        system_prompt = LEGAL_PROMPTS.get(mode, 
            "You are EezLegal, a helpful AI legal assistant. Provide accurate legal information while emphasizing that users should consult with qualified attorneys for specific legal advice.")
        
        # Create messages array for the chat
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]
        
        # Add conversation history if provided
        if 'history' in data and data['history']:
            messages = [{"role": "system", "content": system_prompt}] + data['history'] + [{"role": "user", "content": user_message}]
        
        def generate():
            try:
                # Use streaming with the modern OpenAI v1+ SDK with supported model
                stream = client.chat.completions.create(
                    model="gpt-4.1-mini",  # Using supported model
                    messages=messages,
                    max_tokens=1000,
                    temperature=0.7,
                    stream=True
                )
                
                for chunk in stream:
                    if chunk.choices[0].delta.content is not None:
                        content = chunk.choices[0].delta.content
                        yield f"data: {json.dumps({'content': content})}\n\n"
                
                yield f"data: {json.dumps({'done': True})}\n\n"
                
            except Exception as e:
                yield f"data: {json.dumps({'error': str(e)})}\n\n"
        
        return Response(
            stream_with_context(generate()),
            mimetype='text/event-stream',
            headers={
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*'
            }
        )
        
    except Exception as e:
        print(f"Error in streaming chat endpoint: {str(e)}")
        return jsonify({'error': 'An error occurred while processing your request'}), 500

