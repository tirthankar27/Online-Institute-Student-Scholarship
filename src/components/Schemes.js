import React from "react";

export default function Schemes() {
  const schemes = [
    {
      id: 1,
      title: "Merit-Based Scholarship",
      description: "Awarded to students with outstanding academic performance in the previous academic year.",
      eligibility: "Minimum 85% marks in last exam",
      deadline: "31st August 2025"
    },
    {
      id: 2,
      title: "Need-Based Financial Aid",
      description: "For students from economically weaker sections to support their tuition and living expenses.",
      eligibility: "Annual family income below ₹2,50,000",
      deadline: "15th September 2025"
    },
    {
      id: 3,
      title: "Sports Excellence Award",
      description: "Scholarship for students excelling in state/national-level sports events.",
      eligibility: "Participation in state/national level sports",
      deadline: "10th October 2025"
    },
    {
      id: 4,
      "title": "Prime Minister’s Scholarship for Economically Weaker Sections",
      "description": "A scholarship program aimed at providing financial assistance to students from economically weaker backgrounds to support their higher education.",
      "eligibility": "Open to students belonging to economically weaker sections (EWS) who meet the prescribed income criteria.",
      "deadline": "31st October 2025"
    },
    {
      id: 5,
      "title": "Central Sector Scheme of Scholarship (CSSS)",
      "description": "Scholarships for college and university students from low-income families to promote higher education.",
      "eligibility": "Class 12 students in the top 20 percentile of their board with parental income less than ₹4.5 lakh per annum.",
      "deadline": "10th December 2025"
    },
    {
      id: 6,
      "title": "Post-Matric Scholarship for SC/ST/OBC Students",
      "description": "Financial aid to SC/ST/OBC students from weaker economic backgrounds pursuing post-matric studies.",
      "eligibility": "Students belonging to SC/ST/OBC categories with annual parental income below ₹2.5 lakh (SC/ST) or ₹1.5 lakh (OBC).",
      "deadline": "15th September 2025"
    },
    {
      id: 7,
      "title": "Maulana Azad National Scholarship",
      "description": "Scholarship for meritorious students from minority communities to encourage them in pursuing higher studies.",
      "eligibility": "Minority community students with annual family income below ₹2 lakh who have secured at least 50% in the previous exam.",
      "deadline": "31st August 2025"
    }
  ];

  return (
    <div className="container" style={{ paddingTop: "125px" }}>
      <h2 className="mb-4 text-center">Available Scholarship Schemes</h2>
      <div className="row">
        {schemes.map((scheme) => (
          <div className="col-md-4 mb-4" key={scheme.id}>
            <div className="card shadow-sm h-100 border-0">
              <div className="card-body">
                <h5 className="card-title text-danger fw-bold">{scheme.title}</h5>
                <p className="card-text">{scheme.description}</p>
                <p><strong>Eligibility:</strong> {scheme.eligibility}</p>
                <p><strong>Deadline:</strong> {scheme.deadline}</p>
                <button className="btn btn-outline-danger w-100">
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
