import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Applications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_BASE_URL;

  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------
  // FETCH ALL APPLICATIONS
  // ---------------------------------------------
  useEffect(() => {
    if (!user || user.designation !== "admin") {
      setMessage("Access denied: Admins only");
      setLoading(false);
      return;
    }

    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${API}/applications/applications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (res.ok) {
          setApplications(data.data || []);
        } else {
          setMessage(data.message || "Failed to fetch applications.");
        }
      } catch (err) {
        setMessage("Server error while fetching applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [API, user]);

  // ---------------------------------------------
  // UPDATE STATUS
  // ---------------------------------------------
  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API}/applications/verify/${applicationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setApplications((prev) =>
          prev.map((app) =>
            app.application_id === applicationId
              ? { ...app, status: newStatus }
              : app
          )
        );
        setMessage("Status updated successfully");
      } else {
        setMessage(data.message || "Failed to update status");
      }
    } catch (err) {
      setMessage("Server error while updating status");
    }
  };

  // ---------------------------------------------
  // STATUS BADGE
  // ---------------------------------------------
  const getStatusBadge = (status) => {
    const colors = {
      Pending: "bg-warning",
      "Approved by Authority": "bg-info",
      "Rejected by Authority": "bg-danger",
      "Approved by Admin": "bg-success",
      "Rejected by Admin": "bg-dark",
    };

    return (
      <span className={`badge ${colors[status] || "bg-secondary"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="container py-5" style={{ marginTop: "80px" }}>
      <h2 className="fw-bold text-danger mb-4">
        All Applications
      </h2>

      {message && (
        <div
          className={`alert ${
            message.includes("denied") ||
            message.includes("error")
              ? "alert-danger"
              : "alert-success"
          }`}
        >
          {message}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      ) : applications.length === 0 ? (
        <p className="text-muted">
          No applications found.
        </p>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Email</th>
                <th>Roll</th>
                <th>CGPA</th>
                <th>12th (%)</th>
                <th>Status</th>
                <th>Authority</th>
                <th>Admin</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((app, index) => (
                <tr key={app.application_id}>
                  <td>{index + 1}</td>
                  <td>{app.student_name}</td>
                  <td>{app.email}</td>
                  <td>{app.roll}</td>
                  <td>{app.cgpa}</td>
                  <td>{app.percent_12th}</td>
                  <td>{getStatusBadge(app.status)}</td>
                  <td>
                    {app.verified_by_authority ? "Yes" : "No"}
                  </td>
                  <td>
                    {app.verified_by_admin ? "Yes" : "No"}
                  </td>
                  <td>
                    <button
                      className="btn btn-success btn-sm me-1"
                      onClick={() =>
                        handleStatusUpdate(
                          app.application_id,
                          "Approved by Admin"
                        )
                      }
                    >
                      Approve
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        handleStatusUpdate(
                          app.application_id,
                          "Rejected by Admin"
                        )
                      }
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}