# app/modules/auth/repositories/repository.py

from ..models import User
from app.extensions import db

class AuthRepository:

    @staticmethod
    def get_by_user_id(user_id):
        return User.query.filter_by(user_id=user_id).first()

    @staticmethod
    def get_by_user_id_or_email(user_id, email):
        return User.query.filter(
            (User.user_id == user_id) | (User.email == email)
        ).first()

    @staticmethod
    def create(user):
        db.session.add(user)
        db.session.commit()
        return user