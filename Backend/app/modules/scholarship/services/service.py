# app/modules/scholarship/service.py

from ..repositories.repository import ScholarshipRepository
from ..models import Scholarship


class ScholarshipService:

    @staticmethod
    def insert(data):

        required_fields = ["title", "organization", "description", "deadline", "amount"]

        for field in required_fields:
            if not data.get(field):
                raise ValueError("All fields are required")

        scholarship = Scholarship(
            title=data["title"],
            organization=data["organization"],
            description=data["description"],
            deadline=data["deadline"],
            amount=data["amount"]
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