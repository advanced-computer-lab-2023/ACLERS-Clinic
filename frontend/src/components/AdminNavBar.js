import React from "react";
import { Link, useNavigate } from "react-router-dom";
import jwt from "jsonwebtoken-promisified";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  AppBar,
  Toolbar,
} from "@mui/material";
import { styled } from "@mui/system"; // Updated import
import GroupIcon from "@mui/icons-material/Group";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";
import HistoryIcon from "@mui/icons-material/History";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LockIcon from "@mui/icons-material/Lock";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
// Use the `styled` function instead of `makeStyles`
const ContentContainer = styled("div")(({ theme }) => ({
  marginLeft: theme.spacing(7), // Adjust the margin as needed
  padding: theme.spacing(3), // Adjust the padding as needed
}));

const logoImageUrl = "https://i.ibb.co/vP2dX46/el7a2nilogo.png";

const iconMap = {
  Doctors: <SupervisorAccountIcon />,
  Admin: <SupervisedUserCircleIcon />,
  Patients: <PersonOutlineIcon />,
  Applicants: <GroupIcon />,

  ChangePassword: <LockIcon />,
  AddHealthPackage: <LoyaltyIcon />,
  ViewHealthPackages: <HealthAndSafetyIcon />,
};

function AdminNavbar() {
  const token = localStorage.getItem("token");
  const decodedToken = jwt.decode(token);
  console.log("decoded Token:", decodedToken);

  const navigate = useNavigate();

  if (!token) {
    return <div>ACCESS DENIED, You are not authenticated, please log in</div>;
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
        localStorage.removeItem("token");
        navigate("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const menuItems = [
    "Doctors",
    "Patients",
    "Admin",
    "Applicants",
    "AddHealthPackage",
    "ViewHealthPackages",
    "ChangePassword",
  ];

  return (
    <div>
      <Drawer variant="permanent">
        <div style={{ width: "100%" }}>
          <Link to="/admin/dashboard">
            <img
              src={logoImageUrl}
              alt="Drawer Logo"
              style={{ width: "260px" }}
            />
          </Link>
        </div>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item}
              component={Link}
              to={`/admin/${item.toLowerCase()}`}
            >
              <ListItemIcon>{iconMap[item]}</ListItemIcon>
              <ListItemText
                primary={item.replace(/([a-z])([A-Z])/g, "$1 $2")}
              />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}

export default AdminNavbar;
