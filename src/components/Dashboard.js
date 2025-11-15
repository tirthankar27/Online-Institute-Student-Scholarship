import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard(props) {
  const [scholarships, setScholarships] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("designation");
    const token = localStorage.getItem("token");

    if (role !== "admin") {
      setMessage("Access denied: Admins only");
      setLoading(false);
      return;
    }

    const fetchScholarships = async () => {
      try {
        setLoading(true);
        const res = await fetch(props.getendpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log("Fetched data:", data);
        if (res.ok) {
          if (data.data && data.data.length > 0) {
            setScholarships(data.data);
          } else {
            setScholarships([]);
            setMessage(data.message || "No scholarships found");
          }
        } else {
          setMessage(data.message || "Failed to fetch scholarships");
        }
      } catch (err) {
        setMessage("Server error while fetching scholarships");
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, [props.getendpoint]);

  const handlePostClick = () => {
    navigate("/postscholarship");
  };

  const handleEditClick = (scholarshipId) => {
    navigate(`/editscholarship/${scholarshipId}`);
  };

  const handleApplicantsClick = () => {
    navigate("/applications")
  }

  const handleDeleteClick = async (scholarshipId) => {
    if (window.confirm("Are you sure you want to delete this scholarship?")) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${props.deleteendpoint || props.getendpoint}/${scholarshipId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (res.ok) {
          setScholarships(scholarships.filter(sch => sch._id !== scholarshipId));
          setMessage("Scholarship deleted successfully");
        } else {
          setMessage("Failed to delete scholarship");
        }
      } catch (err) {
        setMessage("Server error while deleting scholarship");
      }
    }
  };

  return (
    <div className="container-fluid px-4 py-5">
      {/* Header Section with Fixed Positioning */}
      <div className="sticky-top bg-white shadow-sm py-3 mb-4" style={{ top: '56px', zIndex: 100 }}>
        <div className="container" style={{ paddingTop: '80px' }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold text-danger mb-1">Manage Scholarships</h2>
              <p className="text-muted mb-0">Admin Dashboard</p>
            </div>
            <button 
              className="btn btn-danger btn-lg d-flex align-items-center gap-2"
              onClick={handlePostClick}
            >
              <i className="bi bi-plus-circle"></i>
              Post New Scholarship
            </button>
          </div>
        </div>
      </div>

      <div className="container">
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
            <p className="text-muted mt-2">Loading scholarships...</p>
          </div>
        )}

        {/* Scholarships Table */}
        {!loading && scholarships.length > 0 ? (
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <h5 className="card-title mb-0 text-dark">
                <i className="bi bi-trophy me-2"></i>
                Available Scholarships ({scholarships.length})
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">#</th>
                      <th>Title</th>
                      <th>Organization</th>
                      <th>Description</th>
                      <th>Deadline</th>
                      <th>Amount</th>
                      <th>Applicants</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scholarships.map((sch, index) => (
                      <tr key={sch._id || index} className="hover-shadow">
                        <td className="ps-4 fw-semibold text-muted">{index + 1}</td>
                        <td>
                          <div className="fw-semibold text-dark">{sch.title}</div>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark">
                            {sch.organization}
                          </span>
                        </td>
                        <td>
                          <div className="text-truncate" style={{ maxWidth: "200px" }} 
                               title={sch.description}>
                            {sch.description}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${
                            new Date(sch.deadline) > new Date() 
                              ? 'bg-success' 
                              : 'bg-danger'
                          }`}>
                            {new Date(sch.deadline).toLocaleDateString()}
                          </span>
                        </td>
                        <td>
                          <span className="fw-bold text-success">
                            ₹{sch.amount?.toLocaleString() || '0'}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-info rounded-pill">
                            {sch.total_applicants || 0}
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="btn-group btn-group-sm" role="group">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => handleEditClick(sch._id)}
                              title="Edit Scholarship"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-outline-success"
                              onClick={() => handleApplicantsClick(sch._id)}
                              title="View Applicants"
                            >
                              <i className="bi bi-people"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDeleteClick(sch._id)}
                              title="Delete Scholarship"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
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
                  <i className="bi bi-trophy display-1 text-muted mb-3"></i>
                  <h4 className="text-muted mb-3">No Scholarships Posted Yet</h4>
                  <p className="text-muted mb-4">
                    Get started by posting your first scholarship opportunity.
                  </p>
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={handlePostClick}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Post Your First Scholarship
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css" 
        rel="stylesheet" 
      />
    </div>
  );
}