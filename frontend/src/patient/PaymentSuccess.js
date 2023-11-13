import React from "react";

const PaymentSuccessPage = () => {
  const handleGoToDashboard = () => {
    // Change window location to the dashboard URL
    window.location.href = "/patient/dashboard";
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Payment Successful!</h1>
      <p>Your payment has been processed successfully.</p>
      <button onClick={handleGoToDashboard}>Go Back to the Dashboard</button>
    </div>
  );
};

export default PaymentSuccessPage;
