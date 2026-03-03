from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from datetime import timedelta

from ..repositories.repository import AuthRepository
from ..models import User

allowed_designations = ["admin", "authority", "student"]

class AuthService:

    @staticmethod
    def signup(data):

        if data["designation"] not in allowed_designations:
            raise ValueError(
                f"Designation must be one of: {', '.join(allowed_designations)}"
            )

        existing = AuthRepository.get_by_user_id_or_email(
            data["user_id"], data["email"]
        )

        if existing:
            raise ValueError("User with this ID or email already exists")

        hashed_password = generate_password_hash(data["password"], method="pbkdf2:sha256", salt_length=16)

        user = User(
            user_id=data["user_id"],
            name=data["name"],
            email=data["email"],
            password=hashed_password,
            designation=data["designation"]
        )

        return AuthRepository.create(user)

    @staticmethod
    def login(data):

        user = AuthRepository.get_by_user_id(data["user_id"])

        if not user:
            raise ValueError("User not found")

        if not check_password_hash(user.password, data["password"]):
            raise ValueError("Invalid credentials")

        access_token = create_access_token(
            identity=user.user_id,
            additional_claims={
                "designation": user.designation,
                "email": user.email,
                "name": user.name
            },
            expires_delta=timedelta(hours=2)
        )

        return {
            "token": access_token,
            "user": user
        }