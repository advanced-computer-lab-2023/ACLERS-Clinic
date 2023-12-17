import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import jwt from "jsonwebtoken-promisified";
import {
  createTheme,
  ThemeProvider,
  Dialog,
  DialogContent,
  Button,
  Typography,
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
import AdminNavbar from "../../components/AdminNavbar";
import EditIcon from "@mui/icons-material/Edit";

import Slide from "@mui/material/Slide";

const HealthPackageList = () => {
  const [healthPackages, setHealthPackages] = useState([]);
  const [editPackage, setEditPackage] = useState(null);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decodedToken = jwt.decode(token);

  const defaultTheme = createTheme();

  const tiers = healthPackages.map((healthPackage) => ({
    title: healthPackage.type,
    price: healthPackage.Price,
    description: [
      `Enjoy ${healthPackage.doctorDiscount}% off any doctor's session price`,
      `and ${healthPackage.medicineDiscount}% off any medicine ordered from pharmacy platform`,
      `and ${healthPackage.subscriptionDiscount}% discount on the subscription of any of your family members in any package`,
    ],
  }));

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

  const deletePackage = async (packageId) => {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(
        `/admin/delete-HealthPackage?healthPackageId=${packageId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchPackages();
        setDialogOpen(true);

        // Close the dialog after 3 seconds
        setTimeout(() => {
          setDialogOpen(false);
        }, 5000);
      } else {
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
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

  const handleEditClick = (healthPackage) => {
    console.log("here is the id: ", healthPackage._id);
    console.log("here is the type: ", healthPackage.type);
    console.log("here is the package: ", healthPackage);
    setEditPackage({
      _id: healthPackage._id,
      type: healthPackage.type,
      Price: healthPackage.Price,
      doctorDiscount: healthPackage.doctorDiscount,
      medicineDiscount: healthPackage.medicineDiscount,
      subscriptionDiscount: healthPackage.subscriptionDiscount,
    });
    setEditDialogOpen(true);
    console.log("here is the id: ", healthPackage._id);
    console.log("here is the type: ", healthPackage.type);
    console.log("here is the package: ", healthPackage);
  };

  const handleEditDialogClose = async () => {
    try {
      // Ensure editPackage is defined
      if (!editPackage) {
        console.error("editPackage is undefined");
        return;
      }
      console.log("editPackageeeeeeeeeeeeeeeeeeee:", editPackage._id);
      const response = await fetch(
        `http://localhost:8000/admin/update-HealthPackage?healthPackageId=${editPackage._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editPackage),
        }
      );

      if (response.ok) {
        // Health package updated successfully, you might want to update the UI accordingly
        // For simplicity, I'm just logging a success message here
        console.log("Health package updated successfully");

        // Close the dialog
        setEditDialogOpen(false);
        setEditPackage(null);
        fetchPackages();
      } else {
        // Handle errors, e.g., show an error message
        console.error("Failed to update health package");
      }
    } catch (error) {
      console.error("Error updating health package:", error);
    }
  };

  if (!token) {
    // Handle the case where id is not available
    return <div>ACCESS DENIED, You are not authenticated, please log in</div>;
  }

  if (decodedToken.role !== "admin") {
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
                        <CardActions>
                          <Button
                            fullWidth
                            variant="contained"
                            style={{
                              backgroundColor: "#851414", // red
                              color: "white",
                              fontWeight: "bold",
                              padding: "8px 16px", // Add padding here
                              width: "100%",
                            }}
                            size="small"
                            onClick={() => deletePackage(healthPackage._id)}
                            startIcon={<CancelIcon />}
                          >
                            Delete
                          </Button>
                          <Button
                            fullWidth
                            variant="contained"
                            style={{
                              backgroundColor: "#114B5F", // Green
                              color: "white",
                              fontWeight: "bold",
                              padding: "8px 16px",
                              width: "100%",
                            }}
                            size="small"
                            onClick={() => handleEditClick(healthPackage)}
                            startIcon={<EditIcon />}
                          >
                            Edit
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Container>
            <Dialog open={isEditDialogOpen} onClose={handleEditDialogClose}>
              <DialogContent>
                {editPackage && (
                  <>
                    <Typography variant="h4">Edit Health Package</Typography>
                    {/* Form for editing health package attributes */}
                    <Stack spacing={2}>
                      <TextField
                        label="Type"
                        variant="outlined"
                        fullWidth
                        name="type"
                        value={editPackage.type}
                        onChange={(e) =>
                          setEditPackage({
                            ...editPackage,
                            type: e.target.value,
                          })
                        }
                      />
                      <TextField
                        label="Price"
                        variant="outlined"
                        fullWidth
                        name="Price"
                        type="number"
                        value={editPackage.Price}
                        onChange={(e) =>
                          setEditPackage({
                            ...editPackage,
                            Price: e.target.value,
                          })
                        }
                      />
                      <TextField
                        label="Doctor Discount (%)"
                        variant="outlined"
                        fullWidth
                        name="Doctor Discount (%)"
                        type="number"
                        value={editPackage.doctorDiscount}
                        onChange={(e) =>
                          setEditPackage({
                            ...editPackage,
                            doctorDiscount: e.target.value,
                          })
                        }
                      />
                      <TextField
                        label="Medicine Discount (%)"
                        variant="outlined"
                        fullWidth
                        name="Medicine Discount (%)"
                        type="number"
                        value={editPackage.medicineDiscount}
                        onChange={(e) =>
                          setEditPackage({
                            ...editPackage,
                            medicineDiscount: e.target.value,
                          })
                        }
                      />
                      <TextField
                        label="Subscription Discount (%)"
                        variant="outlined"
                        fullWidth
                        name="Subscription Discount (%)"
                        type="number"
                        value={editPackage.subscriptionDiscount}
                        onChange={(e) =>
                          setEditPackage({
                            ...editPackage,
                            subscriptionDiscount: e.target.value,
                          })
                        }
                      />
                      {/* Add more input fields as needed for other attributes */}
                      <Button
                        variant="contained"
                        onClick={() => {
                          // Handle save changes
                          // You may want to send a PUT request to update the health package data
                          // and then close the dialog
                          // For simplicity, I'm just closing the dialog here
                          handleEditDialogClose();
                        }}
                      >
                        Save Changes
                      </Button>
                    </Stack>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </ThemeProvider>
        </div>
        <Dialog
          open={dialogOpen}
          TransitionComponent={Slide}
          keepMounted
          onClose={() => setDialogOpen(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent>
            <Typography variant="h6" color="primary">
              Health package deleted successfully!
            </Typography>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default HealthPackageList;
