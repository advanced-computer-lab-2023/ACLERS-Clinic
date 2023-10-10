import { useEffect, useMemo } from "react";
import { Box } from "@mui/material";
import { Typography } from "@mui/material/styles/createTypography";
import { DataGrid } from "@mui/x-data-grid";
import { useValue } from "../context/ContextProvider";
import DoctorDetails from "../components/doctordetails";
import ViewDoctors from "../admin/viewdoctors/viewdoctors";

const Doctors = ({ setSelectedLink, link }) => {
  const {
    state: { doctors },
    dispatch,
  } = useValue();
  useEffect(() => {
    setSelectedLink(link);
    if (doctors.length === 0) ViewDoctors(dispatch);
  }, []);

const columns = useMemo(() => [
    {field: 'name', headerName: 'Name', width: 100},
    {field: 'educationalBackground', headerName: 'Speciality', width: 100},
    {field: 'ses', headerName: 'Email', width: 100},
], []))

  return (
    <Box
      sx={{
        height: 400,
        width: "100%",
      }}
    >
      <Typography
        variant="h3"
        component="h3"
        sx={{ textAlign: "center", mt: 3, mb: 3 }}
      >
        Doctors
      </Typography>
      <DataGrid
        columns={[
          { field: "id", headerName: "ID", width: 70 },
          {
            field: "firstName",
            headerName: "First name",
            width: 130,
            editable: true,
          },
          {
            field: "lastName",
            headerName: "Last name",
            width: 130,
            editable: true,
          },
          {
            field: "age",
            headerName: "Age",
            type: "number",
            width: 90,
            editable: true,
          },
        ]}
        rows={doctors}
        pageSize={5}
        rowsPerPageOptions={[5]}
      ></DataGrid>
    </Box>
  );
};
export default Doctors;
