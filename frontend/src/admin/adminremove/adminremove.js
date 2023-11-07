import React, { useState } from "react";
import "./adminremove.css";
import { useNavigate } from "react-router-dom";

function AdminRemove() {
  // Define state variable to store the user ID
  const [userId, setUserId] = useState("");
  const navigate = useNavigate()

  // Function to handle the "Remove User" button click
  const handleRemoveUser = () => {
    // You can add your logic here to remove the user based on the provided ID
    console.log("User ID to remove:", userId);

    // Clear the input field after submission
    setUserId("");
  };

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
