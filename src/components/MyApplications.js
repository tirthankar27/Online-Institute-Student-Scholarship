import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

export default function MyApplications(props) {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [scholarships, setScholarships] = useState({});
  const [viewModalApp, setViewModalApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const viewDocument = async (filePath, documentType, buttonKey) => {
    if (!filePath) {
      alert(`${documentType} not available`);
      return;
    }

    try {
      const fileURL = `${process.env.REACT_APP_BACKEND_URL}/${filePath}`;
      window.open(fileURL, "_blank");
    } catch (error) {
      alert(`Unable to load ${documentType}`);
    }
  };

  const fetchMyApplications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(props.getapplications, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user.user_id }),
      });

      const data = await response.json();

      if (response.ok) {
        setApplications(data.applications || []);

        // Extract unique scholarship IDs to fetch their names
        const uniqueScholarshipIds = [
          ...new Set(
            data.applications.map((app) => app.scholarship_id).filter(Boolean)
          ),
        ];

        // Fetch scholarship details for each unique ID
        data.applications.forEach((app) => {
          fetchScholarshipDetails(app.scholarship_id, app.application_id);
        });
      } else {
        setError(data.message || "Failed to fetch applications");
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchScholarshipDetails = async (scholarshipId, applicationId) => {
    try {
      const response = await fetch(
        `${props.scholarshipendpoint}/${scholarshipId}`
      );
      const data = await response.json();
      let approvedData = await fetchApprovedData(applicationId);

      if (response.ok && data.data) {
        setScholarships((prev) => ({
          ...prev,
          [scholarshipId]: {
            ...data.data,
            ...approvedData,
          },
        }));
      }
    } catch (err) {
      console.error("Error fetching scholarship details:", err);
    }
  };
  const fetchApprovedData = async (applicationId) => {
    try {
      const response = await fetch(props.approvedApplication, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ application_id: applicationId }),
      });

      const data = await response.json();
      if (response.ok && data.data) {
        return data.data; // { amount, renewal_date }
      }
    } catch (err) {
      console.error("Error fetching approved data:", err);
    }

    return null;
  };

  useEffect(() => {
    if (user?.user_id) {
      fetchMyApplications();
    }
  }, [user]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      "Under Authority Verification": {
        class: "bg-warning text-dark",
        text: "Under Review",
      },
      "Approved by Authority": {
        class: "bg-info text-white",
        text: "Authority Approved",
      },
      "Approved by Admin": { class: "bg-success text-white", text: "Approved" },
      "Rejected by Authority": {
        class: "bg-danger text-white",
        text: "Rejected by Authority",
      },
      "Rejected by Admin": {
        class: "bg-danger text-white",
        text: "Rejected by Admin",
      },
      "Pending Documents": {
        class: "bg-secondary text-white",
        text: "Pending Documents",
      },
    };

    const config = statusConfig[status] || {
      class: "bg-secondary text-white",
      text: status,
    };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (!user) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning text-center">
          Please log in to view your applications.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-4">
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
          <h3 className="mb-0">My Scholarship Applications</h3>
          <p className="mb-0">Total Applications: {applications.length}</p>
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
                    <th style={{ minWidth: "30px" }}>Actions</th>
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
                            {scholarships[application.scholarship_id]?.title}
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
                            const scholarship =
                              scholarships[application.scholarship_id];
                            setViewModalApp({
                              ...application,
                              scholarship_title: scholarship?.title || "N/A",
                              amount: scholarship?.amount || "N/A",
                              renewal_date: scholarship?.renewal_date || "N/A",
                            });
                          }}
                        >
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
                    <h6>Student Information</h6>
                    <p>
                      <strong>Name:</strong> {viewModalApp.student_name}
                    </p>
                    <p>
                      <strong>Institute:</strong> {viewModalApp.institute_name}
                    </p>
                    <p>
                      <strong>Course:</strong> {viewModalApp.course}
                    </p>
                    <p>
                      <strong>CGPA:</strong> {viewModalApp.cgpa}
                    </p>
                  </div>

                  <div className="col-md-6">
                    <h6>Additional Info</h6>
                    <p>
                      <strong>Scholarship:</strong>{" "}
                      {viewModalApp.scholarship_title}
                    </p>
                    <p>
                      <strong>12th Marks:</strong> {viewModalApp.percent_12th}%
                    </p>
                    <p>
                      <strong>Status:</strong> {viewModalApp.status}
                    </p>
                    <p>
                      <strong>Amount:</strong> {viewModalApp.amount}
                    </p>
                    <p>
                      <strong>Renewal Date:</strong> {formatDate(viewModalApp.renewal_date)}
                    </p>
                  </div>
                </div>

                <hr />

                <h6>Documents</h6>
                <div className="d-flex gap-2 flex-wrap">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() =>
                      viewDocument(
                        viewModalApp.id_card,
                        "ID Card",
                        `v-idCard-${viewModalApp.application_id}`
                      )
                    }
                  >
                    <i className="fas fa-id-card me-1"></i> ID Card
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
                  >
                    <i className="fas fa-file-alt me-1"></i> Semester Marksheet
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
                  >
                    <i className="fas fa-graduation-cap me-1"></i> 12th
                    Marksheet
                  </button>
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
