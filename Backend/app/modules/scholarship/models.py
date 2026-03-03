# app/modules/scholarship/models.py

from app.extensions import db
from datetime import datetime
import uuid


class Scholarship(db.Model):
    __tablename__ = "scholarship"

    scholarship_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)
    organization = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    deadline = db.Column(db.DateTime, nullable=False)
    total_applicants = db.Column(
        db.Integer,
        nullable=False,
        default=0
    )
    amount = db.Column(db.Float, nullable=False)