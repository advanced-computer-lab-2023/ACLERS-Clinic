// Popup.js
import React from "react";

const Popup = ({ handleClose, children }) => {
  return (
    <div className="popup">
      <div className="popup-inner">
        <button className="close-btn" onClick={handleClose}>
          Close
        </button>
        {children}
      </div>
    </div>
  );
};

export default Popup;
