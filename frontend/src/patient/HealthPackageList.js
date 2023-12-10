import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./HealthPackageList.css"; // Import the CSS file
import DatePicker from "react-datepicker";
import { Link, useLocation } from "react-router-dom";
import "./PatientAppointments.css";
import "react-datepicker/dist/react-datepicker.css";
import jwt from "jsonwebtoken-promisified";
import PatientNavbar from "../components/PatientNavbar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import StarIcon from "@mui/icons-material/StarBorder";
import Typography from "@mui/material/Typography";
import GlobalStyles from "@mui/material/GlobalStyles";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const HealthPackageList = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const decodedtoken = jwt.decode(token);
  console.log("decoded Token:", decodedtoken);
  const id = decodedtoken.id;
  const navigate = useNavigate();
  const [healthPackages, setHealthPackages] = useState([]);
  const [subscriptionType, setSubscriptionType] = useState(""); // Added subscriptionType state
  const [familyMembers, setFamilyMembers] = useState([]);
  const [paymentOption, setPaymentOption] = useState("");

  const tiers = healthPackages.map((healthPackage) => ({
    title: healthPackage.type,
    price: healthPackage.Price,
    description: [
      // Adjust the description as needed based on the actual data structure
      `Enjoy ${healthPackage.doctorDiscount}% off any doctor's session price`,
      `and ${healthPackage.medicineDiscount}% off any medicine ordered from pharmacy platform`,
      `and ${healthPackage.subscriptionDiscount}% discount on the subscription of any of your family members in any package`,
    ],
    buttonText: "Get started",
    buttonVariant: "outlined",
  }));

  const defaultTheme = createTheme();

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    // Fetch health packages data
    fetch(
      `http://localhost:8000/Patient-Home/view-healthPackages?patientId=${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setHealthPackages(data);
      })
      .catch((error) => {
        console.error("Error fetching health packages:", error);
      });
  }, [id]);

  useEffect(() => {
    // Replace with your API call to fetch patient's appointments
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    fetch(
      `http://localhost:8000/Patient-Home/view-fam-member?patientId=${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.familyMembers && Array.isArray(data.familyMembers)) {
          // Update the state variable to show family members
          setFamilyMembers(data.familyMembers);
        } else {
          console.error("Error: Family members response is not an array", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching family members:", error);
      });
  }, [id]);

  const handleSubscribe = (healthPackageId) => {
    console.log(subscriptionType);
    // Check the subscription type
    if (subscriptionType === "Myself") {
      console.log(id);
      console.log(healthPackageId);
      console.log(paymentOption);
      // If subscription type is "Myself", make a POST request with patientId and healthPackageId in the query
      fetch(
        `http://localhost:8000/Patient-Home/subscribe-healthPackage?id=${id}&healthPackageId=${healthPackageId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentMethod: paymentOption,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (paymentOption == "creditCard") {
            if (data.url) {
              window.location.href = data.url;
            }
          }
        })
        .catch((error) => {
          console.error("Error subscribing:", error);
        });
    } else {
      const selectedFamilyMember = familyMembers.find(
        (member) => member.relationToPatient === subscriptionType
      );
      const familyMemberId = selectedFamilyMember._id;
      console.log(id);
      console.log(healthPackageId);
      console.log(paymentOption);
      console.log(familyMemberId);
      // If subscription type is not "Myself", assume it's a family member
      // Here, you need to replace "familyMemberId" with the actual ID of the selected family member

      // Make a POST request with patientId, familyMemberId, and healthPackageId in the query
      fetch(
        `http://localhost:8000/Patient-Home/subscribe-healthpack-famMem?id=${id}&familyMemberId=${familyMemberId}&healthPackageId=${healthPackageId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentMethod: paymentOption,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (paymentOption == "creditCard") {
            if (data.url) {
              window.location.href = data.url;
            }
          }
        })
        .catch((error) => {
          console.error("Error subscribing:", error);
        });
    }
  };
  if (decodedtoken.role !== "patient") {
    return (
      <div>
        <div>ACCESS DENIED, You are not authenticated, please log in</div>
        <Link to="/login">Login</Link>
      </div>
    );
  }
  return (
    <div>
      <PatientNavbar />
      <div className="desktop">
        <div className="tester">
          <ThemeProvider theme={defaultTheme}>
            <GlobalStyles
              styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
            />
            <CssBaseline />
            {/* Hero unit */}
            <Container
              disableGutters
              maxWidth="sm"
              component="main"
              sx={{ pt: 8, pb: 6 }}
            >
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
              >
                Pricing
              </Typography>
              <Typography
                variant="h5"
                align="center"
                color="text.secondary"
                component="p"
              >
                Unlock a world of comprehensive healthcare and well-being with
                our exclusive health packages on El7a2ni. Choose Silver for
                essential care, Gold for enhanced support, or Platinum for the
                ultimate health experience. Subscribe now to prioritize your
                health journey like never before!
              </Typography>
            </Container>
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

                          {/* Payment Dropdown */}
                          <FormControl fullWidth sx={{ marginBottom: 2 }}>
                            <InputLabel htmlFor="payment-dropdown">
                              Payment Method
                            </InputLabel>
                            <Select
                              value={paymentOption}
                              onChange={(e) => setPaymentOption(e.target.value)}
                              label="Payment Method"
                              inputProps={{
                                name: "payment",
                                id: "payment-dropdown",
                              }}
                            >
                              <MenuItem value="creditCard">
                                Credit Card
                              </MenuItem>
                              <MenuItem value="wallet">Wallet</MenuItem>
                            </Select>
                          </FormControl>

                          {/* Subscription Dropdown */}
                          <FormControl fullWidth>
                            <InputLabel htmlFor="subscription-dropdown">
                              Subscription Type
                            </InputLabel>
                            <Select
                              value={subscriptionType}
                              onChange={(e) =>
                                setSubscriptionType(e.target.value)
                              }
                              label="Subscription Type"
                              inputProps={{
                                name: "subscription",
                                id: "subscription-dropdown",
                              }}
                            >
                              <MenuItem value="Myself">Myself</MenuItem>
                              {familyMembers.map((familyMember) => (
                                <MenuItem
                                  key={familyMember._id}
                                  value={familyMember.relationToPatient}
                                >
                                  {familyMember.name} -{" "}
                                  {familyMember.relationToPatient}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </CardContent>
                        <CardActions>
                          <Button
                            fullWidth
                            variant={tier.buttonVariant}
                            onClick={() => handleSubscribe(healthPackage._id)}
                          >
                            {tier.buttonText}
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Container>
          </ThemeProvider>
        </div>
      </div>
    </div>
  );
};

export default HealthPackageList;
