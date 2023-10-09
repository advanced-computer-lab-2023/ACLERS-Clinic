import { useEffect, useState } from "react";
import DoctorDetails from "../../components/doctordetails";

const ViewDoctors = () => {
  const [doctors, setDoctors] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      const response = await fetch("/admin/view-doctors");
      const json = await response.json();

      if (response.ok) {
        setDoctors(json);
      }
    };
    fetchDoctors();
  }, []);
  return (
    <div className="doctorviewer">
      <h1>Doctors</h1>
      {doctors &&
        doctors.map((doctor) => (
          <DoctorDetails key={doctor._id} doctor={doctor} />
        ))}
    </div>
  );
};

export default ViewDoctors;
