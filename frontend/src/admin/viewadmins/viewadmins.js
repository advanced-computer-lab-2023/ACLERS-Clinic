import { useEffect, useState } from "react";
import AdminDetails from "../../components/admindetails";

const ViewAdmins = () => {
  const [admins, setAdmins] = useState(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      const response = await fetch("/admin/view-admins");
      const json = await response.json();

      if (response.ok) {
        setAdmins(json);
      }
    };
    fetchAdmins();
  }, []);
  return (
    <div className="adminviewer">
      <h1>Admins</h1>
      {admins &&
        admins.map((admin) => <AdminDetails key={admin._id} admin={admin} />)}
    </div>
  );
};

export default ViewAdmins;
