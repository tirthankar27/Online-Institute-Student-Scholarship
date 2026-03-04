# app/modules/application/constants.py

STATUS_PENDING = "Pending"

STATUS_AUTH_APPROVED = "Approved by Authority"
STATUS_AUTH_REJECTED = "Rejected by Authority"

STATUS_ADMIN_APPROVED = "Approved by Admin"
STATUS_ADMIN_REJECTED = "Rejected by Admin"


VALID_STATUSES = [
    STATUS_PENDING,
    STATUS_AUTH_APPROVED,
    STATUS_AUTH_REJECTED,
    STATUS_ADMIN_APPROVED,
    STATUS_ADMIN_REJECTED,
]