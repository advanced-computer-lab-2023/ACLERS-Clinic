import { useEffect, useState } from "react";
import AdminDetails from "../../components/admindetails";
import jwt from "jsonwebtoken-promisified";
const ViewAdmins = () => {
  const [admins, setAdmins] = useState(null);
  const token = localStorage.getItem("token");
  const decodedToken = jwt.decode(token);
  console.log("decoded Token:", decodedToken);
  useEffect(() => {
    const fetchAdmins = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch("http://localhost:8000/admin/view-admins",requestOptions);
      const json = await response.json();

      if (response.ok) {
        setAdmins(json);
      }
    };
    fetchAdmins();
  }, []);
  if (!token ) {
    // Handle the case where id is not available
    return <div>ACCESS DENIED, You are not authenticated, please log in</div>;
  }
  if(decodedToken.role !=="admin"){
    return <div>ACCESS DENIED, You are not authorized</div>;
  }
  return (
    <div className="adminviewer">
      <h1>Admins</h1>
      {admins &&
        admins.map((admin) => <AdminDetails key={admin._id} admin={admin} />)}
    </div>
  );
};

export default ViewAdmins;
