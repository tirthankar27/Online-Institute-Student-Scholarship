import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import supportImg from "../assets/support-hero.png"; // add a support-themed image

export default function Support(props) {
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
            <h1 className="text-gradient-red fw-bold">We’re Here to Help</h1>
            <p className="mb-4 text-muted">
              Have questions about scholarships, applications, or verification?
              Our support team is dedicated to assisting you at every step.
            </p>
            <a href="#contact-form" className="btn btn-gradient-red py-2 px-4">
              Contact Support
            </a>
          </div>
          <div className="col-lg-6 text-center">
            <img
              src={supportImg}
              alt="Support Hero"
              className="img-fluid"
              style={{ maxHeight: "200px" }}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container my-5">
        <h2 className="text-center text-gradient-red mb-5 fw-bold">
          Frequently Asked Questions
        </h2>
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm p-3 h-100">
              <h5 className="fw-bold">How do I apply for a scholarship?</h5>
              <p className="text-muted">
                You can browse all available schemes under the "Scholarships"
                section and click "Apply Now" to submit your application online.
              </p>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm p-3 h-100">
              <h5 className="fw-bold">
                What documents are required for verification?
              </h5>
              <p className="text-muted">
                Generally, academic transcripts, income certificates, and ID
                proofs are required. Specific requirements may vary per scheme.
              </p>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm p-3 h-100">
              <h5 className="fw-bold">How can I check my application status?</h5>
              <p className="text-muted">
                Login to your account and navigate to the "My Applications"
                section to track your status in real-time.
              </p>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm p-3 h-100">
              <h5 className="fw-bold">Who can I contact for technical issues?</h5>
              <p className="text-muted">
                Our support team is available via email and phone. You can also
                use the contact form below to reach us directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="container my-5">
        <h2 className="text-center text-gradient-red fw-bold mb-5">
          Contact Support
        </h2>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <form className="card shadow-sm p-4">
              <div className="mb-3">
                <label className="form-label fw-bold">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Message</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Describe your issue or query"
                  required
                ></textarea>
              </div>
              <div className="text-center">
                <button type="submit" className="btn btn-gradient-red px-5">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="container my-5 text-center">
        <h2 className="text-gradient-red fw-bold mb-4">Other Ways to Reach Us</h2>
        <p className="text-muted mb-4">
          You can also connect with our support team through the following
          channels:
        </p>
        <p className="fw-bold">
          Email: support@nitsikkim.edu.in | Phone: +91 12345 67890
        </p>
      </section>
    </div>
  );
}