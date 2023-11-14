import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import jwt from "jsonwebtoken-promisified";

function AddFamilyMember() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decodedtoken = jwt.decode(token);
  console.log("decoded Token:", decodedtoken);
  const id = decodedtoken.id;

  const [formData, setFormData] = useState({
    name: "",
    nationalId: "",
    age: "",
    gender: "Male",
    relationToPatient: "wife",
  });

  const [linkFormData, setLinkFormData] = useState({
    email: "",
    mobileNumber: "",
    relation: "wife",
  });

  const [familyMembers, setFamilyMembers] = useState([]);
  const [showFamilyMembers, setShowFamilyMembers] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLinkChange = (e) => {
    const { name, value } = e.target;
    setLinkFormData({
      ...linkFormData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...formData,
      }),
    };

    fetch(
      `http://localhost:8000/Patient-home/add-family-member?patientId=${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Family member added:", data);
        // Reset the form fields
        setFormData({
          name: "",
          nationalId: "",
          age: "",
          gender: "Male",
          relationToPatient: "wife",
        });
      })
      .catch((error) => {
        console.error("Error adding family member:", error);
      });
  };

  const handleLinkSubmit = (e) => {
    e.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...linkFormData,
      }),
    };
    console.log("linkFormData:", linkFormData);
    fetch(
      `http://localhost:8000/Patient-home/link-fam-member?patientId=${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Family member linked:", data);
        // Reset the form fields
        setLinkFormData({
          email: "",
          mobileNumber: "",
          relation: "wife",
        });
      })
      .catch((error) => {
        console.error("Error linking family member:", error);
      });
  };

  const handleViewFamilyMembers = () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    fetch(
      `http://localhost:8000/Patient-home/view-fam-member?patientId=${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.familyMembers && Array.isArray(data.familyMembers)) {
          // Update the state variable to show family members
          setFamilyMembers(data.familyMembers);
          setShowFamilyMembers(true);
        } else {
          console.error("Error: Family members response is not an array", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching family members:", error);
      });
  };
  if (!token) {
    // Handle the case where id is not available
    return <div>ACCESS DENIED, You are not authenticated, please log in</div>;
  }
  if (decodedtoken.role !== "patient") {
    return (
      <div>
        <div>ACCESS DENIED, You are not authenticated, please log in</div>
        <Link to="/login">Login</Link>
      </div>
    );
  }
  return (
    <div>
      <button onClick={() => navigate(-1)}>Go Back</button>

      <h2>Add Family Member</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="nationalId">National ID:</label>
          <input
            type="text"
            id="nationalId"
            name="nationalId"
            value={formData.nationalId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="relationToPatient">Relation to Patient:</label>
          <select
            id="relationToPatient"
            name="relationToPatient"
            value={formData.relationToPatient}
            onChange={handleChange}
          >
            <option value="wife">Wife</option>
            <option value="husband">Husband</option>
            <option value="children">Children</option>
          </select>
        </div>
        <button type="submit">Add Family Member</button>
      </form>

      <h2>Link Family Member</h2>
      <form onSubmit={handleLinkSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={linkFormData.email}
            onChange={handleLinkChange}
            required
          />
        </div>
        <div>
          <label htmlFor="mobileNumber">Phone Number:</label>
          <input
            type="tel"
            id="mobileNumber"
            name="mobileNumber"
            value={linkFormData.mobileNumber}
            onChange={handleLinkChange}
            required
          />
        </div>
        <div>
          <label htmlFor="relation">Relation to Patient:</label>
          <select
            id="relation"
            name="relation"
            value={linkFormData.relation}
            onChange={handleLinkChange}
          >
            <option value="wife">Wife</option>
            <option value="husband">Husband</option>
            <option value="children">Children</option>
          </select>
        </div>
        <button type="submit">Link Family Member</button>
      </form>

      <div style={{ marginTop: "50px" }}>
        <button onClick={handleViewFamilyMembers}>View Family Members</button>
      </div>

      {showFamilyMembers && (
        <div>
          <h3>Family Members:</h3>
          <ul>
            {familyMembers.map((familyMember) => (
              <div>
                <li key={familyMember._id}>{familyMember.name}</li>
                <li>{familyMember.nationalId}</li>
                <li>{familyMember.age}</li>
                <li>{familyMember.relationToPatient}</li>
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AddFamilyMember;
