const AdminDetails = ({ admin }) => {
  const handleClick = async () => {
    console.log("el button etdas");
    console.log(admin._id);

    const url = `/admin/remove-admin?adminId=${admin._id}`;
    const response = await fetch(url, {
      method: "DELETE",
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
