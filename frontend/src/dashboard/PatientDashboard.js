function PatientDashBoard() {
  const gridRef = useRef();
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    { field: "name" },
    { field: "speciality" },
    { field: "hourlyRate" },
    { field: "appointmentDate" },
    { field: "affiliation" },
    { field: "educationalBackground" },
  ]);
  const defaultColDef = useMemo(() => ({}), []);
  useEffect(() => {
    fetch("http://localhost:8000/Patient-home/view-doctors")
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData));
  }, []);
  return (
    <div className="ag-theme-alpine" style={{ height: "100%" }}>
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        animateRows={true}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
      ></AgGridReact>
    </div>
  );
}

export default PatientDashBoard;
