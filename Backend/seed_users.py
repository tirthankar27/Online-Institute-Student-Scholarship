from werkzeug.security import generate_password_hash
from app import create_app
from app.extensions import db
from app.modules.auth.models import User

app = create_app()

with app.app_context():

    users = [
        {
            "user_id": "adminnit",
            "name": "Admin",
            "email": "admin@nitsikkim.ac.in",
            "password": "admin",
            "designation": "admin"
        },
        {
            "user_id": "authnit",
            "name": "Authority",
            "email": "authority@nitsikkim.ac.in",
            "password": "auth",
            "designation": "auth"
        }
    ]

    for user_data in users:
        existing_user = User.query.filter_by(
            email=user_data["email"]
        ).first()

        if not existing_user:
            user = User(
                user_id=user_data["user_id"],
                name=user_data["name"],
                email=user_data["email"],
                password=generate_password_hash(
                    user_data["password"],
                    method="pbkdf2:sha256"
                ),
                designation=user_data["designation"]
            )

            db.session.add(user)

    db.session.commit()
    print("Default users seeded successfully.")