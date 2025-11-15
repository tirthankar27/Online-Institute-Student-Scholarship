import React, { useState, useEffect, useCallback } from "react";

export default function ManageApplications(props) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [reviewComment, setReviewComment] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loadingDocuments, setLoadingDocuments] = useState({});

  const fetchApplicationsForReview = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(props.applications, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        setApplications(data || []);
      } else {
        setError(data.message || "Failed to fetch applications");
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [props.applications]);

  const updateApplicationStatus = async (
    applicationId,
    status,
    comment = "",
    authstatus,
    adminstatus
  ) => {
    try {
      // Determine the verification flags based on the status
      let byAuthority = null;
      let byAdmin = null;
      console.log(status);

      if (status === "Approved by Authority") {
        byAuthority = true;
      } else if (status === "Rejected by Authority") {
        byAuthority = false;
      }
      if (status === "Approved by Admin") {
        byAdmin = true;
      } else if (status === "Rejected by Admin") {
        byAdmin = false;
      }
      console.log(authstatus);
      console.log(adminstatus);
      if (authstatus) {
        const response = await fetch(`${props.update}/${applicationId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: status,
            byAuthority: authstatus,
            byAdmin: byAdmin,
            review_comment: comment,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setApplications((prev) =>
            prev.filter((app) => app.application_id !== applicationId)
          );
          setSelectedApplication(null);
          setReviewComment("");
          alert(`Application ${status} successfully`);
          fetchApplicationsForReview();
        } else {
          alert(data.message || "Failed to update application");
        }
      }
      const app = applications.find((a) => a.application_id === applicationId);
      const res = await fetch(props.getendpoint);
      let data = await res.json();
      data = data.data;
      console.log(data);
      const scholarship = data.find(
        (s) => s.scholarship_id === app.scholarship_id
      );
      const amount = scholarship.amount;
      if (byAdmin) {
        const response = await fetch(`${props.approved}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            application_id: applicationId,
            scholarship_id: app.scholarship_id,
            user_id: app.user_id,
            name: app.student_name,
            institute: app.institute_name,
            amount: amount,
          }),
        });

        const data = await response.json();
        console.log(data);
      }
    } catch (err) {
      console.error("Error updating application:", err);
      alert("Network error. Please try again.");
    }
  };

  const getFilteredApplications = () => {
    if (filterStatus === "all") return applications;
    return applications.filter((app) => app.status === filterStatus);
  };

  const viewDocument = async (filePath, documentType, buttonKey) => {
    if (!filePath) {
      alert(`${documentType} not available`);
      return;
    }

    try {
      // Set loading state
      setLoadingDocuments((prev) => ({ ...prev, [buttonKey]: true }));

      // Your file viewing logic here
      const fileURL = `${process.env.REACT_APP_BACKEND_URL}/${filePath}`;
      window.open(fileURL, "_blank");
    } catch (error) {
      console.error(`Error viewing ${documentType}:`, error);
      alert(`Unable to load ${documentType}. Please try again later.`);
    } finally {
      // Clear loading state
      setLoadingDocuments((prev) => ({ ...prev, [buttonKey]: false }));
    }
  };

  // Function to view document links in table
  const viewDocumentInTable = (filePath, documentType) => {
    if (!filePath) {
      alert(`${documentType} not available`);
      return;
    }

    try {
      const fileURL = `${process.env.REACT_APP_BACKEND_URL}/${filePath}`;
      window.open(fileURL, "_blank");
    } catch (error) {
      console.error(`Error viewing ${documentType}:`, error);
      alert(`Unable to load ${documentType}. Please try again later.`);
    }
  };

  useEffect(() => {
    fetchApplicationsForReview();
  }, [fetchApplicationsForReview]);

  const ApplicationDetailsModal = ({
    application,
    onClose,
    onApprove,
    onReject,
  }) => {
    if (!application) return null;

    return (
      <div
        className="modal fade show d-block"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                Review Application - #{application.application_id}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6">
                  <h6>Personal Information</h6>
                  <p>
                    <strong>Name:</strong> {application.student_name}
                  </p>
                  <p>
                    <strong>Father's Name:</strong> {application.father_name}
                  </p>
                  <p>
                    <strong>Mother's Name:</strong> {application.mother_name}
                  </p>
                  <p>
                    <strong>Date of Birth:</strong>{" "}
                    {formatDate(application.dob)}
                  </p>
                  <p>
                    <strong>Email:</strong> {application.email}
                  </p>
                </div>
                <div className="col-md-6">
                  <h6>Academic Information</h6>
                  <p>
                    <strong>Institute:</strong> {application.institute_name}
                  </p>
                  <p>
                    <strong>Roll Number:</strong> {application.roll}
                  </p>
                  <p>
                    <strong>Course:</strong> {application.course}
                  </p>
                  <p>
                    <strong>CGPA:</strong> {application.cgpa}
                  </p>
                  <p>
                    <strong>12th Marks:</strong> {application.percent_12th}%
                  </p>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-12">
                  <h6>Documents</h6>
                  <div className="d-flex gap-2 flex-wrap">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() =>
                        viewDocument(
                          application.id_card,
                          "ID Card",
                          `idCard-${application.application_id}`
                        )
                      }
                      disabled={
                        !application.id_card ||
                        loadingDocuments[`idCard-${application.application_id}`]
                      }
                    >
                      {loadingDocuments[
                        `idCard-${application.application_id}`
                      ] ? (
                        <>
                          <i className="fas fa-spinner fa-spin me-1"></i>
                          Loading...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-id-card me-1"></i>
                          View ID Card
                        </>
                      )}
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() =>
                        viewDocument(
                          application.recent_sem_marksheet,
                          "Semester Marksheet",
                          `semMarksheet-${application.application_id}`
                        )
                      }
                      disabled={
                        !application.recent_sem_marksheet ||
                        loadingDocuments[
                          `semMarksheet-${application.application_id}`
                        ]
                      }
                    >
                      {loadingDocuments[
                        `semMarksheet-${application.application_id}`
                      ] ? (
                        <>
                          <i className="fas fa-spinner fa-spin me-1"></i>
                          Loading...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-file-alt me-1"></i>
                          View Semester Marksheet
                        </>
                      )}
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() =>
                        viewDocument(
                          application.marksheet_12th,
                          "12th Marksheet",
                          `marksheet12-${application.application_id}`
                        )
                      }
                      disabled={
                        !application.marksheet_12th ||
                        loadingDocuments[
                          `marksheet12-${application.application_id}`
                        ]
                      }
                    >
                      {loadingDocuments[
                        `marksheet12-${application.application_id}`
                      ] ? (
                        <>
                          <i className="fas fa-spinner fa-spin me-1"></i>
                          Loading...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-graduation-cap me-1"></i>
                          View 12th Marksheet
                        </>
                      )}
                    </button>
                    {application.category_certificate && (
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() =>
                          viewDocument(
                            application.category_certificate,
                            "Category Certificate",
                            `categoryCert-${application.application_id}`
                          )
                        }
                        disabled={
                          !application.category_certificate ||
                          loadingDocuments[
                            `categoryCert-${application.application_id}`
                          ]
                        }
                      >
                        {loadingDocuments[
                          `categoryCert-${application.application_id}`
                        ] ? (
                          <>
                            <i className="fas fa-spinner fa-spin me-1"></i>
                            Loading...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-certificate me-1"></i>
                            View Category Certificate
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-12">
                  <h6>Review Comment</h6>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Enter your review comments..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-success"
                onClick={() =>
                  onApprove(
                    application.application_id,
                    reviewComment,
                    application.verified_by_authority,
                    application.verified_by_admin
                  )
                }
              >
                <i className="fas fa-check me-2"></i>
                Approve
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() =>
                  onReject(
                    application.application_id,
                    reviewComment,
                    application.verified_by_authority,
                    application.verified_by_admin
                  )
                }
              >
                <i className="fas fa-times me-2"></i>
                Reject
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mt-4" style={{ paddingTop: "80px" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading applications for review...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4" style={{ paddingTop: "120px" }}>
      <div className="card shadow">
        <div className="card-header bg-warning text-dark">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="mb-0">Admin Review Panel</h3>
              <p className="mb-0">
                Pending Applications: {applications.length}
              </p>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ width: "auto" }}
              >
                <option value="all">All Applications</option>
                <option value="Under Authority Verification">
                  Pending Review
                </option>
                <option value="Approved by Authority">Approved</option>
                <option value="Rejected by Authority">Rejected</option>
              </select>
              <button
                className="btn btn-outline-dark"
                onClick={fetchApplicationsForReview}
              >
                <i className="fas fa-sync-alt"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          {error && (
            <div className="alert alert-danger m-3" role="alert">
              {error}
            </div>
          )}

          {getFilteredApplications().length === 0 ? (
            <div className="text-center py-4">
              <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
              <h5>No Applications to Review</h5>
              <p className="text-muted">All applications have been reviewed.</p>
            </div>
          ) : (
            <div className="table-responsive" style={{ maxHeight: "70vh" }}>
              <table className="table table-hover mb-0">
                <thead className="table-light sticky-top">
                  <tr>
                    <th>Application ID</th>
                    <th>Student Name</th>
                    <th>Father Name</th>
                    <th>Mother Name</th>
                    <th>Roll number</th>
                    <th>Institute</th>
                    <th>Course</th>
                    <th>CGPA</th>
                    <th>12th %</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredApplications().map((application) => (
                    <tr key={application.application_id}>
                      <td>
                        <strong>#{application.application_id}</strong>
                      </td>
                      <td>{application.student_name}</td>
                      <td>{application.father_name}</td>
                      <td>{application.mother_name}</td>
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
                      <td>
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setSelectedApplication(application)}
                          >
                            <i className="fas fa-eye me-1"></i>
                            Review
                          </button>
                          {application.status ===
                            "Under Authority Verification" && (
                            <>
                              <button
                                className="btn btn-sm btn-outline-success"
                                onClick={() =>
                                  updateApplicationStatus(
                                    application.application_id,
                                    "Approved by Authority",
                                    application.verified_by_authority,
                                    application.verified_by_admin
                                  )
                                }
                              >
                                <i className="fas fa-check"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() =>
                                  updateApplicationStatus(
                                    application.application_id,
                                    "Rejected by Authority",
                                    application.verified_by_authority,
                                    application.verified_by_admin
                                  )
                                }
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedApplication && (
        <ApplicationDetailsModal
          application={selectedApplication}
          onClose={() => {
            setSelectedApplication(null);
            setReviewComment("");
          }}
          onApprove={(appId, comment, authstatus, adminstatus) =>
            updateApplicationStatus(
              appId,
              "Approved by Admin",
              comment,
              authstatus,
              adminstatus
            )
          }
          onReject={(appId, comment, authstatus, adminstatus) =>
            updateApplicationStatus(
              appId,
              "Rejected by Admin",
              comment,
              authstatus,
              adminstatus
            )
          }
        />
      )}
    </div>
  );
}

// Helper functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusBadge = (status) => {
  const statusConfig = {
    Pending: {
      class: "bg-warning text-dark",
      text: "Under Verification of Authority",
    },
    "Approved by Authority": {
      class: "bg-success text-white",
      text: "Authority Approved",
    },
    "Rejected by Authority": {
      class: "bg-danger text-white",
      text: "Authority Rejected",
    },
    "Approved by Admin": {
      class: "bg-info text-white",
      text: "Admin Approved",
    },
    "Rejected by Admin": {
      class: "bg-danger text-white",
      text: "Admin Rejected",
    },
  };

  const config = statusConfig[status] || {
    class: "bg-secondary text-white",
    text: status,
  };
  return <span className={`badge ${config.class}`}>{config.text}</span>;
};
