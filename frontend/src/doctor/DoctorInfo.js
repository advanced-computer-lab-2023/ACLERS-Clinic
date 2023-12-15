import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import jwt from "jsonwebtoken-promisified";
import DoctorNavbar from "../components/DoctorNavbar";
import {
  Email,
  Money,
  Business,
  School,
  LocationCity,
  Star,
} from "@mui/icons-material"; // Import icons
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";

const DoctorInfo = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({
    // Initialize with empty values for the doctor's info fields
    email: "",
    hourlyRate: 0,
    affiliation: "",
    // Add more fields as needed
  });
  const token = localStorage.getItem("token");
  const decodedtoken = jwt.decode(token);
  console.log("decoded Token:", decodedtoken);
  const id = decodedtoken.id;

  // Fetch doctor information based on the ID when the component mounts
  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    fetch(`http://localhost:8000/Doctor-Home/view-my-info`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setDoctor(data);
        // Initialize the editedInfo state with the fetched data
        setEditedInfo({ ...data });
      })
      .catch((error) => {
        console.error("Error fetching doctor info:", error);
      });
  }, [id]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveClick = async () => {
    // Perform the API call to update the doctor's information here

    const response = await fetch(
      `http://localhost:8000/Doctor-Home/editDocEmail?doctorID=${id}`,
      {
        method: "PUT", // Use the appropriate HTTP method (e.g., PUT or POST)
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedInfo),
      }
    );

    if (response.ok) {
      setIsEditing(false);
      // Optionally, update the doctor state with the new data
      setDoctor({ ...doctor, ...editedInfo });
    } else {
      console.error("Failed to update doctor information");
    }
  };

  if (decodedtoken.role !== "doctor") {
    return (
      <div>
        <div>ACCESS DENIED, You are not authenticated, please log in</div>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  // Fake reviews data
  const fakeReviews = [
    { rating: 5, quote: "Best doctor ever! Highly recommended!" },
    { rating: 5, quote: "Excellent service and expertise!" },
    { rating: 5, quote: "Wonderful experience, would visit again!" },
    { rating: 5, quote: "Professional and caring, top-notch doctor!" },
    {
      rating: 5,
      quote: "A true expert in the field, exceeded my expectations!",
    },
  ];

  return (
    <div style={{ marginLeft: "270px", marginTop: "10px" }}>
      <DoctorNavbar />

      <div>
        {doctor ? (
          <Paper elevation={3} style={{ padding: "20px", width: "99%" }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Typography
                  variant="h4"
                  gutterBottom
                  style={{ paddingLeft: 15 }}
                >
                  {"Doctor " + doctor.username}
                </Typography>
                <Avatar
                  alt={doctor.username}
                  src={
                    "https://i.ibb.co/HXyFJZM/avatar.jpg" ||
                    "default-avatar.jpg"
                  }
                  sx={{
                    width: 250,
                    height: 250,
                    margin: "auto",
                    borderRadius: 0,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4} style={{ paddingLeft: 40 }}>
                <Typography
                  variant="body1"
                  paragraph
                  style={{ paddingTop: 48 }}
                >
                  <Email /> Email: {doctor.email}
                </Typography>
                <Typography variant="body1" paragraph style={{ paddingTop: 6 }}>
                  <Money /> Hourly Rate: {doctor.hourlyRate}
                </Typography>
                <Typography variant="body1" paragraph style={{ paddingTop: 6 }}>
                  <Business /> Affiliation: {doctor.affiliation}
                </Typography>
                <Typography variant="body1" paragraph style={{ paddingTop: 6 }}>
                  <School /> Educational Background:{" "}
                  {doctor.educationalBackground}
                </Typography>
                <Typography variant="body1" paragraph style={{ paddingTop: 6 }}>
                  <LocationCity /> Speciality: {doctor.speciality}
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                md={5}
                style={{ textAlign: "center", paddingLeft: 20 }}
              >
                <Typography variant="h6" gutterBottom>
                  Reviews
                </Typography>
                {fakeReviews.map((review, index) => (
                  <div key={index} style={{ marginBottom: 10 }}>
                    <Rating
                      name={`rating-${index}`}
                      value={review.rating}
                      readOnly
                      icon={
                        <Star fontSize="small" style={{ color: "black" }} />
                      }
                    />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      style={{ fontSize: "16px" }}
                    >
                      {review.quote}
                    </Typography>
                  </div>
                ))}
              </Grid>
            </Grid>
          </Paper>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default DoctorInfo;
