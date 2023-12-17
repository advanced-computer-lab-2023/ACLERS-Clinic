import { useEffect, useState } from "react";
import DoctorDetails from "../../components/doctordetails";
import jwt from "jsonwebtoken-promisified";
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import CancelIcon from "@mui/icons-material/Cancel";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";

const getRandomImageURL = () =>
  `https://source.unsplash.com/random?doctor=${Math.random()}`;

const ViewDoctors = () => {
  const [doctors, setDoctors] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decodedtoken = jwt.decode(token);
  console.log("decoded Token:", decodedtoken);
  const id = decodedtoken.id;
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClick = (doctor) => {
    console.log("el button etdas");
    console.log(doctor._id);

    const url = `/admin/remove-doctor?id=${doctor._id}`;
    const response = fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const json = response.json();
      console.log(json);
      setDialogOpen(true);

      // Close the dialog after 3 seconds
      setTimeout(() => {
        setDialogOpen(false);
      }, 5000);
    }
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(
        "http://localhost:8000/admin/view-doctors",
        requestOptions
      );
      const json = await response.json();

      if (response.ok) {
        setDoctors(json);
      }
    };
    fetchDoctors();
  }, []);

  if (!token) {
    // Handle the case where id is not available
    return <div>ACCESS DENIED, You are not authenticated, please log in</div>;
  }

  if (decodedtoken.role !== "admin") {
    return (
      <div>
        <div>ACCESS DENIED, You are not authenticated, please log in</div>
        <Link to="/login">Login</Link>
      </div>
    );
  }
  return (
    <div className="doctorviewer" style={{ marginLeft: "240px" }}>
      <AdminNavbar />

      <Box
        sx={{
          backgroundImage: 'url("https://source.unsplash.com/random?doctor")',
          backgroundSize: "cover", // Adjust as needed
          backgroundPosition: "center", // Adjust as needed
          bgcolor: "background.paper",

          pt: 8,
          pb: 6,
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center", // Center the content vertically
            minHeight: "80%", // Ensure the content takes at least the full viewport height
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.8)", // Adjust the alpha value for transparency
              padding: "20px", // Adjust as needed
              maxWidth: "1000px", // Set the maximum width as needed
              width: "100%",
              borderRadius: "8px", // Optional: Add border-radius for rounded corners
            }}
          >
            <Container maxWidth="sm">
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
              >
                Doctors
              </Typography>
              <Typography
                variant="h5"
                align="center"
                color="text.secondary"
                paragraph
              >
                El7a2ni streamlines doctor oversight, providing you with a
                user-friendly platform to view and manage doctors, facilitating
                quick inspections and employment management.
              </Typography>
              <Stack
                sx={{ pt: 4 }}
                direction="column"
                spacing={2}
                justifyContent="center"
              ></Stack>
            </Container>
          </div>
        </div>
      </Box>
      <div
        style={{
          marginLeft: "40px",
          marginRight: "20px",
          marginTop: "20px",
          marginBottom: "40px",
        }}
      >
        <Grid container spacing={4}>
          {doctors && Array.isArray(doctors) && doctors.length > 0 ? (
            doctors.map((doctor) => (
              <Grid item key={doctor._id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      // 16:9
                      pt: "56.25%",
                    }}
                    image={getRandomImageURL()}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {doctor.username} ({doctor.speciality})
                    </Typography>
                    <Typography>Hourly Rate: {doctor.hourlyRate}</Typography>
                    <Typography>Affiliation: {doctor.affiliation}</Typography>
                    <Typography>
                      Education: {doctor.educationalBackground}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#851414", // red
                        color: "white",
                        fontWeight: "bold",
                        padding: "8px 16px", // Add padding here
                        width: "100%",
                      }}
                      size="small"
                      onClick={() => handleClick(doctor)}
                      startIcon={<CancelIcon />}
                    >
                      Remove
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <p>No doctors available.</p>
          )}
        </Grid>
        <Dialog
          open={dialogOpen}
          TransitionComponent={Slide}
          keepMounted
          onClose={() => setDialogOpen(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent>
            <Typography variant="h6" color="primary">
              Doctor removed successfully!
            </Typography>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ViewDoctors;
