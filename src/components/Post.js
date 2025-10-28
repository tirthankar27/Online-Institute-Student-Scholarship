import React, { useState } from "react";

export default function PostScholarship(props) {
  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    description: "",
    deadline: "",
    amount: "",
  });

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (role !== "admin") {
      setMessage("Access denied: Admins only");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch(props.postendpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Scholarship posted successfully!");
        setFormData({
          title: "",
          organization: "",
          description: "",
          deadline: "",
          amount: "",
        });
      } else {
        setMessage(data.message || "Failed to post scholarship");
      }
    } catch (err) {
      setMessage("Server error while posting scholarship");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid py-4 bg-light" style={{ minHeight: "calc(100vh - 80px)", marginTop: "110px", paddingLeft: "2rem", paddingRight: "2rem" }}>
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card shadow-lg p-5">
            <div className="text-center mb-4">
              <h2 className="fw-bold text-danger">Post New Scholarship</h2>
              <p className="text-muted">Fill in the details below to create a new scholarship opportunity</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="title" className="form-label fw-semibold">Scholarship Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Enter scholarship title"
                    value={formData.title}
                    onChange={handleChange}
                    className="form-control form-control-lg"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="organization" className="form-label fw-semibold">Organization</label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    placeholder="Organization name"
                    value={formData.organization}
                    onChange={handleChange}
                    className="form-control form-control-lg"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label fw-semibold">Description</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Provide detailed description..."
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control form-control-lg"
                  rows="4"
                  required
                ></textarea>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="deadline" className="form-label fw-semibold">Application Deadline</label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="form-control form-control-lg"
                    required
                  />
                </div>

                <div className="col-md-6 mb-4">
                  <label htmlFor="amount" className="form-label fw-semibold">Scholarship Amount ($)</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    placeholder="Enter amount in dollars"
                    value={formData.amount}
                    onChange={handleChange}
                    className="form-control form-control-lg"
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <button 
                    type="submit" 
                    className="btn btn-danger w-100 py-3 fw-semibold"
                    disabled={isSubmitting}
                    style={{ fontSize: "1.1rem" }}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Posting...
                      </>
                    ) : (
                      "Post Scholarship"
                    )}
                  </button>
                </div>
              </div>
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
      </div>
    </div>
  );
}