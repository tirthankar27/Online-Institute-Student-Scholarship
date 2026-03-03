# app/modules/scholarship/routes.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt

from ..services.service import ScholarshipService

scholarship_bp = Blueprint(
    "scholarship",
    __name__
)


# ----------------- Insert Scholarship (Admin Only) -----------------
@scholarship_bp.route("/insertScholarship", methods=["POST"])
@jwt_required()
def insert_scholarship():

    claims = get_jwt()

    if claims.get("designation") != "admin":
        return jsonify({"message": "Access denied: Admins only"}), 403

    try:
        scholarship = ScholarshipService.insert(request.get_json())

        return jsonify({
            "message": "Scholarship inserted successfully",
            "scholarship": {
                "scholarship_id": scholarship.scholarship_id,
                "title": scholarship.title,
                "organization": scholarship.organization,
                "description": scholarship.description,
                "deadline": scholarship.deadline,
                "amount": scholarship.amount
            }
        }), 201

    except ValueError as e:
        return jsonify({"message": str(e)}), 400

    except Exception:
        return jsonify({"message": "Server error"}), 500


# ----------------- Fetch All Scholarships -----------------
@scholarship_bp.route("/schemes", methods=["GET"])
def get_all():

    try:
        scholarships = ScholarshipService.list_all()

        if not scholarships:
            return jsonify({"message": "No scholarships found", "data": []}), 200

        return jsonify({
            "data": [
                {
                    "scholarship_id": s.scholarship_id,
                    "title": s.title,
                    "organization": s.organization,
                    "description": s.description,
                    "deadline": s.deadline,
                    "amount": s.amount
                }
                for s in scholarships
            ]
        }), 200

    except Exception:
        return jsonify({"message": "Server error"}), 500


# ----------------- Fetch One Scholarship -----------------
@scholarship_bp.route("/scheme/<string:scholarship_id>", methods=["GET"])
def get_one(scholarship_id):

    try:
        scholarship = ScholarshipService.get_one(scholarship_id)

        return jsonify({
            "data": {
                "scholarship_id": scholarship.scholarship_id,
                "title": scholarship.title,
                "organization": scholarship.organization,
                "description": scholarship.description,
                "deadline": scholarship.deadline,
                "amount": scholarship.amount
            }
        }), 200

    except ValueError:
        return jsonify({"message": "No scholarships found", "data": []}), 200

    except Exception:
        return jsonify({"message": "Server error"}), 500