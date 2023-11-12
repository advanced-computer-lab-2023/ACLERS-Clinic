import React, { useState } from 'react';
import jwt from "jsonwebtoken-promisified";
import { useParams, useNavigate } from "react-router-dom";
function PasswordChangeForm() {
  const [ID, setID] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const token = localStorage.getItem("token");
  const decodedToken = jwt.decode(token);
  console.log("decoded Token:", decodedToken);
  const patientId = decodedToken.id;
  const navigate = useNavigate();
  

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:8000/auth/change-password", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
         
          oldPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        // Password change successful
        const result = await response.json();
        alert("Password changed successfully")
        console.log('Password changed successfully:', result);
        // You might want to update your UI or perform additional actions here
      } else {
        // Handle errors here
        alert("Failed to change password")
        console.error('Failed to change password:', response.statusText);
        // You might want to display an error message to the user
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Error:', error);
    }
  };
  if (!token) {
    // Handle the case where id is not available
    return <div>ACCESS DENIED, You are not authenticated, please log in</div>;
  }
  return (
    <div>
         <button onClick={() => navigate(-1)}>Go Back</button>
      <form onSubmit={handleSubmit}>
        
        <div>
          <label>Old Password</label>
          <input
            type="password"
            placeholder="Enter your old password"
            value={oldPassword}
            onChange={handleOldPasswordChange}
          />
        </div>
        <div>
          <label>New Password</label>
          <input
            type="password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={handleNewPasswordChange}
          />
        </div>
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
}

export default PasswordChangeForm;