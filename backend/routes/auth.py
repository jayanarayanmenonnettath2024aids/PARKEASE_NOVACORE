from flask import Blueprint, request, jsonify
from models import db, User
from passlib.hash import bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    if not data or 'name' not in data or 'phone' not in data or 'password' not in data:
        return jsonify({"msg": "Missing required fields"}), 400
        
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
