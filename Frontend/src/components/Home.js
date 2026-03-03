import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/scholarship-hero.png"; // Add a hero image here

export default function Home(props) {
  useEffect(() => {
    if (props.loadingRef?.current) {
      props.loadingRef.current.continuousStart();
      setTimeout(() => {
        props.loadingRef.current.complete();
      }, 10);
    }
  }, [props.loadingRef]);

  return (
    <div style={{ paddingTop: "125px" }}>
      {/* Hero Section */}
      <section className="container my-5">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h1 className="text-gradient-red fw-bold">
              Simplifying Scholarships for Students
            </h1>
            <p className="mb-4 text-muted">
              Our Institute Online Scholarship Handling System helps students explore scholarship schemes, check eligibility, and apply seamlessly. Transparency, efficiency, and accessibility—all in one platform.
            </p>
            <Link to="/schemes" className="btn btn-gradient-red py-2 px-4">
              Explore Scholarships
            </Link>
          </div>
          <div className="col-lg-6 text-center">
            <img
              src={heroImg}
              alt="Scholarship Hero"
              className="img-fluid"
              style={{ maxHeight: "350px" }}
            />
          </div>
        </div>
      </section>

      {/* Features / Steps Section */}
      <section className="container my-5">
        <h2 className="text-center text-gradient-red mb-5 fw-bold">
          How It Works
        </h2>
        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm h-100 p-3">
              <div className="mb-3">
                <i className="bi bi-person-plus-fill fs-1 text-gradient-red"></i>
              </div>
              <h5 className="fw-bold">Register / Login</h5>
              <p className="text-muted">
                Students register with their institute ID or roll number and create a secure account.
              </p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm h-100 p-3">
              <div className="mb-3">
                <i className="bi bi-file-earmark-text-fill fs-1 text-gradient-red"></i>
              </div>
              <h5 className="fw-bold">Apply for Scholarships</h5>
              <p className="text-muted">
                Browse through available schemes, check eligibility, and submit applications online.
              </p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm h-100 p-3">
              <div className="mb-3">
                <i className="bi bi-check-circle-fill fs-1 text-gradient-red"></i>
              </div>
              <h5 className="fw-bold">Verification & Approval</h5>
              <p className="text-muted">
                Authority verifies documents, and admin approves scholarships for eligible students.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Schemes Section */}
      <section className="container my-5">
        <h2 className="text-center text-gradient-red mb-5 fw-bold">
          Featured Scholarships
        </h2>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm h-100 p-3">
              <h5 className="fw-bold">Merit-Based Scholarship</h5>
              <p className="text-muted">
                For students with excellent academic performance. Amount up to ₹50000.
              </p>
              <Link to="/schemes" className="btn btn-outline-danger">
                Apply Now
              </Link>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm h-100 p-3">
              <h5 className="fw-bold">Need-Based Scholarship</h5>
              <p className="text-muted">
                Financial assistance for students in need. Amount varies.
              </p>
              <Link to="/schemes" className="btn btn-outline-danger">
                Apply Now
              </Link>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm h-100 p-3">
              <h5 className="fw-bold">Organization Sponsored</h5>
              <p className="text-muted">
                Scholarships provided by partner organizations and institutions.
              </p>
              <Link to="/schemes" className="btn btn-outline-danger">
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container my-5 text-center">
        <h2 className="text-gradient-red fw-bold mb-4">Need Help?</h2>
        <p className="text-muted mb-4">
          Contact our support team for any assistance with scholarships or applications.
        </p>
        <p className="fw-bold">Email: support@nitsikkim.edu.in | Phone: +91 12345 67890</p>
      </section>
    </div>
  );
}
