const DoctorDetails = ({ doctor }) => {
  const handleClick = async () => {
    console.log("el button etdas");
    console.log(doctor._id);

    const url = `/admin/remove-doctor?id=${doctor._id}`;
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (response.ok) {
      const json = await response.json();
      console.log(json);
    }
  };

  return (
    <>
      <div className="doctordetails">
        <h2>Username: {doctor.username}</h2>
        <p>Name: {doctor.name}</p>
        <p>Email: {doctor.email}</p>
        <p>Date of Birth: {doctor.dateOfBirth}</p>
        <p>Hourly Rate: {doctor.hourlyRate}</p>
        <p>Affiliation: {doctor.affiliation}</p>
        <p>Educational Background: {doctor.educationalBackground}</p>
        <button onClick={handleClick}>delete</button>
      </div>
    </>
  );
};

export default DoctorDetails;
