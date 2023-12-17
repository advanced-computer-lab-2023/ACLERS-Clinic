import React, { useEffect, useRef, useState } from "react";
import jwt from "jsonwebtoken-promisified";
import PatientNavbar from "../components/PatientNavbar";
import {
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { formatDistanceToNow } from "date-fns";
import { enGB } from "date-fns/locale";

const ChatPatient = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setarrivalMessage] = useState(null);
  const [openDialog, setOpenDialog] = useState(true);
  const token = localStorage.getItem("token");
  const decodedToken = jwt.decode(token);
  console.log("decoded Token:", decodedToken);
  const { conversationId ,doctor} = useParams();
  const socket = useRef(io("ws://localhost:3202"));
  const chatContainer = useRef(null);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const recieverusername = localStorage.getItem("recieverusername");

  useEffect(() => {
    socket.current.emit("addUser",decodedToken.email );
  }, []);

  useEffect(() => {
    socket.current.on("getMessage", (data) => {
      setarrivalMessage({
        sender: data.senderusername,
        text: data.text,
        createdAt: Date.now(),
      });
    });

    return () => {
      socket.current.off("getMessage");
    };
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    chatContainer.current?.scrollTo(0, chatContainer.current.scrollHeight);
  }, [arrivalMessage]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8000/Patient-Home/get-messages?conversationId=${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data)
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const formatTimeDistance = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  const handleSendMessage = async () => {
    socket.current.emit("sendMessage", {
      senderusername: decodedToken.email,
      recieverusername: doctor,
      text: newMessage,
    });

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8000/Patient-Home/send-message?conversationId=${conversationId}`,
        { text: newMessage},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewMessage("");
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    navigate("/patient/dashboard");
  };

  return (
    <Container>
        <PatientNavbar/>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="xl"
        style={{
          width: 1000,
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "140px",
        }}
      >
        <DialogTitle>{doctor}</DialogTitle>
        <DialogContent>
          <Paper
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              minHeight: "300px",
              minWidth: "500px",
              marginBottom: "20px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
            ref={chatContainer}
          >
            {messages?.map((message, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection:
                    message.sender === decodedToken.id ? "row-reverse" : "row",
                  marginBottom: "10px",
                  alignItems: "center",
                }}
              >
                <Avatar style={{ marginRight: "10px" }}>
                  {message.sender[0].toUpperCase()}
                </Avatar>
                <div
                  style={{
                    backgroundColor:
                      message.sender ===decodedToken.id ? "#2196f3" : "#e0e0e0",
                    padding: "5px",
                    borderRadius: "10px",
                    maxWidth: "50%",
                    position: "relative",
                  }}
                >
                  {message.text}
                </div>
                <div style={{ fontSize: "12px", color: "#999" }}>
                  {formatTimeDistance(message.createdAt)}
                </div>
              </div>
            ))}
          </Paper>
          <div style={{ display: "flex", alignItems: "center" }}>
            <TextField
              label="Type your message"
              variant="outlined"
              fullWidth
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              style={{ marginLeft: "10px" }}
            >
              <SendIcon />
            </IconButton>
          </div>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ChatPatient;
