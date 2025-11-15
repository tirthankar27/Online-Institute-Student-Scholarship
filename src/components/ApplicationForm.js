import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

export default function ApplicationForm(props) {
  const {user} = useAuth();
  const { id } = useParams();
  const [scholarship, setScholarship] = useState(null);
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
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchScholarship = async () => {
      try {
        const res = await fetch(`${props.scholarshipendpoint}/${id}`);
        const data = await res.json();
        if (res.ok) setScholarship(data.data);
      } catch (err) {
        console.error("Error fetching scholarship:", err);
      }
    };
    fetchScholarship();
  }, [id]);

  // Handle form field change
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
      
      // Append all form fields
      for (let key in formData) {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      }
      
      formDataToSend.append("scholarship_id", id);
      // Get token from localStorage or your auth context
      const token = localStorage.getItem('token'); // Adjust based on your auth setup

      const res = await fetch(props.applyendpoint,
        {
          method: "POST",
          body: formDataToSend,
        }
      );

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
      } else {
        setMessage(data.message || "Failed to submit application.");
      }
    } catch (err) {
      console.error("Error submitting application:", err);
      setMessage("Server error. Please try again later.");
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
              {new Date(scholarship.deadline).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
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
              placeholder="Enter your father's name"
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
              placeholder="Enter your mother's name"
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
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Institute</label>
            <input
              type="text"
              className="form-control"
              name="institute_name"
              value={formData.institute_name}
              onChange={handleChange}
              required
              placeholder="Enter your institute's name"
            />
          </div>

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
                placeholder="Enter roll number"
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
                placeholder="Enter your course"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">CGPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                className="form-control"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
                required
                placeholder="Current CGPA"
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">12th marks (%)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                className="form-control"
                name="marks_12"
                value={formData.marks_12}
                onChange={handleChange}
                required
                placeholder="12th marks percentage"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Upload ID card (PDF)
            </label>
            <input
              type="file"
              className="form-control"
              name="id_card"
              accept=".pdf"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Upload Category Certificate (PDF)
            </label>
            <input
              type="file"
              className="form-control"
              name="category_certificate"
              accept=".pdf"
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Upload Semester Marksheet (PDF)
            </label>
            <input
              type="file"
              className="form-control"
              name="recent_sem_marksheet"
              accept=".pdf"
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
              accept=".pdf"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-danger w-100 fw-semibold py-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>

        {message && (
          <div
            className={`alert mt-4 text-center ${
              message.includes("success")
                ? "alert-success"
                : "alert-danger"
            }`}
            role="alert"
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}