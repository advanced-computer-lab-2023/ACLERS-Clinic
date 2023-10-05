import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
/* import Doctors from "./Doctors";
import Prescription from "./Prescription"; */
// @ts-ignore
import FamilyMembers from "./FamilyMembers";
// @ts-ignore
import HealthPackages from "./HealthPackages";
const App = () => {
  return (
    <Router>
      <div>
        <h1 style={{ fontSize: "36px" }}>Testing</h1>
      </div>
      <div>
        {/* Include the Navbar component */}
        <Navbar />

        {/* Define your routes */}
        <Routes>
          <Route path="/family-members" component={FamilyMembers} />
          <Route path="/health-packages" component={HealthPackages} />
          {/* <Route path="/doctors" component={Doctors} />
          <Route path="/prescription" component={Prescription} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
