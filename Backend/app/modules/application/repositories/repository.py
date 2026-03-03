# app/modules/application/repository.py

from ..models import Application
from app.extensions import db


class ApplicationRepository:

    @staticmethod
    def create(application):
        db.session.add(application)
        db.session.commit()
        return application

    @staticmethod
    def get_all():
        return Application.query.all()

    @staticmethod
    def get_by_id(application_id):
        return Application.query.filter_by(
            application_id=application_id
        ).first()

    @staticmethod
    def get_by_user(user_id):
        return Application.query.filter_by(
            user_id=user_id
        ).all()

    @staticmethod
    def update(application):
        db.session.commit()
        return application