from flask import Blueprint, request, jsonify
from models import db, User
from passlib.hash import bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from services.email_service import send_email, generate_temp_password
import threading

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    if not data or 'name' not in data or 'phone' not in data or 'password' not in data or 'email' not in data:
        return jsonify({"msg": "Missing required fields. Email is mandatory."}), 400
        
    if User.query.filter_by(phone=data['phone']).first():
        return jsonify({"msg": "Phone number already registered"}), 400
        
    hashed_pw = bcrypt.hash(data['password'])
    new_user = User(
        name=data['name'],
        phone=data['phone'],
        email=data.get('email'),
        password=hashed_pw,
        role=data.get('role', 'user')
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"msg": "User registered successfully"}), 201

@auth_bp.route('/recover', methods=['POST'])
def recover_password():
    data = request.json
    email = data.get('email')
    if not email:
        return jsonify({"msg": "Email address required"}), 400
        
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"msg": "No account found with this email"}), 404
        
    temp_password = generate_temp_password()
    user.password = bcrypt.hash(temp_password)
    db.session.commit()
    
    subject = "ParkEase - Account Password Recovery"
    body = f"""
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #0ea5e9;">ParkEase Identity Recovery</h2>
        <p>Hello <strong>{user.name}</strong>,</p>
        <p>A password reset was requested for your ParkEase account. Your new temporary access key is:</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #0f172a;">{temp_password}</span>
        </div>
        <p>Please log in using this key and navigate to your profile to secure your account with a newly chosen password.</p>
        <p>- The ParkEase Security Team</p>
    </div>
    """
    
    success = send_email(user.email, subject, body)
    if success:
        return jsonify({"msg": f"Recovery access key sent to {user.email}"}), 200
    else:
        return jsonify({"msg": "Failed to dispatch recovery email due to server error"}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data or 'phone' not in data or 'password' not in data:
        return jsonify({"msg": "Missing required fields"}), 400
        
    user = User.query.filter_by(phone=data['phone']).first()
    if not user or not bcrypt.verify(data['password'], user.password):
        return jsonify({"msg": "Invalid phone or password"}), 401
        
    # Create the access token using the user's ID
    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        "access_token": access_token,
        "user": {
            "id": user.id,
            "name": user.name,
            "role": user.role
        }
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify({
        "id": user.id,
        "name": user.name,
        "phone": user.phone,
        "email": user.email,
        "role": user.role
    }), 200
