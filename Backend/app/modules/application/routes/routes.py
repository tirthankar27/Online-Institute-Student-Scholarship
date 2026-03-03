# app/modules/application/routes.py

from flask import Blueprint, request, jsonify
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
        return jsonify({"message": "Server error"}), 500


# ----------------- Get All Applications -----------------
@application_bp.route("/applications", methods=["GET"])
@jwt_required()
def get_all():

    claims = get_jwt()
    if claims["designation"] not in ["admin", "authority"]:
        return jsonify({"message": "Access denied"}), 403

    apps = ApplicationRepository.get_all()

    return jsonify([a.application_id for a in apps])


# ----------------- My Applications -----------------
@application_bp.route("/my-applications", methods=["GET"])
@jwt_required()
def my_apps():

    user_id = get_jwt()["sub"]
    apps = ApplicationRepository.get_by_user(user_id)

    return jsonify([a.application_id for a in apps])

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