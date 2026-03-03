# app/modules/scholarship/service.py

from ..repositories.repository import ScholarshipRepository
from ..models import Scholarship
from datetime import datetime

class ScholarshipService:

    @staticmethod
    def insert(data):

        required_fields = ["title", "organization", "description", "deadline", "amount"]

        for field in required_fields:
            if not data.get(field):
                raise ValueError("All fields are required")
        
        try:
            deadline = datetime.strptime(data["deadline"], "%Y-%m-%d")
            amount = float(data["amount"])
        except Exception:
            raise ValueError("Invalid date or amount format")

        scholarship = Scholarship(
            title=data["title"],
            organization=data["organization"],
            description=data["description"],
            deadline=deadline,
            amount=amount
        )

        return ScholarshipRepository.create(scholarship)

    @staticmethod
    def list_all():
        return ScholarshipRepository.get_all()

    @staticmethod
    def get_one(scholarship_id):
        scholarship = ScholarshipRepository.get_by_id(scholarship_id)

        if not scholarship:
            raise ValueError("No scholarships found")

        return scholarship
    
    @staticmethod
    def delete(scholarship_id):
        scholarship = ScholarshipRepository.delete(scholarship_id)

        if not scholarship:
            raise ValueError("Scholarship not found")

        return scholarship
    
    @staticmethod
    def increment_applicant_count(scholarship_id):
        scholarship = ScholarshipRepository.increment_total_applicants(
            scholarship_id
        )

        if not scholarship:
            raise ValueError("Scholarship not found")

        return scholarship