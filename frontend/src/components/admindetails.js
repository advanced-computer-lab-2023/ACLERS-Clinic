import jwt from "jsonwebtoken-promisified";
const AdminDetails = ({ admin }) => {
  const token = localStorage.getItem("token");
  const decodedToken = jwt.decode(token);
  console.log("decoded Token:", decodedToken);
  const handleClick = async () => {
    console.log("el button etdas");
    console.log(admin._id);

    const url = `/admin/remove-admin?adminId=${admin._id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
    });

    if (response.ok) {
      const json = await response.json();
      console.log(json);
    }
  };

  return (
    <div className="admindetails">
      <h2>{admin.username}</h2>
      <p>{admin.password}</p>
      <button onClick={handleClick}>delete</button>
    </div>
  );
};

export default AdminDetails;
