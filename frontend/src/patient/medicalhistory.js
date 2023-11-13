import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MedicalHistory.css"; // Create a separate CSS file for styling
import jwt from "jsonwebtoken-promisified";

function MedicalHistory() {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");

  const token = localStorage.getItem("token");
  const decodedtoken = jwt.decode(token);
  console.log("decoded Token:", decodedtoken);
  const id = decodedtoken.id;

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

  // const uploadedFileItems = uploadedFiles.map((file, index) => (
  //   <div className="uploaded-file-item" key={index}>
  //     <span>{file.name}</span>
  //   </div>
  // ));

  return (
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
              {/* <div className="uploaded-file-list">{uploadedFileItems}</div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedicalHistory;
