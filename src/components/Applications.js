import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Applications(props) {
  const [applications, setApplications] = useState([]);
  const [scholarship, setScholarship] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { scholarshipId } = useParams();

  useEffect(() => {
    const role = localStorage.getItem("designation");
    const token = localStorage.getItem("token");

    if (role !== "admin") {
      setMessage("Access denied: Admins only");
      setLoading(false);
      return;
    }

    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${props.getendpoint}/${scholarshipId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        
        if (res.ok) {
          if (data.data && data.data.applications) {
            setApplications(data.data.applications);
            setScholarship(data.data.scholarship);
          } else {
            setApplications([]);
            setMessage(data.message || "No applications found");
          }
        } else {
          setMessage(data.message || "Failed to fetch applications");
        }
      } catch (err) {
        setMessage("Server error while fetching applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [props.getendpoint, scholarshipId]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${props.updateendpoint}/${applicationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (res.ok) {
        setApplications(applications.map(app => 
          app._id === applicationId ? { ...app, status: newStatus } : app
        ));
        setMessage("Application status updated successfully");
      } else {
        setMessage("Failed to update application status");
      }
    } catch (err) {
      setMessage("Server error while updating status");
    }
  };

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: "bg-warning", text: "Pending" },
      approved: { class: "bg-success", text: "Approved" },
      rejected: { class: "bg-danger", text: "Rejected" },
      verified: { class: "bg-info", text: "Verified" },
      under_review: { class: "bg-primary", text: "Under Review" }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getVerificationBadge = (isVerified) => {
    return isVerified ? 
      <span className="badge bg-success">Verified</span> : 
      <span className="badge bg-secondary">Not Verified</span>;
  };

  return (
    <div className="container-fluid px-4 py-5">
      {/* Header Section */}
      <div className="sticky-top bg-white shadow-sm py-3 mb-4" style={{ top: '56px', zIndex: 100 }}>
        <div className="container" style={{ paddingTop: '80px' }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <button 
                className="btn btn-outline-secondary btn-sm mb-2"
                onClick={handleBackClick}
              >
                <i className="bi bi-arrow-left"></i> Back to Dashboard
              </button>
              <h2 className="fw-bold text-danger mb-1">
                Scholarship Applications
              </h2>
              {scholarship && (
                <p className="text-muted mb-0">
                  {scholarship.title} - {scholarship.organization}
                </p>
              )}
            </div>
            <div className="text-end">
              <span className="badge bg-success fs-6">
                Total Applications: {applications.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '80px' }}>
        {/* Message Alert */}
        {message && (
          <div
            className={`alert ${
              message.includes("denied") || message.includes("error") || message.includes("Failed")
                ? "alert-danger"
                : "alert-success"
            } alert-dismissible fade show mb-4`}
            role="alert"
          >
            {message}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setMessage("")}
            ></button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted mt-2">Loading applications...</p>
          </div>
        )}

        {/* Applications Table */}
        {!loading && applications.length > 0 ? (
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <h5 className="card-title mb-0 text-dark">
                <i className="bi bi-people me-2"></i>
                Applicant Details
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">#</th>
                      <th>Applicant Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Applied Date</th>
                      <th>Authority Verification</th>
                      <th>Current Status</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app, index) => (
                      <tr key={app._id || index} className="hover-shadow">
                        <td className="ps-4 fw-semibold text-muted">{index + 1}</td>
                        <td>
                          <div className="fw-semibold text-dark">
                            {app.applicant?.name || "N/A"}
                          </div>
                        </td>
                        <td>
                          <div className="text-truncate" style={{ maxWidth: "200px" }}>
                            {app.applicant?.email || "N/A"}
                          </div>
                        </td>
                        <td>{app.applicant?.phone || "N/A"}</td>
                        <td>
                          {app.appliedDate ? 
                            new Date(app.appliedDate).toLocaleDateString() : "N/A"
                          }
                        </td>
                        <td>
                          {getVerificationBadge(app.authorityVerified)}
                        </td>
                        <td>
                          {getStatusBadge(app.status)}
                        </td>
                        <td className="text-center">
                          <div className="btn-group btn-group-sm" role="group">
                            {app.status !== "approved" && (
                              <button
                                className="btn btn-outline-success"
                                onClick={() => handleStatusUpdate(app._id, "approved")}
                                title="Approve Application"
                                disabled={!app.authorityVerified}
                              >
                                <i className="bi bi-check-lg"></i> Approve
                              </button>
                            )}
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => navigate(`/application-details/${app._id}`)}
                              title="View Details"
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            {app.status !== "rejected" && (
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleStatusUpdate(app._id, "rejected")}
                                title="Reject Application"
                              >
                                <i className="bi bi-x-lg"></i>
                              </button>
                            )}
                          </div>
                          {!app.authorityVerified && app.status !== "approved" && (
                            <small className="text-warning d-block mt-1">
                              Verify with authority first
                            </small>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          !loading && !message && (
            <div className="text-center py-5">
              <div className="card border-0 shadow-sm">
                <div className="card-body py-5">
                  <i className="bi bi-people display-1 text-muted mb-3"></i>
                  <h4 className="text-muted mb-3">No Applications Yet</h4>
                  <p className="text-muted mb-4">
                    No one has applied for this scholarship yet.
                  </p>
                  <button 
                    className="btn btn-secondary"
                    onClick={handleBackClick}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Add Bootstrap Icons CSS */}
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css" 
        rel="stylesheet" 
      />
    </div>
  );
}