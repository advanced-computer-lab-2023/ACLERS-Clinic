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
} from "@mui/material";
import jwt from "jsonwebtoken-promisified";
import { Link, useNavigate } from "react-router-dom";

const SubscribedHealthPackages = () => {
  const [subscribedPackages, setSubscribedPackages] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [familyMemberHealthPackages, setFamilyMemberHealthPackages] = useState(
    []
  );

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decodedtoken = jwt.decode(token);
  const id = decodedtoken.id;
  const patientId = id;
  useEffect(() => {
    const fetchFamilyMemberHealthPackages = async (familyMemberId) => {
      try {
        function getType(variable) {
          return typeof variable;
        }
        console.log(
          "family member id el type beta3o :",
          getType(familyMemberId)
        );
        console.log("family member id :", familyMemberId);
        // const parsedFamilyMemberId = parseInt(familyMemberId);
        // console.log(
        //   "parsed family member id el type beta3o :",
        //   getType(parsedFamilyMemberId)
        // );
        // console.log("parsed family member id :", parsedFamilyMemberId);
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
        if (Array.isArray(data)) {
          console.log("data fam members :", data);

          setFamilyMemberHealthPackages((prevPackages) => [
            ...prevPackages,
            { familyMemberId, healthPackages: data },
          ]);
        } else if (typeof data === "object" && data !== null) {
          console.log("data fam members :", data);
          setFamilyMemberHealthPackages((prevPackages) => [
            ...prevPackages,
            { familyMemberId, healthPackages: [data] },
          ]);
        } else {
          console.error("Invalid response format:", data);
        }
      } catch (error) {
        console.error("Error fetching family member health packages:", error);
      }
    };

    // Fetch health packages for each family member
    familyMembers.forEach((familyMember) => {
      console.log("BOS HENAAAAAAAAA: ", familyMember._id);
      fetchFamilyMemberHealthPackages(familyMember._id);
    });
  }, [token, familyMembers]);

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

      function getType(variable) {
        return typeof variable;
      }
      console.log("patient id el type beta3o :", getType(patientId));
      console.log("patient id :", patientId);

      fetch(
        `http://localhost:8000/Patient-home/viewSubscribedHealthPackage?id=${patientId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setSubscribedPackages(data);
          } else if (typeof data === "object" && data !== null) {
            setSubscribedPackages([data]);
          } else {
            console.error("Invalid response format:", data);
          }
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
          console.log("Family members:", data.familyMembers);
        })
        .catch((error) => {
          console.error("Error fetching family members:", error);
        });
    };

    fetchSubscribedPackages();
    fetchFamilyMembers();
  }, [token, id, patientId]);

  const handleCancelSubscription = (packageId) => {
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

  if (decodedtoken.role !== "patient") {
    return (
      <div>
        <div>ACCESS DENIED, You are not authenticated, please log in</div>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: "auto", marginTop: 50 }}>
      <button onClick={() => navigate(-1)}>Go Back</button>
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
                      color="secondary"
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
              <TableCell>Family Member ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Health Package ID</TableCell>
              {/* Add more columns as needed */}
            </TableRow>
          </TableHead>
          <TableBody>
            {(Array.isArray(familyMembers) ? familyMembers : []).map(
              (familyMember, index) => (
                <TableRow key={index}>
                  <TableCell>{familyMember._id}</TableCell>
                  <TableCell>{familyMember.name}</TableCell>
                  <TableCell>
                    {(
                      familyMemberHealthPackages.find(
                        (packageData) =>
                          packageData.familyMemberId === familyMember._id
                      )?.healthPackages || []
                    ).map((healthPackage) => (
                      <div key={healthPackage._id}>{healthPackage._id}</div>
                    ))}
                  </TableCell>
                  {/* Add more cells for additional columns */}
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="contained" color="primary" style={{ marginTop: 20 }}>
        Go Back to Dashboard
      </Button>
    </div>
  );
};

export default SubscribedHealthPackages;
