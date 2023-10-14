import { useEffect, useState } from "react";
import PatientDetails from "../../components/patientdetails";
import { useNavigate } from "react-router-dom";

const ViewPatients = () => {
  const [patients, setPatients] = useState(null);
  const navigate =useNavigate()
  useEffect(() => {
    const fetchPatients = async () => {
      const response = await fetch("/admin/view-patients");
      const json = await response.json();

      if (response.ok) {
        setPatients(json);
      }
    };
    fetchPatients();
  }, []);
  return (
    <div className="patientviewer">
       <button onClick={() => navigate(-1)}>Go Back</button>
      <h1>Patients</h1>
      {patients &&
        patients.map((patient) => (
          <PatientDetails key={patient._id} patient={patient} />
        ))}
    </div>
  );
};

export default ViewPatients;
