# Online Institute Student Scholarship Management System

A full-stack web application that allows institutes to manage and distribute scholarships to students efficiently. The system provides role-based access for administrators and students to streamline scholarship applications, approvals, and tracking.

## Features

### Student

* Register and login securely
* View available scholarships
* Apply for scholarships
* Track application status
* Upload required documents

### Administrator

* Create and manage scholarships
* Review student applications
* Approve or reject applications
* Manage student records
* Track scholarship distribution

## Tech Stack

Frontend

* React.js
* BootStrap
* JavaScript

Backend

* Flask (Python)
* REST API

Database

* MySQL / SQLite

Authentication

* JWT Authentication

## Installation

### Clone Repository

```
git clone https://github.com/yourusername/scholarship-management-system.git
cd scholarship-management-system
```

### Backend Setup

```
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

### Frontend Setup

```
cd frontend
npm install
npm start
```

The application will run on:

Frontend

```
http://localhost:3000
```

Backend

```
http://localhost:5000
```

## API Features

* User Authentication
* Scholarship CRUD operations
* Application submission
* Document uploads
* Status tracking

## Security Features

* JWT authentication
* Protected API routes
* Role-based access control
* Secure password hashing

## Future Improvements

* Email notifications
* Admin analytics dashboard
* Scholarship eligibility filtering
* Cloud document storage

## Author

Tirthankar Ghosh
BTech – NIT Sikkim

## License

This project is for educational purposes.
