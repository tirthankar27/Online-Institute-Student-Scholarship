import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

export default function MyApplications() {
  const { user } = useAuth();
  const API = process.env.REACT_APP_API_BASE_URL;
  
  const [applications, setApplications] = useState([]);
  const [scholarships, setScholarships] = useState({});
  const [viewModalApp, setViewModalApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingDocuments, setLoadingDocuments] = useState({});

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Helper function to create headers with authorization
  const getAuthHeaders = () => {
    const token = getToken();
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  };

  const viewDocument = async (filePath, documentType, buttonKey) => {
    if (!filePath) {
      alert(`${documentType} not available`);
      return;
    }

    try {
      setLoadingDocuments((prev) => ({ ...prev, [buttonKey]: true }));

      // Fetch protected document with authentication
      const fileURL = `${API}/applications/files/${filePath}`;
      const response = await fetch(fileURL, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        },
        credentials: 'include'
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        window.open(blobUrl, "_blank");
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
      } else {
        alert(`Unable to load ${documentType}. Please try again later.`);
      }
    } catch (error) {
      console.error(`Error viewing ${documentType}:`, error);
      alert(`Unable to load ${documentType}`);
    } finally {
      setLoadingDocuments((prev) => ({ ...prev, [buttonKey]: false }));
    }
  };

  const fetchMyApplications = useCallback(async () => {
  if (!user?.user_id) return;
  
  try {
    setLoading(true);
    // Fixed endpoint - get applications by user
    const response = await fetch(`${API}/applications/my-applications`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: 'include'
    });

    const data = await response.json();

    if (response.ok) {
      // Your API returns { data: [...] } with full application details
      if (data.data && Array.isArray(data.data)) {
        // Directly set the applications from data.data
        setApplications(data.data);

        // Extract unique scholarship IDs to fetch their details
        const uniqueScholarshipIds = [
          ...new Set(
            data.data.map((app) => app.scholarship_id).filter(Boolean)
          ),
        ];

        // Fetch scholarship details for each unique ID
        uniqueScholarshipIds.forEach((scholarshipId) => {
          fetchScholarshipDetails(scholarshipId);
        });

        // Fetch approved data for each application if needed
        data.data.forEach((app) => {
          if (app.status === "Approved by Admin") {
            fetchApprovedData(app.application_id, app.scholarship_id);
          }
        });
      } else {
        // Fallback for different response structure
        setApplications(data.applications || []);
      }
    } else {
      setError(data.message || "Failed to fetch applications");
      
      if (response.status === 401) {
        // Redirect to login if unauthorized
        // window.location.href = '/login';
      }
    }
  } catch (err) {
    console.error("Error fetching applications:", err);
    setError("Network error. Please try again.");
  } finally {
    setLoading(false);
  }
}, [user?.user_id, API]);

  const fetchScholarshipDetails = async (scholarshipId) => {
    try {
      // Fixed endpoint for fetching scholarship details
      const response = await fetch(`${API}/scholarships/scheme/${scholarshipId}`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      
      const data = await response.json();

      if (response.ok) {
        setScholarships((prev) => ({
          ...prev,
          [scholarshipId]: data.data || data,
        }));
      }
    } catch (err) {
      console.error("Error fetching scholarship details:", err);
    }
  };

  const fetchApprovedData = async (applicationId, scholarshipId) => {
    try {
      // Fixed endpoint for fetching approved application data
      const response = await fetch(`${API}/application/approved/${applicationId}`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: 'include'
      });

      const data = await response.json();
      if (response.ok && data.data) {
        setScholarships((prev) => ({
          ...prev,
          [scholarshipId]: {
            ...prev[scholarshipId],
            ...data.data,
          },
        }));
      }
    } catch (err) {
      console.error("Error fetching approved data:", err);
    }
  };

  useEffect(() => {
    fetchMyApplications();
  }, [fetchMyApplications]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      "Pending": {
        class: "bg-warning text-dark",
        text: "Pending Authority Review",
      },
      "Approved by Authority": {
        class: "bg-info text-white",
        text: "Authority Approved",
      },
      "Approved by Admin": { 
        class: "bg-success text-white", 
        text: "Approved" 
      },
      "Rejected by Authority": {
        class: "bg-danger text-white",
        text: "Rejected by Authority",
      },
      "Rejected by Admin": {
        class: "bg-danger text-white",
        text: "Rejected by Admin",
      },
    };

    const config = statusConfig[status] || {
      class: "bg-secondary text-white",
      text: status,
    };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (!user) {
    return (
      <div className="container mt-4" style={{ paddingTop: "120px" }}>
        <div className="alert alert-warning text-center">
          Please log in to view your applications.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-4" style={{ paddingTop: "120px" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container-fluid mt-4"
      style={{ paddingTop: "120px", paddingLeft: "20px", paddingRight: "20px" }}
    >
      <div className="card shadow">
        <div className="card-header bg-danger text-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="mb-0">My Scholarship Applications</h3>
              <p className="mb-0">Total Applications: {applications.length}</p>
            </div>
            <button
              className="btn btn-light"
              onClick={fetchMyApplications}
            >
              <i className="fas fa-sync-alt"></i> Refresh
            </button>
          </div>
        </div>

        <div className="card-body p-0">
          {error && (
            <div className="alert alert-danger m-3" role="alert">
              {error}
            </div>
          )}

          {applications.length === 0 ? (
            <div className="text-center py-4">
              <i className="fas fa-file-alt fa-3x text-muted mb-3"></i>
              <h5>No Applications Found</h5>
              <p className="text-muted">
                You haven't applied for any scholarships yet.
              </p>
              <a href="/schemes" className="btn btn-primary">
                Browse Scholarships
              </a>
            </div>
          ) : (
            <div
              className="table-responsive"
              style={{ maxHeight: "70vh", overflow: "auto" }}
            >
              <table
                className="table table-hover mb-0"
                style={{ minWidth: "1600px" }}
              >
                <thead className="table-light sticky-top bg-light">
                  <tr>
                    <th
                      style={{
                        minWidth: "140px",
                        position: "sticky",
                        left: 0,
                        background: "#f8f9fa",
                        zIndex: 2,
                      }}
                    >
                      Application ID
                    </th>
                    <th style={{ minWidth: "150px" }}>Scholarship</th>
                    <th style={{ minWidth: "130px" }}>Deadline</th>
                    <th style={{ minWidth: "160px" }}>Name</th>
                    <th style={{ minWidth: "160px" }}>Father Name</th>
                    <th style={{ minWidth: "160px" }}>Mother Name</th>
                    <th style={{ minWidth: "110px" }}>DOB</th>
                    <th style={{ minWidth: "130px" }}>Roll Number</th>
                    <th style={{ minWidth: "120px" }}>Institute</th>
                    <th style={{ minWidth: "160px" }}>Course</th>
                    <th style={{ minWidth: "90px" }}>CGPA</th>
                    <th style={{ minWidth: "130px" }}>12th Marks (%)</th>
                    <th style={{ minWidth: "120px" }}>Status</th>
                    <th style={{ minWidth: "100px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application) => (
                    <tr key={application.application_id}>
                      <td
                        style={{
                          position: "sticky",
                          left: 0,
                          background: "white",
                          zIndex: 1,
                        }}
                      >
                        <strong>#{application.application_id}</strong>
                      </td>
                      <td>
                        <div>
                          <strong className="text-success">
                            {scholarships[application.scholarship_id]?.title || "Loading..."}
                          </strong>
                        </div>
                      </td>
                      <td>
                        {formatDate(
                          scholarships[application.scholarship_id]?.deadline
                        )}
                      </td>
                      <td>{application.student_name}</td>
                      <td>{application.father_name}</td>
                      <td>{application.mother_name}</td>
                      <td>{formatDate(application.dob)}</td>
                      <td>{application.roll}</td>
                      <td>{application.institute_name}</td>
                      <td>{application.course}</td>
                      <td>
                        <span className="badge bg-light text-dark">
                          {application.cgpa}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark">
                          {application.percent_12th}%
                        </span>
                      </td>
                      <td>{getStatusBadge(application.status)}</td>
                      <td
                        style={{
                          position: "sticky",
                          right: 0,
                          background: "white",
                          zIndex: 1,
                        }}
                      >
                        <button
                          className="btn btn-sm btn-outline-primary w-100"
                          onClick={() => {
                            const scholarship = scholarships[application.scholarship_id] || {};
                            setViewModalApp({
                              ...application,
                              scholarship_title: scholarship.title || "N/A",
                              amount: scholarship.amount || "N/A",
                              renewal_date: scholarship.renewal_date || null,
                            });
                          }}
                        >
                          <i className="fas fa-eye me-1"></i>
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      {viewModalApp && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow-lg">
              {/* HEADER */}
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  Application Details - #{viewModalApp.application_id}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setViewModalApp(null)}
                ></button>
              </div>

              {/* BODY */}
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="border-bottom pb-2">Student Information</h6>
                    <p><strong>Name:</strong> {viewModalApp.student_name}</p>
                    <p><strong>Father's Name:</strong> {viewModalApp.father_name}</p>
                    <p><strong>Mother's Name:</strong> {viewModalApp.mother_name}</p>
                    <p><strong>Date of Birth:</strong> {formatDate(viewModalApp.dob)}</p>
                    <p><strong>Email:</strong> {viewModalApp.email}</p>
                  </div>

                  <div className="col-md-6">
                    <h6 className="border-bottom pb-2">Academic Information</h6>
                    <p><strong>Institute:</strong> {viewModalApp.institute_name}</p>
                    <p><strong>Course:</strong> {viewModalApp.course}</p>
                    <p><strong>Roll Number:</strong> {viewModalApp.roll}</p>
                    <p><strong>CGPA:</strong> {viewModalApp.cgpa}</p>
                    <p><strong>12th Marks:</strong> {viewModalApp.percent_12th}%</p>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-6">
                    <h6 className="border-bottom pb-2">Scholarship Details</h6>
                    <p><strong>Title:</strong> {viewModalApp.scholarship_title}</p>
                    <p><strong>Amount:</strong> ₹{viewModalApp.amount}</p>
                    {viewModalApp.renewal_date && (
                      <p><strong>Renewal Date:</strong> {formatDate(viewModalApp.renewal_date)}</p>
                    )}
                  </div>

                  <div className="col-md-6">
                    <h6 className="border-bottom pb-2">Application Status</h6>
                    <p><strong>Status:</strong> {getStatusBadge(viewModalApp.status)}</p>
                    <p><strong>Verified by Authority:</strong> {viewModalApp.verified_by_authority ? "Yes" : "No"}</p>
                    <p><strong>Verified by Admin:</strong> {viewModalApp.verified_by_admin ? "Yes" : "No"}</p>
                  </div>
                </div>

                <hr />

                <h6 className="border-bottom pb-2">Documents</h6>
                <div className="d-flex gap-2 flex-wrap mt-3">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() =>
                      viewDocument(
                        viewModalApp.id_card,
                        "ID Card",
                        `v-idCard-${viewModalApp.application_id}`
                      )
                    }
                    disabled={!viewModalApp.id_card || loadingDocuments[`v-idCard-${viewModalApp.application_id}`]}
                  >
                    {loadingDocuments[`v-idCard-${viewModalApp.application_id}`] ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-1"></i>
                        Loading...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-id-card me-1"></i> ID Card
                      </>
                    )}
                  </button>

                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() =>
                      viewDocument(
                        viewModalApp.recent_sem_marksheet,
                        "Semester Marksheet",
                        `v-sem-${viewModalApp.application_id}`
                      )
                    }
                    disabled={!viewModalApp.recent_sem_marksheet || loadingDocuments[`v-sem-${viewModalApp.application_id}`]}
                  >
                    {loadingDocuments[`v-sem-${viewModalApp.application_id}`] ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-1"></i>
                        Loading...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-file-alt me-1"></i> Semester Marksheet
                      </>
                    )}
                  </button>

                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() =>
                      viewDocument(
                        viewModalApp.marksheet_12th,
                        "12th Marksheet",
                        `v-12th-${viewModalApp.application_id}`
                      )
                    }
                    disabled={!viewModalApp.marksheet_12th || loadingDocuments[`v-12th-${viewModalApp.application_id}`]}
                  >
                    {loadingDocuments[`v-12th-${viewModalApp.application_id}`] ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-1"></i>
                        Loading...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-graduation-cap me-1"></i> 12th Marksheet
                      </>
                    )}
                  </button>

                  {viewModalApp.category_certificate && (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() =>
                        viewDocument(
                          viewModalApp.category_certificate,
                          "Category Certificate",
                          `v-cat-${viewModalApp.application_id}`
                        )
                      }
                      disabled={loadingDocuments[`v-cat-${viewModalApp.application_id}`]}
                    >
                      {loadingDocuments[`v-cat-${viewModalApp.application_id}`] ? (
                        <>
                          <i className="fas fa-spinner fa-spin me-1"></i>
                          Loading...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-certificate me-1"></i> Category Certificate
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* FOOTER */}
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setViewModalApp(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}