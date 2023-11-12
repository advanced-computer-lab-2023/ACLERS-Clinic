import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ForgotPassword.css";
import jwt from "jsonwebtoken-promisified";
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const token = localStorage.getItem("token");
  const decodedToken = jwt.decode(token);
  console.log("decoded Token:", decodedToken);
  const handleSendOtp = async() => {
    // Simulate sending OTP logic here
    // You can implement the email OTP sending functionality
    // This is just a placeholder to demonstrate the flow
    const response = await fetch("http://localhost:8000/auth/sendOTPEmail", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
       
       email
      }),
    });
    if(response.ok){
      alert("OTP is sent")
      setIsOtpSent(true);
    }else{
      alert("Failed to send OTP")
    }


    
  };

  const handleResetPassword = async() => {
    // Reset the password using the OTP and the new password
    // You can implement the password reset logic here
    // This is just a placeholder to demonstrate the flow
    const response = await fetch("http://localhost:8000/auth/resetPassword", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
       
       email,otp,newPassword
      }),
    });
    if(response.ok){
      alert("Password reseted successfully")
      setIsPasswordReset(true);
    }else{
      alert("Failed to reset password")
    }
    
   
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 mx-auto mt-5">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Forgot Password</h5>
              {isOtpSent ? (
                <>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <button
                    className="btn btn-primary btn-block"
                    onClick={handleResetPassword}
                  >
                    Reset Password
                  </button>
                </>
              ) : (
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    className="btn btn-primary btn-block"
                    onClick={handleSendOtp}
                  >
                    Send OTP
                  </button>
                </div>
              )}
              {isPasswordReset && (
                <div className="alert alert-success" role="alert">
                  Password has been reset successfully.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
