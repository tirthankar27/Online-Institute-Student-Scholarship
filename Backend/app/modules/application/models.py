# app/modules/application/models.py

from app.extensions import db
from datetime import datetime, timedelta
import uuid
from .constants import STATUS_PENDING
def default_renewal():
    return datetime.utcnow() + timedelta(days=365)

class Application(db.Model):
    __tablename__ = "application"

    application_id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    scholarship_id = db.Column(db.Integer, nullable=False)

    student_name = db.Column(db.String(255), nullable=False)
    dob = db.Column(db.Date, nullable=False)
    father_name = db.Column(db.String(255), nullable=False)
    mother_name = db.Column(db.String(255), nullable=False)
    institute_name = db.Column(db.String(255), nullable=False)

    cgpa = db.Column(db.Float, nullable=False)
    percent_12th = db.Column(db.Float, nullable=False)

    category_certificate = db.Column(db.String)
    recent_sem_marksheet = db.Column(db.String, nullable=False)
    marksheet_12th = db.Column(db.String, nullable=False)
    id_card = db.Column(db.String, nullable=False)

    user_id = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False)
    roll = db.Column(db.String, nullable=False)
    course = db.Column(db.String, nullable=False)

    status = db.Column(
        db.String(50),
        nullable=False,
        default=STATUS_PENDING
    )

    verified_by_authority = db.Column(db.Boolean, default=False)
    verified_by_admin = db.Column(db.Boolean, default=False)

class ApprovedApplication(db.Model):
    __tablename__ = "approved_applications"

    application_id = db.Column(
        db.Integer,
        primary_key=True,
        nullable=False,
        unique=True
    )

    scholarship_id = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.String, nullable=False)

    name = db.Column(db.String(255), nullable=False)
    institute = db.Column(db.String(255), nullable=False)
    amount = db.Column(db.Float, nullable=False)

    renewal_date = db.Column(db.DateTime, default=default_renewal)