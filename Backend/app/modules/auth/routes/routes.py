from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from ..services.service import AuthService

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


# ----------------- Signup -----------------
@auth_bp.route("/signup", methods=["POST"])
def signup():

    data = request.get_json()

    required_fields = ["user_id", "name", "email", "password", "designation"]

    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    if len(data["password"]) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400

    try:
        user = AuthService.signup(data)

        return jsonify({
            "user_id": user.user_id,
            "name": user.name,
            "email": user.email,
            "designation": user.designation,
            "message": "User registered successfully"
        }), 201

    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    except Exception as e:
        print("SIGNUP ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


# ----------------- Login -----------------
@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    if not data.get("user_id") or not data.get("password"):
        return jsonify({"error": "User ID and password are required"}), 400

    try:
        result = AuthService.login(data)

        return jsonify({
            "success": True,
            "access_token": result["token"],
            "user": {
                "user_id": result["user"].user_id,
                "name": result["user"].name,
                "email": result["user"].email,
                "designation": result["user"].designation
            }
        }), 200

    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    except Exception as e:
        print("LOGIN ERROR:", str(e))
        return jsonify({"error": str(e)}), 500