# app/modules/application/routes.py

from flask import Blueprint, request, jsonify
from flask import send_from_directory, current_app
from flask_jwt_extended import jwt_required, get_jwt
from ..services.service import ApplicationService
from ..repositories.repository import ApplicationRepository

application_bp = Blueprint("application", __name__)


# ----------------- Apply -----------------
@application_bp.route("/apply", methods=["POST"])
@jwt_required()
def apply():

    try:
        claims = get_jwt()

        data = request.form.to_dict()
        files = request.files

        application = ApplicationService.apply(
            data, files, claims
        )

        return jsonify({
            "message": "Application submitted successfully",
            "application_id": application.application_id
        }), 201

    except PermissionError as e:
        return jsonify({"message": str(e)}), 403

    except ValueError as e:
        return jsonify({"message": str(e)}), 400

    except Exception as e:
        print(f"Server error: {str(e)}")  # Add this for debugging
        print(f"Data received: {data}")     # See what data is coming in
        return jsonify({"message": f"Server error: {str(e)}"}), 500


# ----------------- Get All Applications -----------------
@application_bp.route("/applications", methods=["GET"])
@jwt_required()
def get_all():

    claims = get_jwt()
    if claims["designation"] not in ["admin", "authority"]:
        return jsonify({"message": "Access denied"}), 403

    apps = ApplicationRepository.get_all()

    return jsonify({
        "data": [
            {
                "application_id": a.application_id,
                "student_name": a.student_name,
                "father_name": a.father_name,
                "mother_name": a.mother_name,
                "institute_name": a.institute_name,
                "course": a.course,
                "email": a.email,
                "roll": a.roll,
                "cgpa": a.cgpa,
                "percent_12th": a.percent_12th,
                "status": a.status,
                "verified_by_authority": a.verified_by_authority,
                "verified_by_admin": a.verified_by_admin
            }
            for a in apps
        ]
    }), 200


# ----------------- My Applications -----------------
@application_bp.route("/my-applications", methods=["GET"])
@jwt_required()
def my_apps():

    try:
        claims = get_jwt()
        # Use service layer to get user's applications
        apps = ApplicationService.get_my_applications(claims)

        # Return full application details instead of just IDs
        return jsonify({
            "data": [
                {
                    "application_id": a.application_id,
                    "student_name": a.student_name,
                    "father_name": a.father_name,
                    "mother_name": a.mother_name,
                    "email": a.email,
                    "roll": a.roll,
                    "institute_name": a.institute_name,
                    "course": a.course,
                    "cgpa": a.cgpa,
                    "percent_12th": a.percent_12th,
                    "dob": a.dob.isoformat() if a.dob else None,
                    "status": a.status,
                    "verified_by_authority": a.verified_by_authority,
                    "verified_by_admin": a.verified_by_admin,
                    "scholarship_id": a.scholarship_id,
                    "id_card": a.id_card,
                    "category_certificate": a.category_certificate,
                    "recent_sem_marksheet": a.recent_sem_marksheet,
                    "marksheet_12th": a.marksheet_12th
                }
                for a in apps
            ]
        }), 200

    except PermissionError as e:
        return jsonify({"message": str(e)}), 403

    except Exception as e:
        return jsonify({"message": "Server error"}), 500

# --------------------- Verify ---------------------
@application_bp.route("/verify/<string:application_id>", methods=["PATCH"])
@jwt_required()
def verify(application_id):

    from flask_jwt_extended import get_jwt
    claims = get_jwt()

    data = request.get_json()
    status = data.get("status")

    if not status:
        return jsonify({"message": "Status is required"}), 400

    try:
        application = ApplicationService.verify(
            application_id,
            status,
            claims
        )

        return jsonify({
            "message": "Application updated successfully",
            "status": application.status
        }), 200

    except PermissionError as e:
        return jsonify({"message": str(e)}), 403

    except ValueError as e:
        return jsonify({"message": str(e)}), 400

    except Exception:
        return jsonify({"message": "Server error"}), 500
    
@application_bp.route("/files/<path:filename>", methods=["GET"])
@jwt_required()
def serve_file(filename):
    upload_folder = current_app.config["UPLOAD_FOLDER"]
    return send_from_directory(upload_folder, filename)