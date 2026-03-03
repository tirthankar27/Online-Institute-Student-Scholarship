import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Applications(props) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------
  // FETCH ALL APPLICATIONS (Admin Only)
  // ---------------------------------------------
  useEffect(() => {
    if (!user || user.role !== "admin") {
      setMessage("Access denied: Admins only");
      setLoading(false);
      return;
    }

    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(props.getendpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok) {
          setApplications(data.applications || []);
        } else {
          setMessage(data.error || "Failed to fetch applications.");
        }
      } catch (err) {
        setMessage("Server error while fetching applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [props.getendpoint, user]);

  // ---------------------------------------------
  // UPDATE STATUS (Admin / Reviewer)
  // ---------------------------------------------
  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      const body = {
        status: newStatus,
        verified_by_authority: newStatus.includes("Authority"),
        verified_by_admin: newStatus.includes("Admin"),
      };

      const res = await fetch(`${props.updateendpoint}/${applicationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        setApplications((prev) =>
          prev.map((app) =>
            app[0] === applicationId ? { ...app, status: newStatus } : app
          )
        );
        setMessage("Status updated successfully");
      } else {
        setMessage(data.error || "Failed to update status");
      }
    } catch (err) {
      setMessage("Server error while updating status");
    }
  };

  // ---------------------------------------------
  // UI HELPERS
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

  const boolBadge = (bool) => (
    <span className={`badge ${bool ? "bg-success" : "bg-secondary"}`}>
      {bool ? "Yes" : "No"}
    </span>
  );

  // ---------------------------------------------
  // RENDER
  // ---------------------------------------------
  return (
    <div className="container py-5" style={{ marginTop: "80px" }}>
      <h2 className="fw-bold text-danger mb-4">All Applications</h2>

      {/* MESSAGE ALERT */}
      {message && (
        <div
          className={`alert ${
            message.includes("denied") || message.includes("error")
              ? "alert-danger"
              : "alert-success"
          }`}
        >
          {message}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
          <p>Loading applications...</p>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && applications.length === 0 && (
        <p className="text-muted">No applications found.</p>
      )}

      {/* APPLICATIONS TABLE */}
      {!loading && applications.length > 0 && (
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
              {applications.map((app, index) => {
                // ------------------------------------
                // MAP DATABASE TUPLE → READABLE VALUES
                // ------------------------------------
                const application_id = app[0];
                const student_name = app[2];
                const cgpa = app[7];
                const percent_12th = app[8];
                const verified_by_authority = app[12];
                const verified_by_admin = app[13];
                const status = app[14];
                const email = app[16];
                const roll = app[17];

                return (
                  <tr key={application_id}>
                    <td>{index + 1}</td>
                    <td>{student_name}</td>
                    <td>{email}</td>
                    <td>{roll}</td>
                    <td>{cgpa}</td>
                    <td>{percent_12th}</td>

                    <td>{getStatusBadge(status)}</td>
                    <td>{boolBadge(verified_by_authority)}</td>
                    <td>{boolBadge(verified_by_admin)}</td>

                    <td>
                      {/* VIEW DETAILS */}
                      <button
                        className="btn btn-primary btn-sm me-1"
                        onClick={() =>
                          navigate(`/application/${application_id}`)
                        }
                      >
                        View
                      </button>

                      {/* APPROVE */}
                      <button
                        className="btn btn-success btn-sm me-1"
                        onClick={() =>
                          handleStatusUpdate(
                            application_id,
                            "Approved by Admin"
                          )
                        }
                      >
                        Approve
                      </button>

                      {/* REJECT */}
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          handleStatusUpdate(
                            application_id,
                            "Rejected by Admin"
                          )
                        }
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
