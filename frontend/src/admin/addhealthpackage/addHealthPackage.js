// AddHealthPackage.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import jwt from "jsonwebtoken-promisified";

const AddHealthPackage = () => {
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const [Price, setPrice] = useState("");
  const [doctorDiscount, setDoctorDiscount] = useState("");
  const [medicineDiscount, setMedicineDiscount] = useState("");
  const [subscriptionDiscount, setSubscriptionDiscount] = useState("");
  const token = localStorage.getItem("token");
  const decodedtoken = jwt.decode(token);
  console.log("decoded Token:", decodedtoken);
  const id = decodedtoken.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const healthPackage = {
      type,
      Price,
      doctorDiscount,
      medicineDiscount,
      subscriptionDiscount,
    };
    console.log(healthPackage);
    const response = await fetch("/admin/add-HealthPackage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(healthPackage),
    });
    const json = await response.json();
    if (response.ok) {
      setType("");
      setPrice("");
      setDoctorDiscount("");
      setMedicineDiscount("");
      setSubscriptionDiscount("");
      console.log(json);
    }
  };
  if (decodedtoken.role !== "admin") {
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
      <h2>Add Health Package</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={Price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div>
          <label>doctor discount:</label>
          <input
            type="number"
            name="doctorDiscount"
            value={doctorDiscount}
            onChange={(e) => setDoctorDiscount(e.target.value)}
          />
        </div>
        <div>
          <label>medicine discount:</label>
          <input
            type="number"
            name="medicineDiscount"
            value={medicineDiscount}
            onChange={(e) => setMedicineDiscount(e.target.value)}
          />
        </div>
        <div>
          <label>subscription discount:</label>
          <input
            type="number"
            name="subscriptionDiscount"
            value={subscriptionDiscount}
            onChange={(e) => setSubscriptionDiscount(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
    </div>
  );
};

export default AddHealthPackage;
