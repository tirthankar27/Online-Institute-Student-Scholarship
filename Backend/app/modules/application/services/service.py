from flask import current_app
from flask_jwt_extended import get_jwt
from app.extensions import db
from datetime import datetime
import os

from ..models import Application, ApprovedApplication
from ..repositories.repository import ApplicationRepository
from app.modules.scholarship.repositories.repository import ScholarshipRepository
from app.modules.scholarship.models import Scholarship

from ..constants import (
    STATUS_PENDING,
    STATUS_AUTH_APPROVED,
    STATUS_AUTH_REJECTED,
    STATUS_ADMIN_APPROVED,
    STATUS_ADMIN_REJECTED,
    VALID_STATUSES
)

class ApplicationService:

    # ---------------- SAVE FILES ----------------
    @staticmethod
    def save_files(files, roll_number):

        upload_base = current_app.config["UPLOAD_FOLDER"]
        user_folder = os.path.join(upload_base, roll_number)

        os.makedirs(user_folder, exist_ok=True)

        saved_files = {}

        for key in files:
            file = files[key]
            filename = file.filename
            filepath = os.path.join(user_folder, filename)
            file.save(filepath)
            saved_files[key] = filepath

        return saved_files


    # ---------------- APPLY ----------------
    @staticmethod
    def apply(data, files, user_claims):

        if user_claims["designation"] != "student":
            raise PermissionError("Students only")

        required_fields = [
            "scholarship_id", "name", "dob", "father_name",
            "mother_name", "institute_name", "cgpa",
            "marks_12", "email", "roll_number", "course"
        ]

        for field in required_fields:
            if not data.get(field):
                raise ValueError("All required fields must be filled")

        scholarship = ScholarshipRepository.get_by_id(
            data["scholarship_id"]
        )

        if not scholarship:
            raise ValueError("Scholarship not found")

        if scholarship.deadline < datetime.utcnow():
            raise ValueError("Deadline has passed")

        existing = Application.query.filter_by(
            scholarship_id=data["scholarship_id"],
            user_id=data["roll_number"]
        ).first()

        if existing:
            raise ValueError("You have already applied for this scholarship")

        saved_files = ApplicationService.save_files(
            files, data["roll_number"]
        )

        application = Application(
            scholarship_id=data["scholarship_id"],
            student_name=data["name"],
            dob=data["dob"],
            father_name=data["father_name"],
            mother_name=data["mother_name"],
            institute_name=data["institute_name"],
            cgpa=data["cgpa"],
            percent_12th=data["marks_12"],
            category_certificate=saved_files.get("category_certificate"),
            recent_sem_marksheet=saved_files.get("recent_sem_marksheet"),
            marksheet_12th=saved_files.get("marksheet_12"),
            id_card=saved_files.get("id_card"),
            user_id=data["roll_number"],
            email=data["email"],
            roll=data["roll_number"],
            course=data["course"],
            status=STATUS_PENDING
        )

        db.session.add(application)

        ScholarshipRepository.increment_total_applicants(
            data["scholarship_id"]
        )

        db.session.commit()

        return application


    # ---------------- VERIFY WORKFLOW ----------------
    @staticmethod
    def verify(application_id, status, user_claims):

        application = ApplicationRepository.get_by_id(application_id)

        if not application:
            raise ValueError("Application not found")

        if status not in VALID_STATUSES:
            raise ValueError("Invalid status")

        role = user_claims["designation"]

        if role == "authority":

            if application.status != STATUS_PENDING:
                raise PermissionError(
                    "Authority cannot modify after admin decision"
                )

            if status not in [STATUS_AUTH_APPROVED, STATUS_AUTH_REJECTED]:
                raise PermissionError("Invalid authority action")

            application.status = status
            application.verified_by_authority = True

        elif role == "admin":
            if application.status != STATUS_AUTH_APPROVED:
                raise PermissionError(
                    "Admin can only act after authority approval"
                )

            if status not in [STATUS_ADMIN_APPROVED, STATUS_ADMIN_REJECTED]:
                raise PermissionError("Invalid admin action")

            application.status = status
            application.verified_by_admin = True

            if status == STATUS_ADMIN_APPROVED:
                existing_approved = ApprovedApplication.query.filter_by(
                    application_id=application.application_id
                ).first()

                if not existing_approved:
                    approved_entry = ApprovedApplication(
                        application_id=application.application_id,
                        scholarship_id=application.scholarship_id,
                        user_id=application.user_id,
                        name=application.student_name,
                        institute=application.institute_name,
                        amount=Scholarship.query.filter_by(
                            scholarship_id=application.scholarship_id
                        ).first().amount
                    )

                    db.session.add(approved_entry)

        else:
            raise PermissionError("Unauthorized role")

        db.session.commit()

        return application


    # ---------------- GET ALL (ADMIN/AUTHORITY) ----------------
    @staticmethod
    def get_all(user_claims):

        if user_claims["designation"] not in ["admin", "authority"]:
            raise PermissionError("Access denied")

        return ApplicationRepository.get_all()


    # ---------------- MY APPLICATIONS ----------------
    @staticmethod
    def get_my_applications(user_claims):

        user_id = user_claims["sub"]

        return ApplicationRepository.get_by_user(user_id)