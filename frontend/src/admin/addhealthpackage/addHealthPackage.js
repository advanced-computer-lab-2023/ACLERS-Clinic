import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import jwt from "jsonwebtoken-promisified";
import AdminNavbar from "../../components/AdminNavbar";
import {
  createTheme,
  ThemeProvider,
  Dialog,
  DialogContent,
  Button,
  Typography,
  IconButton,
  TextField,
  Stack,
} from "@mui/material";
import GlobalStyles from "@mui/material/GlobalStyles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import StarIcon from "@mui/icons-material/StarBorder";
import Container from "@mui/material/Container";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add"; // Import the AddIcon

const AddHealthPackage = () => {
  const [healthPackages, setHealthPackages] = useState([]);
  const [showForm, setShowForm] = useState(false); // State to control form visibility
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const [Price, setPrice] = useState("");
  const [doctorDiscount, setDoctorDiscount] = useState("");
  const [medicineDiscount, setMedicineDiscount] = useState("");
  const [subscriptionDiscount, setSubscriptionDiscount] = useState("");
  const token = localStorage.getItem("token");
  const decodedtoken = jwt.decode(token);
  const defaultTheme = createTheme();
  console.log("decoded Token:", decodedtoken);
  const id = decodedtoken.id;
  const tiers = healthPackages.map((healthPackage) => ({
    title: healthPackage.type,
    price: healthPackage.Price,
    description: [
      `Enjoy ${healthPackage.doctorDiscount}% off any doctor's session price`,
      `and ${healthPackage.medicineDiscount}% off any medicine ordered from pharmacy platform`,
      `and ${healthPackage.subscriptionDiscount}% discount on the subscription of any of your family members in any package`,
    ],
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const healthPackage = {
      type,
      Price,
      doctorDiscount,
      medicineDiscount,
      subscriptionDiscount,
    };
    console.log(healthPackage);

    const response = await fetch(
      "http://localhost:8000/admin/add-HealthPackage",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(healthPackage),
      }
    );
    const json = await response.json();
    if (response.ok) {
      setType("");
      setPrice("");
      setDoctorDiscount("");
      setMedicineDiscount("");
      setSubscriptionDiscount("");
      console.log(json);
      // Close the form after successfully adding a health package
      setShowForm(false);
      fetchPackages();
    }
  };

  useEffect(() => {
    const fetchPackages = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(
        "http://localhost:8000/admin/view-HealthPackage",
        requestOptions
      );
      const json = await response.json();

      if (response.ok) {
        setHealthPackages(json);
        console.log("all healthPackages: ", json);
      }
    };
    fetchPackages();
  }, []);
  const fetchPackages = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(
      "http://localhost:8000/admin/view-HealthPackage",
      requestOptions
    );
    const json = await response.json();

    if (response.ok) {
      setHealthPackages(json);
    }
  };

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
    <div style={{ marginLeft: "240px", marginBottom: "20px" }}>
      <AdminNavbar />
      <div className="desktop" style={{ marginBottom: "20px" }}>
        {/* Hero unit */}
        <Box
          sx={{
            backgroundImage: 'url("https://source.unsplash.com/random?health")',
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
                  Health Packages
                </Typography>
                <Typography
                  variant="h5"
                  align="center"
                  color="text.secondary"
                  paragraph
                >
                  El7a2ni streamlines health package oversight, providing you
                  with a user-friendly platform to view and manage health
                  packages, facilitating quick inspections and detail
                  management.
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
          className="tester"
          style={{ marginBottom: "20px", marginTop: "450px" }}
        >
          <ThemeProvider theme={defaultTheme}>
            <GlobalStyles
              styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
            />
            <CssBaseline />
            {/* End hero unit */}
            <Container maxWidth="md" component="main">
              <Grid container spacing={5} alignItems="flex-end">
                {tiers.map((tier, index) => {
                  const healthPackage = healthPackages[index]; // Get the corresponding healthPackage
                  return (
                    <Grid
                      item
                      key={tier.title}
                      xs={12}
                      sm={tier.title === "Enterprise" ? 12 : 6}
                      md={4}
                    >
                      <Card>
                        <CardHeader
                          title={tier.title}
                          subheader={tier.subheader}
                          titleTypographyProps={{ align: "center" }}
                          action={tier.title === "Pro" ? <StarIcon /> : null}
                          subheaderTypographyProps={{
                            align: "center",
                          }}
                          sx={{
                            backgroundColor: (theme) =>
                              theme.palette.mode === "light"
                                ? theme.palette.grey[200]
                                : theme.palette.grey[700],
                          }}
                        />
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "baseline",
                              mb: 2,
                            }}
                          >
                            <Typography
                              component="h2"
                              variant="h3"
                              color="text.primary"
                            >
                              {tier.price}
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                              /yr
                            </Typography>
                          </Box>
                          <ul>
                            {tier.description.map((line) => (
                              <Typography
                                component="li"
                                variant="subtitle1"
                                align="center"
                                key={line}
                              >
                                {line}
                              </Typography>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "20px",
                    marginBottom: "180px",
                  }}
                >
                  <IconButton
                    onClick={() => setShowForm(true)}
                    style={{ backgroundColor: "#4CAF50", color: "white" }}
                  >
                    <AddIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Container>
          </ThemeProvider>
          <Dialog open={showForm} onClose={() => setShowForm(false)}>
            <DialogContent>
              {/* Your existing form code goes here */}
              {/* ... */}
              <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    name="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  />
                  <TextField
                    label="Price"
                    variant="outlined"
                    fullWidth
                    name="price"
                    value={Price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  <TextField
                    label="Doctor Discount"
                    variant="outlined"
                    fullWidth
                    name="Doctor Discount"
                    value={doctorDiscount}
                    onChange={(e) => setDoctorDiscount(e.target.value)}
                  />
                  <TextField
                    label="Medicine Discount"
                    variant="outlined"
                    fullWidth
                    name="Medicine Discount"
                    value={medicineDiscount}
                    onChange={(e) => setMedicineDiscount(e.target.value)}
                  />
                  <TextField
                    label="Subscription Discount"
                    variant="outlined"
                    fullWidth
                    name="Subscription Discount"
                    value={subscriptionDiscount}
                    onChange={(e) => setSubscriptionDiscount(e.target.value)}
                  />
                  <div>
                    <button
                      className="filter-button"
                      style={{ marginLeft: "10px" }}
                      type="submit"
                    >
                      Submit
                    </button>
                  </div>
                </Stack>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AddHealthPackage;
