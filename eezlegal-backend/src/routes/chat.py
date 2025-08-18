import os, json, traceback
from flask import Blueprint, request, jsonify, Response, stream_with_context
from openai import OpenAI

chat_bp = Blueprint('chat', __name__)

_OPENAI_KEY = os.environ.get('OPENAI_API_KEY')
MODEL = os.environ.get('OPENAI_MODEL', 'gpt-4o-mini')
_client = OpenAI(api_key=_OPENAI_KEY) if _OPENAI_KEY else None

SYSTEM_DEFAULT = "You are a concise legal assistant. Explain things plainly and avoid legalese."

@chat_bp.route('/status', methods=['GET'])
def status():
    return jsonify({
        'has_openai_key': bool(_OPENAI_KEY and _OPENAI_KEY.strip()),
        'model': MODEL,
        'env_port': os.environ.get('PORT'),
    })

def _chat(messages, stream: bool = False):
    if not _client:
        content = "OpenAI API key not configured. Echo: " + (messages[-1].get('content') or '')
        return {'role': 'assistant', 'content': content}
    kwargs = {'model': MODEL, 'messages': messages}
    if stream:
        return _client.chat.completions.create(stream=True, **kwargs)
    return _client.chat.completions.create(**kwargs)

@chat_bp.route('/chat', methods=['POST'])
def chat():
    payload = request.get_json(silent=True) or {}
    user_msg = (payload.get('message') or '').strip()
    if not user_msg:
        return jsonify({'error': 'message is required'}), 400
    messages = [{'role': 'system', 'content': SYSTEM_DEFAULT},
                {'role': 'user', 'content': user_msg}]
    if not _client:
        resp = _chat(messages)
        return jsonify({'message': resp['content']})
    try:
        resp = _chat(messages, stream=False)
        return jsonify({'message': resp.choices[0].message.content})
    except Exception as e:
        trace = ''.join(traceback.format_exc()[-500:])
        print(f'[chat] error: {e}\n{trace}')
        return jsonify({'error': 'chat failed', 'detail': str(e)}), 502

@chat_bp.route('/chat/stream', methods=['POST'])
def chat_stream():
    payload = request.get_json(silent=True) or {}
    user_msg = (payload.get('message') or '').strip()
    if not user_msg:
        return jsonify({'error': 'message is required'}), 400
    messages = [{'role': 'system', 'content': SYSTEM_DEFAULT},
                {'role': 'user', 'content': user_msg}]
    if not _client:
        resp = _chat(messages)
        def gen():
            yield f"data: {json.dumps({'delta': resp['content']})}\n\n"
            yield "data: [DONE]\n\n"
        return Response(stream_with_context(gen()), mimetype='text/event-stream')
    def generate():
        try:
            stream = _chat(messages, stream=True)
            for chunk in stream:
                delta = chunk.choices[0].delta.content or ""
                if delta:
                    yield f"data: {json.dumps({'delta': delta})}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as e:
            print(f"[chat/stream] error: {e}")
            yield f"data: {json.dumps({'error': 'stream failed', 'detail': str(e)})}\n\n"
    return Response(stream_with_context(generate()), mimetype='text/event-stream')
