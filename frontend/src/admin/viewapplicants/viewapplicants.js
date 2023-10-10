import { useEffect, useState } from "react";
import ApplicantDetails from "../../components/applicantdetails.js";

const ViewApplicants = () => {
  const [applicants, setApplicants] = useState(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      const response = await fetch("/admin/view-applicants");
      const json = await response.json();

      if (response.ok) {
        setApplicants(json);
      }
    };
    fetchApplicants();
  }, []);
  return (
    <div className="applicantviewer">
      <h1>Applicants</h1>
      {applicants &&
        applicants.map((applicant) => (
          <ApplicantDetails key={applicant._id} applicant={applicant} />
        ))}
    </div>
  );
};

export default ViewApplicants;
