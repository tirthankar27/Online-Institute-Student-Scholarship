import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ApplicationForm() {
  const { user } = useAuth();
  const { id } = useParams();
  
  const API = process.env.REACT_APP_API_BASE_URL;

  const [scholarship, setScholarship] = useState(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    father_name: "",
    mother_name: "",
    email: "",
    institute_name: "",
    roll_number: "",
    course: "",
    cgpa: "",
    marks_12: "",
    id_card: null,
    category_certificate: null,
    recent_sem_marksheet: null,
    marksheet_12: null,
  });

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Helper function to create headers with authorization
  const getAuthHeaders = (isMultipart = false) => {
    const token = getToken();
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    
    // Don't set Content-Type for multipart form data - browser will set it with boundary
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }
    
    return headers;
  };

  // Fetch scholarship details
  useEffect(() => {
    const fetchScholarship = async () => {
      try {
        // Fixed endpoint for fetching scholarship details
        const res = await fetch(`${API}/scholarships/scheme/${id}`, {
          method: "GET",
          headers: getAuthHeaders(),
          credentials: 'include'
        });
        
        const data = await res.json();
        if (res.ok) {
          setScholarship(data.data || data);
        } else {
          console.error("Failed to fetch scholarship:", data.message);
        }
      } catch (err) {
        console.error("Error fetching scholarship:", err);
      }
    };
    
    if (id) {
      fetchScholarship();
    }
  }, [id, API]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Append matching backend fields
      formDataToSend.append("student_name", formData.name);
      formDataToSend.append("dob", formData.dob);
      formDataToSend.append("father_name", formData.father_name);
      formDataToSend.append("mother_name", formData.mother_name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("institute_name", formData.institute_name);
      formDataToSend.append("roll", formData.roll_number);
      formDataToSend.append("course", formData.course);
      formDataToSend.append("cgpa", formData.cgpa);
      formDataToSend.append("percent_12th", formData.marks_12);

      // Required by backend:
      formDataToSend.append("scholarship_id", id);

      // Append files (correct backend names)
      if (formData.id_card) {
        formDataToSend.append("id_card", formData.id_card);
      }

      if (formData.category_certificate) {
        formDataToSend.append("category_certificate", formData.category_certificate);
      }

      if (formData.recent_sem_marksheet) {
        formDataToSend.append("recent_sem_marksheet", formData.recent_sem_marksheet);
      }

      if (formData.marksheet_12) {
        formDataToSend.append("marksheet_12th", formData.marksheet_12);
      }

      // Fixed endpoint for applying to scholarship
      const res = await fetch(`${API}/applications/apply`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${getToken()}`
        },
        body: formDataToSend,
        credentials: 'include'
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Application submitted successfully!");

        // Reset form
        setFormData({
          name: "",
          dob: "",
          father_name: "",
          mother_name: "",
          email: "",
          institute_name: "",
          roll_number: "",
          course: "",
          cgpa: "",
          marks_12: "",
          id_card: null,
          category_certificate: null,
          recent_sem_marksheet: null,
          marksheet_12: null,
        });

        // Reset file input fields
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => input.value = '');
        
      } else {
        // Handle specific error cases
        if (res.status === 401) {
          setMessage("Unauthorized: Please login again");
          // Redirect to login if needed
          // window.location.href = '/login';
        } else if (res.status === 403) {
          setMessage("Access denied: Insufficient permissions");
        } else if (res.status === 400) {
          setMessage(data.message || "Invalid application data");
        } else {
          setMessage(data.message || "Submission failed.");
        }
      }
    } catch (err) {
      console.error("Error submitting:", err);
      setMessage("Server error. Try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="container py-5"
      style={{ marginTop: "100px", maxWidth: "800px" }}
    >
      <div className="card shadow p-4">
        <h2 className="text-center text-danger fw-bold mb-4">
          Scholarship Application Form
        </h2>

        {scholarship && (
          <div className="mb-4 text-center">
            <h4 className="fw-semibold">{scholarship.title}</h4>
            <p className="text-muted">
              Deadline:{" "}
              {new Date(scholarship.deadline).toLocaleDateString("en-GB")}
            </p>
            {scholarship.amount && (
              <p className="text-success fw-bold">
                Amount: ₹{scholarship.amount}
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* TEXT FIELDS */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Date of Birth</label>
            <input
              type="date"
              className="form-control"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Father Name</label>
            <input
              type="text"
              className="form-control"
              name="father_name"
              value={formData.father_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Mother Name</label>
            <input
              type="text"
              className="form-control"
              name="mother_name"
              value={formData.mother_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Institute Name</label>
            <input
              type="text"
              className="form-control"
              name="institute_name"
              value={formData.institute_name}
              onChange={handleChange}
              required
            />
          </div>

          {/* ROLL & COURSE */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Roll Number</label>
              <input
                type="text"
                className="form-control"
                name="roll_number"
                value={formData.roll_number}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Course</label>
              <input
                type="text"
                className="form-control"
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* CGPA + 12th MARKS */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">CGPA</label>
              <input
                type="number"
                className="form-control"
                name="cgpa"
                step="0.01"
                min="0"
                max="10"
                value={formData.cgpa}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">12th Marks (%)</label>
              <input
                type="number"
                className="form-control"
                name="marks_12"
                step="0.01"
                min="0"
                max="100"
                value={formData.marks_12}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* FILE UPLOADS */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Upload ID Card (PDF)
            </label>
            <input
              type="file"
              className="form-control"
              name="id_card"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleChange}
              required
            />
            <small className="text-muted">Accepted formats: PDF, JPG, PNG</small>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Upload Category Certificate (PDF)
            </label>
            <input
              type="file"
              className="form-control"
              name="category_certificate"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleChange}
            />
            <small className="text-muted">Optional: Upload if applicable</small>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Upload Semester Marksheet (PDF)
            </label>
            <input
              type="file"
              className="form-control"
              name="recent_sem_marksheet"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">
              Upload 12th Marksheet (PDF)
            </label>
            <input
              type="file"
              className="form-control"
              name="marksheet_12"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-danger w-100 fw-semibold py-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </button>
        </form>

        {message && (
          <div
            className={`alert mt-4 text-center ${
              message.includes("success") ? "alert-success" : "alert-danger"
            }`}
            role="alert"
          >
            <i className={`bi ${message.includes("success") ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"} me-2`}></i>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}