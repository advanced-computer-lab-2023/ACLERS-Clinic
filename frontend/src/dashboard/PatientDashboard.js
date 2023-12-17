import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
//import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { mainListItems, secondaryListItems } from "./listItems";
import Chart from "./Chart";
import Deposits from "./Deposits";
import Orders from "./Orders";
import { Link, useNavigate } from "react-router-dom";
import jwt from "jsonwebtoken-promisified";
import PatientNavbar from "../components/PatientNavbar";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Portal from "@mui/material/Portal";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: 0,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Dashboard() {
  const [open, setOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState([]);
  const [unreadCount, setUnreadCount] = React.useState(0);

  const [isNotificationCardOpen, setIsNotificationCardOpen] =
    React.useState(false);
  const token = localStorage.getItem("token");
  const decodedToken = jwt.decode(token);
  console.log("decoded Token:", decodedToken);

  const navigate = useNavigate();
  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/Patient-Home/get-notifications",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setNotifications(data);
          setUnreadCount(data.length); // Set initial unread count
        } else {
          console.error("Failed to fetch notifications");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [token]);
  const handleNotificationIconClick = () => {
    setUnreadCount(0);
    setIsNotificationCardOpen((prev) => !prev);
    setOpen((prev) => !prev); // Toggle the card visibility
  };

  if (!token) {
    // Handle the case where id is not available
    return <div>ACCESS DENIED, You are not authenticated, please log in</div>;
  }
  if (decodedToken.role !== "patient") {
    return <div>ACCESS DENIED, You are not an patient</div>;
  }

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Successfully logged out
        localStorage.removeItem("token");
        navigate("/"); // Redirect to the login or home page
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <PatientNavbar />

      <div style={{ marginLeft: "240px", padding: "20px" }}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar zIndex="-1000" open={open}>
            <Toolbar
              sx={{
                pr: "24px", // keep right padding when drawer closed
              }}
            >
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                Dashboard
              </Typography>

              <IconButton color="inherit" onClick={handleNotificationIconClick}>
                <Badge badgeContent={unreadCount} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Toolbar>
          </AppBar>
          {open && (
            <Portal>
              {isNotificationCardOpen && (
                <Card
                  id="notification-card"
                  style={{
                    position: "fixed",
                    top: 64, // Adjust the position based on your layout
                    right: 16,
                    zIndex: 1000,
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Notifications
                    </Typography>
                    {notifications.map((message, index) => (
                      <Typography key={index}>{message}</Typography>
                    ))}
                  </CardContent>
                </Card>
              )}
            </Portal>
          )}

          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Grid container spacing={3}>
                {/* Chart */}
                <Grid item xs={12} md={8} lg={9}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      height: 240,
                    }}
                  >
                    <Chart />
                  </Paper>
                </Grid>
                {/* Recent Deposits */}
                <Grid item xs={12} md={4} lg={3}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      height: 240,
                    }}
                  >
                    <Deposits />
                  </Paper>
                </Grid>
                {/* Recent Orders */}
                <Grid item xs={12}>
                  <Paper
                    sx={{ p: 2, display: "flex", flexDirection: "column" }}
                  >
                    <Orders />
                  </Paper>
                </Grid>
              </Grid>
              <Copyright sx={{ pt: 4 }} />
            </Container>
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
}
