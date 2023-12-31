import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography
} from "@mui/material";
import {
  // ... other imports
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,

} from "@mui/material";
import jwt from "jsonwebtoken-promisified";
import { Link, useNavigate } from "react-router-dom";
import PatientNavbar from "../components/PatientNavbar";

const SubscribedHealthPackages = () => {
  const [subscribedPackages, setSubscribedPackages] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [familyMemberHealthPackages, setFamilyMemberHealthPackages] = useState(
    []
  );
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelPackageId, setCancelPackageId] = useState(null);
  const [familyMemberId,setFamilyMemberId] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decodedtoken = jwt.decode(token);
  const id = decodedtoken.id;
  const patientId = id;
  const openCancelDialog = (packageId) => {
    setCancelPackageId(packageId);
    setCancelDialogOpen(true);
  };
  const handleCancelSubscription = (packageId) => {
  openCancelDialog(packageId);
};

const handleCancelSubscriptionFamilyMember = (familyMemberId, packageId) => {
  openCancelDialog(packageId);
  setFamilyMemberId(familyMemberId);
};
  useEffect(() => {
    // Fetch subscribed health packages for the patient
    const fetchSubscribedPackages = () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      fetch(
        `http://localhost:8000/Patient-home/viewSubscribedHealthPackage?id=${patientId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          setSubscribedPackages(data);
        })
        .catch((error) => {
          console.error("Error fetching subscribed health packages:", error);
        });
    };

    // Fetch family members
    const fetchFamilyMembers = () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      fetch(
        `http://localhost:8000/Patient-Home/view-fam-member?patientId=${patientId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          setFamilyMembers(data.familyMembers);
        })
        .catch((error) => {
          console.error("Error fetching family members:", error);
        });
    };

    fetchSubscribedPackages();
    fetchFamilyMembers();
  }, [token, id, patientId]);

  useEffect(() => {
    // Fetch health packages for each family member
    const fetchFamilyMemberHealthPackages = async (familyMemberId) => {
      try {
        const response = await fetch(
          `http://localhost:8000/Patient-Home/view-HealthPack-FamMember?FamMemId=${familyMemberId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setFamilyMemberHealthPackages((prevPackages) => [
          ...prevPackages,
          { familyMemberId, healthPackages: data },
        ]);
      } catch (error) {
        console.error("Error fetching family member health packages:", error);
      }
    };

    // Fetch health packages for each family member
    familyMembers.forEach((familyMember) => {
      fetchFamilyMemberHealthPackages(familyMember.memberId);
    });
    console.log(familyMemberHealthPackages+"packkkkkkk")
  }, [token, familyMembers]);

  const handleCancelSubscription1 = (packageId) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ packageId }),
    };

    fetch(
      `http://localhost:8000/Patient-home/cancel-subscription?id=${patientId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Subscription canceled:", data);
        // Refresh the page after canceling the subscription
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error canceling subscription:", error);
      });
  };
  const handleCancelSubscriptionFamilyMember1 = (familyMemberId, packageId) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ packageId }),
    };

    fetch(
      `http://localhost:8000/Patient-home/cancel-subscription-famMem?id=${patientId}&famMemId=${familyMemberId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Subscription canceled for family member:", data);
        // Refresh the page after canceling the subscription
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error canceling subscription for family member:", error);
      });
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
    <div style={{ marginLeft: "290px" }}>
      <PatientNavbar />

      <div>
        <h2>Subscribed Health Packages</h2>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Package ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date of Subscription</TableCell>
                <TableCell>Renewal Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subscribedPackages.map((healthPackage, index) => (
                <TableRow key={index}>
                  <TableCell>{healthPackage._id}</TableCell>
                  <TableCell>{healthPackage.status}</TableCell>
                  <TableCell>{healthPackage.dateOfSubscription}</TableCell>
                  <TableCell>{healthPackage.renewalDate}</TableCell>
                  <TableCell>{healthPackage.endDate}</TableCell>
                  <TableCell>
                    {healthPackage.status !== "cancelled" && (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() =>
                          handleCancelSubscription(healthPackage._id)
                        }
                      >
                        Cancel Subscription
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <h2>Family Members' Health Packages</h2>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Relation To Patient</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date of Subscription</TableCell>
                <TableCell>Renewal Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(Array.isArray(familyMembers) ? familyMembers : []).map(
                (familyMember, index) => (
                  <React.Fragment key={index}>
                    {(
                      familyMemberHealthPackages.find(
                        (packageData) =>
                          packageData.familyMemberId === familyMember.memberId
                      )?.healthPackages || []
                    ).map((healthPackage) => (
                      <TableRow key={healthPackage._id}>
                        <TableCell>{familyMember.name}</TableCell>
                        <TableCell>{familyMember.relationToPatient}</TableCell>

                        <TableCell>{healthPackage.status}</TableCell>
                        <TableCell>
                          {healthPackage.dateOfSubscription}
                        </TableCell>
                        <TableCell>{healthPackage.renewalDate}</TableCell>
                        <TableCell>{healthPackage.endDate}</TableCell>
                        <TableCell>
                          {healthPackage.status === "subscribed" && (
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() =>
                                handleCancelSubscriptionFamilyMember(
                                  familyMember.memberId,
                                  healthPackage._id
                                )
                              }
                            >
                              Cancel Subscription
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                )
              )}
            </TableBody>
          </Table>
          <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
  <DialogTitle>Cancel Subscription</DialogTitle>
  <DialogContent>
    <Typography>
      Are you sure you want to cancel this subscription?
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setCancelDialogOpen(false)} color="primary">
      No
    </Button>
    <Button
      onClick={async () => {
        setCancelDialogOpen(false);
        // Apply the logic for canceling the subscription using cancelPackageId
        if (cancelPackageId) {
          // Call your cancel subscription API here
          if(familyMemberId){
            handleCancelSubscriptionFamilyMember1(
              familyMemberId,
              cancelPackageId
            )
          }else{
          await handleCancelSubscription1(cancelPackageId);
          }
        }
      }}
      color="primary"
    >
      Yes
    </Button>
  </DialogActions>
</Dialog>
        </TableContainer>
      </div>
    </div>
  );
};

export default SubscribedHealthPackages;
