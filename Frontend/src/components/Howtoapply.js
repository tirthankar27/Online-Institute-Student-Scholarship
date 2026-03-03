import React from "react";

function HowToApply() {
  return (
    <div className="container" style={{paddingTop: "125px"}}>
      <h2 className="mb-4 text-center">How to Apply for Scholarship</h2>

      <p className="lead text-center">
        Follow these simple steps to apply for the scholarship through our online portal.
      </p>

      <div className="row mt-5">
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <h4 className="card-title">Step 1</h4>
              <p className="card-text">
                Register on the scholarship portal using your institute credentials.  
                Make sure to verify your email address.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <h4 className="card-title">Step 2</h4>
              <p className="card-text">
                Fill in your personal, academic, and bank details accurately.  
                Upload all required documents in PDF or JPG format.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <h4 className="card-title">Step 3</h4>
              <p className="card-text">
                Submit the application and note down the application ID.  
                You can track your status in the “My Applications” section.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="alert alert-info mt-4" role="alert">
        <strong>Note:</strong> Ensure you submit before the deadline. Late submissions will not be accepted.
      </div>
    </div>
  );
}

export default HowToApply;