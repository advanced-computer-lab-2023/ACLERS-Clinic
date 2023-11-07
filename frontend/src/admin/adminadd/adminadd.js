import React, { useState } from "react";
import "./adminadd.css";
import { useNavigate } from "react-router-dom";

function AdminAdd() {
  // Define state variables to store the username and password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()

  // Function to handle the form submission when the "Add Admin" button is clicked
  const handleAddAdmin = (event) => {
    event.preventDefault();

    console.log("Username:", username);
    console.log("Password:", password);

    const admin = { username, password };

    fetch("/admin/add-admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(admin),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        window.location.href = "/admin/Dashboard";
      })
      .catch((err) => {
        console.log(err);
      });

    setUsername("");
    setPassword("");
  };

  return (
    <div className="body">
       <button onClick={() => navigate(-1)}>Go Back</button>
      <h1>Add Admin</h1>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleAddAdmin}>Add Admin</button>
    </div>
  );
}

export default AdminAdd;
