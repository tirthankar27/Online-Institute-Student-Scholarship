import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Schemes(props) {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await fetch(props.getendpoint);
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch scholarships");
          return;
        }

        setSchemes(data.data || []);
      } catch (err) {
        console.error(err);
        setError("Server not responding");
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, [props.getendpoint]);

  if (loading) {
    return <h3 className="text-center mt-5">Loading scholarships...</h3>;
  }

  if (error) {
    return <h3 className="text-center mt-5 text-danger">{error}</h3>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleApply = (id) => {
    navigate(`/apply/${id}`);
  };

  return (
    <div className="container" style={{ paddingTop: "200px" }}>
      <h2
        className="mb-4 text-center"
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 600,
          letterSpacing: "1px",
          color: "#d31a1aff",
          textTransform: "uppercase",
        }}
      >
        Available Scholarship Schemes
      </h2>

      <div className="row">
        {schemes.map((scheme) => (
          <div className="col-md-4 mb-4" key={scheme.scholarship_id}>
            <div className="card shadow-sm h-100 border-0">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-danger fw-bold">
                  {scheme.title}
                </h5>
                <p>
                  <strong>Organization:</strong> {scheme.organization}
                </p>
                <p className="card-text">
                  <strong>Description:</strong> {scheme.description}
                </p>
                <p>
                  <strong>Deadline:</strong> {formatDate(scheme.deadline)}
                </p>
                <button
                  className="btn btn-outline-danger w-100 mt-auto"
                  onClick={() => handleApply(scheme.scholarship_id)}
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
