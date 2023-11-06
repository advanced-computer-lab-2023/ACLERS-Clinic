import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MedicalHistory.css"; // Create a separate CSS file for styling

function MedicalHistory() {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles([...files, ...newFiles]);
  };

  const removeFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
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

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 mx-auto mt-5">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Medical History</h5>
              <input
                type="file"
                className="form-control"
                multiple
                accept=".pdf, .jpg, .jpeg, .png"
                onChange={handleFileChange}
              />
              <div className="file-list">{fileItems}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedicalHistory;
