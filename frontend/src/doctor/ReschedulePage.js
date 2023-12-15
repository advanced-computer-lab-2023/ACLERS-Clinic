import React, { useState, useEffect } from "react";
import { useNavigate, useLocation ,useParams} from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jwt from "jsonwebtoken-promisified";

const DoctorReschedulePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {appointmentId} = useParams(); // Use the appointmentId parameter directly
  console.log(appointmentId)
  const [freeSlots, setFreeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const token = localStorage.getItem("token");
  const decodedtoken = jwt.decode(token);
  const doctorId = decodedtoken.id;

  useEffect(() => {
    // Fetch free slots based on the doctorId
    const fetchFreeSlots = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/Doctor-home/viewFreeslots`, {
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
  }, [doctorId]);

  const handleReschedule = async () => {
    // Implement the logic to update the appointment with the selected free slot
    if (selectedSlot) {
      console.log (appointmentId)
      console.log(selectedSlot._id)
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
          navigate("/doctor/view-my-appointments");
        } else {
          console.error("Failed to reschedule appointment");
        }
      } catch (error) {
        console.error("Error during rescheduling:", error);
      }
    }
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
    </div>
  );
};

export default DoctorReschedulePage;
