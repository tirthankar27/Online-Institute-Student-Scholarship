import React from "react";

export default function About() {
  return (
    <div className="container" style={{ paddingTop: "200px" }}>
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-header bg-danger text-white text-center fs-3 fw-bold rounded-top-4">
          About Us
        </div>
        <div className="card-body p-4">
          <p className="card-text text-secondary fs-5">
            Our Institute Online Scholarship Handling System is designed to
            simplify and digitalize the scholarship process for students. The
            platform provides a seamless way to explore available scholarship
            schemes, understand eligibility criteria, and apply directly through
            a secure portal.
          </p>
          <p className="card-text text-secondary fs-5">
            By eliminating paperwork and manual verification delays, the system
            ensures transparency, efficiency, and accessibility for all
            students. From registration to application submission and status
            tracking, every step is streamlined to save time and effort.
          </p>
          <p className="card-text text-secondary fs-5">
            The portal also allows administrators to manage applications,
            verify documents, and approve scholarships efficiently. With this
            initiative, we aim to support deserving students by ensuring
            financial assistance reaches them quickly and without hassle.
          </p>
        </div>
      </div>
    </div>
  );
}
