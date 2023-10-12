import React, { useState } from "react";

function AddFamilyMember() {
  const [formData, setFormData] = useState({
    name: "",
    nationalId: "",
    age: "",
    gender: "Male",
    relationToPatient: "wife",
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const patientId = "651f32fffa0441d0e58c0704";

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
      }),
    };

    fetch(
      `http://localhost:8000/Patient-home/add-family-member?patientId=${patientId}`,
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

  const handleViewFamilyMembers = () => {
    const patientId = "651f32fffa0441d0e58c0704"; // Replace with the actual patient ID

    fetch(
      `http://localhost:8000/Patient-home/view-fam-member?patientId=${patientId}`
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

  return (
    <div>
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

      <div style={{ marginTop: "50px" }}>
        <button onClick={handleViewFamilyMembers}>View Family Members</button>
      </div>

      {showFamilyMembers && (
        <div>
          <h3>Family Members:</h3>
          <ul>
            {familyMembers.map((familyMember) => (
              <li key={familyMember._id}>{familyMember.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AddFamilyMember;
