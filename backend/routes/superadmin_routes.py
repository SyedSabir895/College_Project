from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, db
from flask_bcrypt import Bcrypt
from datetime import datetime
import secrets
import string
from flask_mail import Message
import threading

superadmin_bp = Blueprint('superadmin', __name__)
bcrypt = Bcrypt()

def send_credentials_email(admin_email, admin_name, institution_name, password):
    from app import mail
    app = current_app._get_current_object()
    
    msg = Message(
        subject=f"Institutional Admin Access - {institution_name}",
        recipients=[admin_email],
        body=(
            f"Hi {admin_name},\n\n"
            f"An institutional account has been created for '{institution_name}' on the College Task Manager platform.\n\n"
            f"Your administrative credentials are as follows:\n"
            f"Email: {admin_email}\n"
            f"Password: {password}\n\n"
            "You can now login and start managing your department, adding teachers, and assigning tasks.\n\n"
            "Regards,\nSystem Administrator"
        )
    )

    def _send(msg, app):
        with app.app_context():
            try:
                mail.send(msg)
            except Exception as e:
                print(f"Failed to send email: {e}")

    thread = threading.Thread(target=_send, args=(msg, app))
    thread.start()

@superadmin_bp.route('/institutions', methods=['GET', 'POST'])
@jwt_required()
def manage_institutions():
    requester_id = get_jwt_identity()
    requester = User.find_by_id(requester_id)
    
    if not requester or requester.get('role') != 'SuperAdmin':
        return jsonify({"message": "Access denied: SuperAdmin only"}), 403

    if request.method == 'POST':
        try:
            data = request.get_json()
            name = data.get('name')
            admin_email = data.get('adminEmail')
            admin_name = data.get('adminName')

            if not name or not admin_email or not admin_name:
                return jsonify({"message": "Missing required fields: Name, Admin Email, and Admin Name"}), 400

            # Check if institution exists
            if db.institutions.find_one({"name": name}):
                return jsonify({"message": f"An institution named '{name}' already exists"}), 409
            
            # Check if user exists
            if User.find_by_email(admin_email):
                return jsonify({"message": f"The email '{admin_email}' is already registered to another user"}), 409

            # Generate random password
            password = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(12))
            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

            # Create Institution
            new_institution = {
                "name": name,
                "adminEmail": admin_email,
                "createdAt": datetime.utcnow()
            }
            db.institutions.insert_one(new_institution)

            # Create HOD User
            new_admin = {
                "name": admin_name,
                "email": admin_email,
                "password": hashed_password,
                "role": "HOD",
                "college": name,
                "createdAt": datetime.utcnow()
            }
            db.users.insert_one(new_admin)

            # Send Email (handled in a separate thread to avoid timeout)
            send_credentials_email(admin_email, admin_name, name, password)

            return jsonify({"message": "Institution and Admin account created successfully"}), 201
        except Exception as e:
            print(f"CRITICAL ERROR in manage_institutions: {str(e)}")
            return jsonify({"message": "Server error while creating institution", "error": str(e)}), 500

    # GET Institutions
    institutions = list(db.institutions.find())
    for inst in institutions:
        inst['_id'] = str(inst['_id'])
        # Count users in this institution
        inst['userCount'] = db.users.count_documents({"college": inst['name']})
        
    return jsonify(institutions), 200

@superadmin_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    requester_id = get_jwt_identity()
    requester = User.find_by_id(requester_id)
    if not requester or requester.get('role') != 'SuperAdmin':
        return jsonify({"message": "Access denied"}), 403

    stats = {
        "totalInstitutions": db.institutions.count_documents({}),
        "totalUsers": db.users.count_documents({}),
        "totalTasks": db.tasks.count_documents({})
    }
    return jsonify(stats), 200
