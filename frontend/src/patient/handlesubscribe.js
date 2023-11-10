import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const navigate = useNavigate();

  const handlePaymentSelection = (paymentMethod) => {
    // Add logic to handle the selected payment method (e.g., navigate to the next step)
    console.log(`Selected payment method: ${paymentMethod}`);
  };

  return (
    <div>
      <div className="top-left">
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
      <h2>Payment Method</h2>
      <div>
        <button onClick={() => handlePaymentSelection("wallet")}>
          Pay with Wallet
        </button>
      </div>
      <div>
        <button onClick={() => handlePaymentSelection("creditCard")}>
          Pay with Credit Card
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
