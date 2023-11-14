import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MedicalHistory.css"; // Create a separate CSS file for styling
import jwt from "jsonwebtoken-promisified";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function MedicalHistory() {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");
  const [healthRecords, setHealthRecords] = useState([]);
  const [attachments] = useState([]);
  const token = localStorage.getItem("token");
  const decodedToken = jwt.decode(token);
  console.log("decoded Token:", decodedToken);
  const patientId = decodedToken.id;
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch health records when the component mounts
    fetchHealthRecords();
  }, []);
  const removeAttachment = (filename) => {
    // Make a request to remove the attachment
    fetch(`http://localhost:8000/Patient-Home/removeAttachment?filename=${filename}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Attachment removed:", data);
        // Fetch health records again after removing attachment
        fetchHealthRecords();
      })
      .catch((error) => {
        console.error("Error removing attachment:", error);
      });
  };

  const fetchHealthRecords = () => {
    // Make a request to fetch health records
    fetch(`http://localhost:8000/Patient-Home/viewMyHealthRecords`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Health Records:", data);
        setHealthRecords(data);
      })
      .catch((error) => {
        console.error("Error fetching health records:", error);
      });
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles([...files, ...newFiles]);
  };

  const removeFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const uploadFiles = () => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("document", file);
    });

    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    };

    // Send the formData to the server using a fetch request
    fetch("http://localhost:8000/Patient-Home/upload", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log("here is the data:", data);
        setUploadedFiles(data); // Store the uploaded files in state
        setUploadStatus("Upload successful!");

        // Fetch health records again after upload
        fetchHealthRecords();
      })
      .catch((error) => {
        setUploadStatus("Upload failed. Please try again.");
        console.error("Error uploading files:", error);
      });
  };

  const fileItems = files.map((file, index) => (
    <div className="file-item" key={index}>
      <span>{file.name}</span>
      <button
        className="btn btn-danger btn-sm"
        onClick={() => removeFile(index)}
      >
        Remove
      </button>
    </div>
  ));
  if (!token) {
    // Handle the case where id is not available
    return <div>ACCESS DENIED, You are not authenticated, please log in</div>;
  }
  // const uploadedFileItems = uploadedFiles.map((file, index) => (
  //   <div className="uploaded-file-item" key={index}>
  //     <span>{file.name}</span>
  //   </div>
  // ));
  if (decodedToken.role !== "patient") {
    return (
      <div>
        <div>ACCESS DENIED, You are not authenticated, please log in</div>
        <Link to="/login">Login</Link>
      </div>
    );
  }
  return (
    <>
    <button onClick={() => navigate(-1)}>Go Back</button>

    <div className="container">
      <div className="row">
        <div className="col-md-6 mx-auto mt-5">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Medical History</h5>
              <input
                type="file"
                name="document"
                accept=".pdf, .jpg, .jpeg, .png"
                onChange={handleFileChange}
              />
              <button className="btn btn-primary btn-sm" onClick={uploadFiles}>
                Upload
              </button>
              <div className="file-list">{fileItems}</div>
              <div className="upload-status">{uploadStatus}</div>
              <h5 className="card-title">Uploaded Files</h5>
              <h5 className="card-title">Health Records</h5>
              {healthRecords.map((healthRecord, index) => (
                <div className="health-record-item" key={index}>
                  <span>Description: {healthRecord.healthrecord}</span>
                  <div>
                    Attachments:
                    <ul>
                      {healthRecord.attachments.map((attachment, attachmentIndex) => (
                        <li key={attachmentIndex}>
                          <img src={`http://localhost:8000/uploads/${attachment.path.substring(8)}`} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} alt={attachment.filename} />
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => removeAttachment(attachment.filename)}
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default MedicalHistory;
