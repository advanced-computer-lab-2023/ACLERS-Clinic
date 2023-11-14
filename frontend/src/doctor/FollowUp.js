// FreeSlotsPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt from 'jsonwebtoken-promisified';

const FreeSlotsPage = () => {
  const token = localStorage.getItem('token');
  const decodedToken = jwt.decode(token);
  const doctorId = decodedToken.id;

  const [freeSlots, setFreeSlots] = useState([]);
  const [registrationStatus, setRegistrationStatus] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    fetch(`http://localhost:8000/Doctor-Home/viewFreeslots?doctorId=${doctorId}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setFreeSlots(data);
      })
      .catch((error) => {
        console.error('Error fetching free slots:', error);
      });
  }, [doctorId]);

  const handleRegisterFollowUp = async (slotId) => {
    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ freeSlotId: slotId }),
      };

      const response = await fetch('http://localhost:8000/Doctor-Home/setAppointment', requestOptions);

      if (response.ok) {
        // Handle successful registration
        console.log('Follow-up registered successfully');
        setRegistrationStatus({ slotId, status: 'success' });
      } else {
        // Handle registration failure
        console.error('Failed to register follow-up');
        setRegistrationStatus({ slotId, status: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Available Free Slots</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {freeSlots.map((slot) => (
            <tr key={slot._id}>
              <td>{new Date(slot.date).toLocaleDateString()}</td>
              <td>{slot.startTime}</td>
              <td>{slot.endTime}</td>
              <td>
                {registrationStatus.slotId === slot._id && registrationStatus.status === 'success' ? (
                  <span>Registered successfully</span>
                ) : (
                  <button onClick={() => handleRegisterFollowUp(slot._id)}>
                    {registrationStatus.slotId === slot._id && registrationStatus.status === 'error'
                      ? 'Registration Failed'
                      : 'Register Follow-up'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FreeSlotsPage;
