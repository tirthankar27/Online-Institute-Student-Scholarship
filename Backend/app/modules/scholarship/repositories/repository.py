# app/modules/scholarship/repository.py

from ..models import Scholarship
from app.extensions import db


class ScholarshipRepository:

    @staticmethod
    def create(scholarship):
        db.session.add(scholarship)
        db.session.commit()
        return scholarship

    @staticmethod
    def get_all():
        return Scholarship.query.order_by(
            Scholarship.deadline.asc()
        ).all()

    @staticmethod
    def get_by_id(scholarship_id):
        return Scholarship.query.filter_by(
            scholarship_id=scholarship_id
        ).first()

    @staticmethod
    def increment_total_applicants(scholarship_id):
        scholarship = Scholarship.query.filter_by(
            scholarship_id=scholarship_id
        ).first()

        if not scholarship:
            return None

        scholarship.total_applicants += 1
        return scholarship