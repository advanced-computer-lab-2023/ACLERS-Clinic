import React, { useState } from "react";
import "./adminremove.css";
import jwt from "jsonwebtoken-promisified";
import { Link, useNavigate } from "react-router-dom";

function AdminRemove() {
  // Define state variable to store the user ID
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decodedtoken = jwt.decode(token);
  console.log("decoded Token:", decodedtoken);
  const id = decodedtoken.id;
  // Function to handle the "Remove User" button click
  const handleRemoveUser = () => {
    // You can add your logic here to remove the user based on the provided ID
    console.log("User ID to remove:", userId);

    // Clear the input field after submission
    setUserId("");
  };
  if (!token ) {
    // Handle the case where id is not available
    return <div>ACCESS DENIED, You are not authenticated, please log in</div>;
  }
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
      <h1>Remove User</h1>
      <div>
        <label htmlFor="userId">User ID:</label>
        <input
          type="text"
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>
      <button onClick={handleRemoveUser}>Remove User</button>
    </div>
  );
}

export default AdminRemove;
