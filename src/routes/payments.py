from flask import Blueprint, jsonify, request
import stripe
import os
from datetime import datetime, timedelta
from src.models.user import User, Payment, db
from src.routes.user import token_required

payments_bp = Blueprint('payments', __name__)

# Stripe Configuration
stripe.api_key = os.getenv('STRIPE_SECRET_KEY', 'sk_test_dummy_key')

# Pricing configuration
PRICING_PLANS = {
    'monthly': {
        'price': 2999,  # $29.99 in cents
        'currency': 'usd',
        'duration_days': 30,
        'name': 'Monthly Premium'
    },
    'yearly': {
        'price': 29999,  # $299.99 in cents (save $60)
        'currency': 'usd',
        'duration_days': 365,
        'name': 'Yearly Premium'
    }
}

@payments_bp.route('/pricing', methods=['GET'])
def get_pricing():
    """Get pricing plans"""
    return jsonify({
        'plans': {
            'monthly': {
                'price': PRICING_PLANS['monthly']['price'],
                'price_display': '$29.99',
                'currency': PRICING_PLANS['monthly']['currency'],
                'name': PRICING_PLANS['monthly']['name'],
                'features': [
                    'Unlimited AI conversations',
                    'Advanced GPT-4 model access',
                    'Document analysis & drafting',
                    'Priority support',
                    'Export conversation history'
                ]
            },
            'yearly': {
                'price': PRICING_PLANS['yearly']['price'],
                'price_display': '$299.99',
                'currency': PRICING_PLANS['yearly']['currency'],
                'name': PRICING_PLANS['yearly']['name'],
                'savings': '$60 saved vs monthly',
                'features': [
                    'Unlimited AI conversations',
                    'Advanced GPT-4 model access',
                    'Document analysis & drafting',
                    'Priority support',
                    'Export conversation history',
                    'Early access to new features'
                ]
            }
        },
        'free_plan': {
            'name': 'Free',
            'price_display': '$0',
            'features': [
                '10 AI conversations per month',
                'Basic GPT-3.5 model',
                'Community support'
            ]
        }
    }), 200

@payments_bp.route('/create-payment-intent', methods=['POST'])
@token_required
def create_payment_intent(current_user):
    """Create Stripe payment intent"""
    try:
        data = request.json
        plan_type = data.get('plan_type')  # 'monthly' or 'yearly'
        
        if plan_type not in PRICING_PLANS:
            return jsonify({'error': 'Invalid plan type'}), 400
        
        plan = PRICING_PLANS[plan_type]
        
        # Create payment intent
        intent = stripe.PaymentIntent.create(
            amount=plan['price'],
            currency=plan['currency'],
            metadata={
                'user_id': current_user.id,
                'plan_type': plan_type,
                'user_email': current_user.email
            }
        )
        
        # Save payment record
        payment = Payment(
            user_id=current_user.id,
            stripe_payment_intent_id=intent.id,
            amount=plan['price'],
            currency=plan['currency'],
            status='pending',
            subscription_type=plan_type
        )
        
        db.session.add(payment)
        db.session.commit()
        
        return jsonify({
            'client_secret': intent.client_secret,
            'payment_id': payment.id
        }), 200
        
    except stripe.error.StripeError as e:
        return jsonify({'error': f'Stripe error: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create payment intent'}), 500

