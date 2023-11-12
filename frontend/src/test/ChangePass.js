import React, { useState } from 'react';
import './ChangePass.css';

function PasswordChangeForm() {
  const [ID, setID] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleID = (e) => {
    setID(e.target.value);
  };

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
        },
        body: JSON.stringify({
          ID,
          oldPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        // Password change successful
        const result = await response.json();
        console.log('Password changed successfully:', result);
        // You might want to update your UI or perform additional actions here
      } else {
        // Handle errors here
        console.error('Failed to change password:', response.statusText);
        // You might want to display an error message to the user
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID</label>
          <input
            type="id"
            placeholder="Enter your ID"
            value={ID}
            onChange={handleID}
          />
        </div>
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
