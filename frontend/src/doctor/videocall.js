import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import SimplePeer from 'simple-peer';

const DoctorComponent = () => {
  const [socket, setSocket] = useState(null);
  const [peer, setPeer] = useState(null);
  const [stream, setStream] = useState(null);
  const roomId = 'sameRoomIdAsPatient';
  const videoRef = useRef(null);

  useEffect(() => {
    const newSocket = io('http://localhost:8000');

    newSocket.on('connect', () => {
      const doctorId = 'specificDoctorId'; // Replace with the actual doctor ID
      newSocket.emit('doctor-join', { roomId, doctorId });
    });

    newSocket.on('doctor-joined', () => {
      const newPeer = new SimplePeer({ initiator: false, trickle: false, stream });
      setPeer(newPeer);

      newPeer.on('signal', (data) => {
        newSocket.emit('answer', { roomId, sdp: data });
      });

      newPeer.on('stream', (patientStream) => {
        videoRef.current.srcObject = patientStream;
      });

      setSocket(newSocket);
    });

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((doctorStream) => setStream(doctorStream));

    return () => {
      newSocket.disconnect();
      if (peer) {
        peer.destroy();
      }
    };
  }, [roomId, peer]);

  return (
    <div>
      <h1>Doctor Component</h1>
      <video ref={videoRef} autoPlay playsInline muted />
    </div>
  );
};

export default DoctorComponent;
