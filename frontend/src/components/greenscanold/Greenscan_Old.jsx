import './greenscan.css'
import  { useState } from "react";
export default function Greenscan() {
  const [image, setImage] = useState(null);
  const [resultsVisible, setResultsVisible] = useState(false);

  const handleFile = (file) => {
    if (file) {
      // Log the MIME type of the file to inspect it
      console.log("File Type: ", file.type);
    
      // Check if the file is an image by MIME type
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.onload = () => {
          setImage(reader.result);
          setResultsVisible(true);
        };

        reader.onerror = (error) => {
          console.error("Error reading file:", error);
          alert("An error occurred while reading the file.");
        };

        reader.readAsDataURL(file);
      } else {
        alert("Please upload a valid image file (jpg, jpeg, png, etc.).");
      }
    } else {
      alert("No file selected.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.target.classList.add("drag-over");
  };

  const handleDragLeave = (e) => {
    e.target.classList.remove("drag-over");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="greenscan">
     
      <section className="hero">
        <div className="content">
          <h1>Get Crop Insights with GreenScan</h1>
          <p>Upload a crop image to detect diseases and get expert recommendations instantly.</p>
          <button id="uploadButton" className="cta-button">Upload Image</button>
        </div>
        <img src='/assets/greenscan/greensacn.png' alt="Healthy Crops" className="hero-image" />
      </section>

      <section className="upload-section">
        <div className="upload-area">
          <h2>Upload Your Crop Image</h2>
          <div
            id="dropArea"
            className="drop-area"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <i className="fas fa-cloud-upload-alt"></i>
            <p>Drag & drop an image here or click to upload</p>
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={(e) => handleFile(e.target.files[0])}
              style={{ display: "none" }}
            />
          </div>
          {image && <img src={image} alt="Preview" className="preview" />}
        </div>
      </section>

      {resultsVisible && (
        <section className="results-section">
          <div id="results" className="results">
            <h2>Analysis Results</h2>
            <div className="result-card">
              <i className="fas fa-bug"></i>
              <p><strong>Disease:</strong> Powdery Mildew</p>
              <p><strong>Severity:</strong> Moderate</p>
            </div>
            <div className="result-card">
              <i className="fas fa-leaf"></i>
              <p><strong>Recommendations:</strong></p>
              <ul>
                <li>Use sulfur-based fungicides</li>
                <li>Ensure proper ventilation in crops</li>
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
