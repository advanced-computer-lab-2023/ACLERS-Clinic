const ApplicantDetails = ({ applicant }) => {
  return (
    <div className="applicantdetails">
      <h2>{applicant.username}</h2>
      <p>{applicant.name}</p>
      <p>{applicant.email}</p>
      <p>{applicant.password}</p>
      <p>{applicant.dateOfBirth}</p>
      <p>{applicant.hourlyRate}</p>
      <p>{applicant.affiliation}</p>
      <p>{applicant.educationalBackground}</p>
      <p>{applicant.status}</p>
    </div>
  );
};

export default ApplicantDetails;
