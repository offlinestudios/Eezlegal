from flask import Blueprint, jsonify, request
import openai
import os
from src.models.user import User, Conversation, Message, db
from src.routes.user import token_required

chat_bp = Blueprint('chat', __name__)

# OpenAI Configuration
openai.api_key = os.getenv('OPENAI_API_KEY')

# Legal AI System Prompt
LEGAL_SYSTEM_PROMPT = """You are Eezlegal, an AI-powered legal advocate. You help users understand legal documents, contracts, and legal situations in plain English. 

Key guidelines:
- Communicate in plain English, avoiding legalese unless specifically requested
- Use short paragraphs and bullet points for clarity
- Be empowering, calm, and practical in your responses
- After providing initial advice, offer to either "Analyze a document" or "Draft a document" as next steps
- Surface citations or precedents only when they strengthen the user's position or are explicitly requested
- Always include a disclaimer that this is educational help, not legal advice from a law firm
- Keep responses concise (1-2 paragraphs max) unless detailed analysis is requested

Remember: You are providing educational legal information, not practicing law."""

def get_ai_response(messages, user):
    """Get response from OpenAI API"""
    try:
        # Prepare messages for OpenAI
        openai_messages = [{"role": "system", "content": LEGAL_SYSTEM_PROMPT}]
        
        # Add conversation history
        for msg in messages:
            openai_messages.append({
                "role": msg.role,
                "content": msg.content
            })
        
        # Choose model based on user subscription
        model = "gpt-4" if user.is_premium else "gpt-3.5-turbo"
        
        # Make API call
        response = openai.chat.completions.create(
            model=model,
            messages=openai_messages,
            max_tokens=500,
            temperature=0.7
        )
        
        return {
            'content': response.choices[0].message.content,
            'tokens_used': response.usage.total_tokens,
            'model_used': model
        }
        
    except Exception as e:
        print(f"OpenAI API Error: {str(e)}")
        return {
            'content': "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
            'tokens_used': 0,
            'model_used': 'fallback'
        }

@chat_bp.route('/conversations', methods=['GET'])
@token_required
def get_conversations(current_user):
    """Get user's conversations"""
    conversations = Conversation.query.filter_by(user_id=current_user.id)\
                                    .order_by(Conversation.updated_at.desc())\
                                    .limit(20).all()
    
    return jsonify([conv.to_dict() for conv in conversations]), 200

@chat_bp.route('/conversations', methods=['POST'])
@token_required
def create_conversation(current_user):
    """Create a new conversation"""
    try:
        data = request.json
        title = data.get('title', 'New Legal Question')
        
        conversation = Conversation(
            user_id=current_user.id,
            title=title
        )
        
        db.session.add(conversation)
        db.session.commit()
        
        return jsonify(conversation.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create conversation'}), 500

@chat_bp.route('/conversations/<int:conversation_id>', methods=['GET'])
@token_required
def get_conversation(current_user, conversation_id):
    """Get conversation with messages"""
    conversation = Conversation.query.filter_by(
        id=conversation_id, 
        user_id=current_user.id
    ).first_or_404()
    
    messages = Message.query.filter_by(conversation_id=conversation_id)\
                           .order_by(Message.created_at.asc()).all()
    
    return jsonify({
        'conversation': conversation.to_dict(),
        'messages': [msg.to_dict() for msg in messages]
    }), 200

@chat_bp.route('/conversations/<int:conversation_id>/messages', methods=['POST'])
@token_required
def send_message(current_user, conversation_id):
    """Send a message and get AI response"""
    try:
        # Check if user can send messages
        if not current_user.can_send_message():
            return jsonify({
                'error': 'Message limit reached',
                'message': 'You have reached your free message limit. Please upgrade to premium to continue.'
            }), 403
        
        data = request.json
        user_message = data.get('message', '').strip()
        
        if not user_message:
            return jsonify({'error': 'Message cannot be empty'}), 400
        
        # Verify conversation belongs to user
        conversation = Conversation.query.filter_by(
            id=conversation_id,
            user_id=current_user.id
        ).first_or_404()
        
        # Save user message
        user_msg = Message(
            conversation_id=conversation_id,
            content=user_message,
            role='user'
        )
        db.session.add(user_msg)
        
        # Get conversation history for context
        previous_messages = Message.query.filter_by(conversation_id=conversation_id)\
                                       .order_by(Message.created_at.asc()).all()
        
        # Get AI response
        ai_response = get_ai_response(previous_messages + [user_msg], current_user)
        
        # Save AI response
        ai_msg = Message(
            conversation_id=conversation_id,
            content=ai_response['content'],
            role='assistant',
            tokens_used=ai_response['tokens_used'],
            model_used=ai_response['model_used']
        )
        db.session.add(ai_msg)
        
        # Update conversation title if it's the first message
        if len(previous_messages) == 0:
            # Generate title from first message (first 50 chars)
            title = user_message[:50] + "..." if len(user_message) > 50 else user_message
            conversation.title = title
        
        # Increment user message count
        current_user.increment_message_count()
        
        # Update conversation timestamp
        conversation.updated_at = db.func.now()
        
        db.session.commit()
        
        return jsonify({
            'user_message': user_msg.to_dict(),
            'ai_message': ai_msg.to_dict(),
            'conversation': conversation.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error sending message: {str(e)}")
        return jsonify({'error': 'Failed to send message'}), 500

@chat_bp.route('/conversations/<int:conversation_id>', methods=['DELETE'])
@token_required
def delete_conversation(current_user, conversation_id):
    """Delete a conversation"""
    try:
        conversation = Conversation.query.filter_by(
            id=conversation_id,
            user_id=current_user.id
        ).first_or_404()
        
        db.session.delete(conversation)
        db.session.commit()
        
        return jsonify({'message': 'Conversation deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete conversation'}), 500

@chat_bp.route('/conversations/<int:conversation_id>/title', methods=['PUT'])
@token_required
def update_conversation_title(current_user, conversation_id):
    """Update conversation title"""
    try:
        data = request.json
        new_title = data.get('title', '').strip()
        
        if not new_title:
            return jsonify({'error': 'Title cannot be empty'}), 400
        
        conversation = Conversation.query.filter_by(
            id=conversation_id,
            user_id=current_user.id
        ).first_or_404()
        
        conversation.title = new_title
        db.session.commit()
        
        return jsonify(conversation.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update title'}), 500

