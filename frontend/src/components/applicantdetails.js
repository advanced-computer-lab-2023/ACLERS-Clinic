// ApplicantDetails.js


const ApplicantDetails = ({ applicant }) => {
  const { affiliation, dateOfBirth, educationalBackground, email, hourlyRate, idDocument, medicalDegree, medicalLicense, name, speciality, status, username, __v, _id } = applicant;

  return (
    <div className="applicant-details">
      <h2>Applicant Details</h2>
      <p>Affiliation: {affiliation}</p>
      <p>Date of Birth: {dateOfBirth}</p>
      <p>Educational Background: {educationalBackground}</p>
      <p>Email: {email}</p>
      <p>Hourly Rate: {hourlyRate}</p>
      <p>Id</p>
      <img src={`http://localhost:8000/uploads/${idDocument.substring(8)}`} style={{ maxWidth: "50%", maxHeight: "50%", objectFit: "contain" }}  alt={idDocument}/>
      <p>Medical Degree</p>
      <img src={`http://localhost:8000/uploads/${medicalDegree.substring(8)}`} style={{ maxWidth: "50%", maxHeight: "50%", objectFit: "contain" }} alt={medicalDegree} />
      <p>Medical License</p>
      <img src={`http://localhost:8000/uploads/${medicalLicense.substring(8)}`} style={{ maxWidth: "50%", maxHeight: "50%", objectFit: "contain" }} alt={medicalLicense} />
      <p>Name: {name}</p>
      <p>Speciality: {speciality}</p>
      <p>Status: {status}</p>
      <p>Username: {username}</p>
     
    </div>
  );
};

export default ApplicantDetails;
