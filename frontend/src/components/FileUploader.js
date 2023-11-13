import React from "react";

function FileUploader({ onFileChange, onUpload, files, uploadStatus }) {
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    onFileChange(newFiles);
  };

  const removeFile = (index) => {
    onFileChange(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      <input
        type="file"
        name="document"
        accept=".pdf, .jpg, .jpeg, .png"
        onChange={handleFileChange}
      />
      <button className="btn btn-primary btn-sm" onClick={onUpload}>
        Upload
      </button>
      <div className="file-list">
        {files.map((file, index) => (
          <div className="file-item" key={index}>
            <span>{file.name}</span>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => removeFile(index)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="upload-status">{uploadStatus}</div>
    </div>
  );
}

export default FileUploader;
