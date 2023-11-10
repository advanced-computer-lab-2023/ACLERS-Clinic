import React from "react";
import "./adminhome.css";
import avatar from "./avatar.jpg";
import logo from "./el7a2nilogoblack.png";
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
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import GlobalStyles from "@mui/material/GlobalStyles";
import Container from "@mui/material/Container";

const tiers = [
  {
    title: "Silver",
    price: "3600",
    description: [
      "enjoy 40% off any doctor's session price and 20% off any medicine ordered from pharmacy platform and 10% discount on the subscribtion of any of your family members in any package",
    ],
    buttonText: "Get started",
    buttonVariant: "outlined",
  },
  {
    title: "Gold",
    subheader: "Most popular",
    price: "6000",
    description: [
      "enjoy 60% off any doctor's session price and 30% off any medicine ordered from pharmacy platform and 15% discount on the subscribtion of any of your family members in any package",
    ],
    buttonText: "Get started",
    buttonVariant: "contained",
  },
  {
    title: "Platinum",
    price: "9000",
    description: [
      "enjoy 80% off any doctor's session price and 40% off any medicine ordered from pharmacy platform and 20% discount on the subscribtion of any of your family members in any package",
    ],
    buttonText: "Get started",
    buttonVariant: "outlined",
  },
];

const defaultTheme = createTheme();

export const adminhome = () => {
  return (
    <div className="desktop">
      <div className="overlap-wrapper">
        <div className="overlap">
          <img className="elanilogoblack" alt="Elanilogoblack" src={logo} />
          <div className="group">
            <div className="overlap-group">
              <div className="div" />
              <img
                className="dollar-sign"
                alt="Dollar sign"
                src={require("./dollar-sign.svg").default}
              />
              <div className="text-wrapper">Health Packages</div>
              <img className="line" alt="Line" src="line-3.svg" />
            </div>
            <div className="overlap-2">
              <div className="div" />
              <img
                className="user-plus"
                alt="User plus"
                src={require("./user-plus.svg").default}
              />
              <div className="text-wrapper-2">Add Administrator</div>
              <img className="img" alt="Line" src="line-1.svg" />
              <img className="img" alt="Line" src="line-4.svg" />
            </div>
            <div className="overlap-group-2">
              <div className="div" />
              <img
                className="users"
                alt="Users"
                src={require("./users.svg").default}
              />
              <div className="text-wrapper-3">Manage Users</div>
              <img className="line-2" alt="Line" src="line-2.svg" />
            </div>
          </div>
          <img className="ellipse" alt="Ellipse" src={avatar} />
          <div className="overlap-3">
            <div className="text-wrapper-4">Bassem Ehab</div>
            <div className="text-wrapper-5">System Administrator</div>
          </div>
        </div>
      </div>
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
            Unlock a world of comprehensive healthcare and well-being with our
            exclusive health packages on El7a2ni. Choose Silver for essential
            care, Gold for enhanced support, or Platinum for the ultimate health
            experience. Subscribe now to prioritize your health journey like
            never before!
          </Typography>
        </Container>
        {/* End hero unit */}
        <Container maxWidth="md" component="main">
          <Grid container spacing={5} alignItems="flex-end">
            {tiers.map((tier) => (
              // Enterprise card is full width at sm breakpoint
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
                    <Button fullWidth variant={tier.buttonVariant}>
                      {tier.buttonText}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default adminhome;
