const DoctorDetails = ({ doctor }) => {
  const handleClick = async () => {
    console.log("el button etdas");
    console.log(doctor._id);

    const url = `/admin/remove-doctor?doctorId=${doctor._id}`;
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
        <h2>{doctor.username}</h2>
        <p>{doctor.password}</p>
        <button onClick={handleClick}>delete</button>
      </div>
    </>
  );
};

export default DoctorDetails;