@payments_bp.route('/confirm-payment', methods=['POST'])
@token_required
def confirm_payment(current_user):
    """Confirm payment and activate subscription"""
    try:
        data = request.json
        payment_intent_id = data.get('payment_intent_id')
        
        if not payment_intent_id:
            return jsonify({'error': 'Payment intent ID required'}), 400
        
        # Retrieve payment intent from Stripe
        intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        
        # Find payment record
        payment = Payment.query.filter_by(
            stripe_payment_intent_id=payment_intent_id,
            user_id=current_user.id
        ).first()
        
        if not payment:
            return jsonify({'error': 'Payment record not found'}), 404
        
        if intent.status == 'succeeded':
            # Update payment status
            payment.status = 'succeeded'
            payment.completed_at = datetime.utcnow()
            
            # Activate user's premium subscription
            current_user.is_premium = True
            plan = PRICING_PLANS[payment.subscription_type]
            current_user.subscription_expires = datetime.utcnow() + timedelta(days=plan['duration_days'])
            
            # Reset message count for new premium user
            current_user.free_messages_used = 0
            
            db.session.commit()
            
            return jsonify({
                'message': 'Payment successful! Premium features activated.',
                'user': current_user.to_dict(),
                'subscription_expires': current_user.subscription_expires.isoformat()
            }), 200
            
        else:
            payment.status = intent.status
            db.session.commit()
            return jsonify({'error': f'Payment {intent.status}'}), 400
            
    except stripe.error.StripeError as e:
        return jsonify({'error': f'Stripe error: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to confirm payment'}), 500

@payments_bp.route('/subscription/status', methods=['GET'])
@token_required
def get_subscription_status(current_user):
    """Get user's subscription status"""
    return jsonify({
        'is_premium': current_user.is_premium,
        'subscription_expires': current_user.subscription_expires.isoformat() if current_user.subscription_expires else None,
        'free_messages_used': current_user.free_messages_used,
        'free_message_limit': current_user.free_message_limit,
        'can_send_message': current_user.can_send_message()
    }), 200

@payments_bp.route('/subscription/cancel', methods=['POST'])
@token_required
def cancel_subscription(current_user):
    """Cancel user's subscription (mark for non-renewal)"""
    try:
        # For this implementation, we'll just mark the subscription as ending
        # In a real app, you'd integrate with Stripe's subscription management
        
        if not current_user.is_premium:
            return jsonify({'error': 'No active subscription to cancel'}), 400
        
        # In a real implementation, you would:
        # 1. Cancel the Stripe subscription
        # 2. Set a flag to not auto-renew
        # 3. Let the subscription expire naturally
        
        # For now, we'll just provide a response
        return jsonify({
            'message': 'Subscription cancellation requested. Your premium features will remain active until the end of your billing period.',
            'subscription_expires': current_user.subscription_expires.isoformat() if current_user.subscription_expires else None
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to cancel subscription'}), 500

@payments_bp.route('/payments/history', methods=['GET'])
@token_required
def get_payment_history(current_user):
    """Get user's payment history"""
    payments = Payment.query.filter_by(user_id=current_user.id)\
                           .order_by(Payment.created_at.desc())\
                           .limit(20).all()
    
    return jsonify([payment.to_dict() for payment in payments]), 200

@payments_bp.route('/webhook', methods=['POST'])
def stripe_webhook():
    """Handle Stripe webhooks"""
    payload = request.get_data()
    sig_header = request.headers.get('Stripe-Signature')
    endpoint_secret = os.getenv('STRIPE_WEBHOOK_SECRET')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError:
        return jsonify({'error': 'Invalid payload'}), 400
    except stripe.error.SignatureVerificationError:
        return jsonify({'error': 'Invalid signature'}), 400
    
    # Handle the event
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        
        # Find and update payment record
        payment = Payment.query.filter_by(
            stripe_payment_intent_id=payment_intent['id']
        ).first()
        
        if payment:
            payment.status = 'succeeded'
            payment.completed_at = datetime.utcnow()
            
            # Activate user's premium subscription
            user = User.query.get(payment.user_id)
            if user:
                user.is_premium = True
                plan = PRICING_PLANS[payment.subscription_type]
                user.subscription_expires = datetime.utcnow() + timedelta(days=plan['duration_days'])
                user.free_messages_used = 0
            
            db.session.commit()
    
    elif event['type'] == 'payment_intent.payment_failed':
        payment_intent = event['data']['object']
        
        # Update payment record
        payment = Payment.query.filter_by(
            stripe_payment_intent_id=payment_intent['id']
        ).first()
        
        if payment:
            payment.status = 'failed'
            db.session.commit()
    
    return jsonify({'status': 'success'}), 200

