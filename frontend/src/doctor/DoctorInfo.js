import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jwt from "jsonwebtoken-promisified";

const DoctorInfo = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({
    // Initialize with empty values for the doctor's info fields
    email: "",
    hourlyRate: 0,
    affiliation: "",
    // Add more fields as needed
  });
  const token = localStorage.getItem("token");
  const decodedtoken = jwt.decode(token);
  console.log("decoded Token:", decodedtoken);
  const id = decodedtoken.id;

  // Fetch doctor information based on the ID when the component mounts
  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    fetch(`http://localhost:8000/Doctor-Home`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setDoctor(data);
        // Initialize the editedInfo state with the fetched data
        setEditedInfo({ ...data });
      })
      .catch((error) => {
        console.error("Error fetching doctor info:", error);
      });
  }, [id]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveClick = async () => {
    // Perform the API call to update the doctor's information here

    const response = await fetch(
      `http://localhost:8000/Doctor-Home/editDocEmail?doctorID=${id}`,
      {
        method: "PUT", // Use the appropriate HTTP method (e.g., PUT or POST)
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedInfo),
      }
    );

    if (response.ok) {
      setIsEditing(false);
      // Optionally, update the doctor state with the new data
      setDoctor({ ...doctor, ...editedInfo });
    } else {
      console.error("Failed to update doctor information");
    }
  };
  if (!token) {
    // Handle the case where id is not available
    return <div>ACCESS DENIED, You are not authenticated, please log in</div>;
  }
  return (
    <div>
      <button onClick={() => navigate(-1)}>Go Back</button>

      <h1>Doctor Information</h1>
      {doctor ? (
        <div>
          {isEditing ? (
            <div>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={editedInfo.email}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Hourly Rate:
                <input
                  type="number"
                  name="hourlyRate"
                  value={editedInfo.hourlyRate}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Affiliation:
                <input
                  type="text"
                  name="affiliation"
                  value={editedInfo.affiliation}
                  onChange={handleInputChange}
                />
              </label>
              <button onClick={handleSaveClick}>Save</button>
            </div>
          ) : (
            <div>
              <p>Name: {doctor.name}</p>
              <p>Username: {doctor.username}</p>
              <p>Email: {doctor.email}</p>
              <p>Educational Background: {doctor.educationalBackground}</p>
              <p>Hourly Rate: {doctor.hourlyRate}</p>
              <p>Affiliation: {doctor.affiliation}</p>
              <button onClick={handleEditClick}>Edit</button>
            </div>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default DoctorInfo;
