// DoctorReschedulePage.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jwt from "jsonwebtoken-promisified";
import Popup from "../components/Popup"; // Adjust the path based on your project structure

const DoctorReschedulePage = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [freeSlots, setFreeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const token = localStorage.getItem("token");
  const decodedtoken = jwt.decode(token);
  const doctorId = decodedtoken.id;

  useEffect(() => {
    const fetchFreeSlots = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/Doctor-home/viewFreeslots`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setFreeSlots(data);
        } else {
          console.error("Failed to retrieve free slots");
        }
      } catch (error) {
        console.error("Error during free slots retrieval:", error);
      }
    };

    fetchFreeSlots();
  }, [doctorId, token]);

  const handleReschedule = async () => {
    if (selectedSlot) {
      try {
        const response = await fetch(
          `http://localhost:8000/Doctor-Home/rescheduleAppointment?AppointmentId=${appointmentId}&freeSlotId=${selectedSlot._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          setShowPopup(true);
        } else {
          console.error("Failed to reschedule appointment");
        }
      } catch (error) {
        console.error("Error during rescheduling:", error);
      }
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    navigate("/doctor/view-my-appointments");
  };

  return (
    <div>
      <h1>Reschedule Appointment</h1>

      <div>
        <label>Select a Free Slot:</label>
        <select onChange={(e) => setSelectedSlot(JSON.parse(e.target.value))}>
          <option value="">Select Free Slot</option>
          {freeSlots.map((slot) => (
            <option key={slot._id} value={JSON.stringify(slot)}>
              {`${slot.date} ${slot.startTime}-${slot.endTime}`}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleReschedule}>Reschedule</button>

      {showPopup && (
        <Popup handleClose={closePopup}>
          <p>Appointment rescheduled successfully!</p>
        </Popup>
      )}
    </div>
  );
};

export default DoctorReschedulePage;
