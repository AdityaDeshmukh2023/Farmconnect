import './greenscan.css';
import { useState } from "react";

export default function Greenscan() {
  const [image, setImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [resultsVisible, setResultsVisible] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = (file) => {
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result);
          setUploadedFile(file);
          setError(null);
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
    e.currentTarget.classList.add("drag-over");
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("drag-over");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
    handleFile(e.dataTransfer.files[0]);
  };

  const handlePredict = async () => {
    if (!uploadedFile) {
      alert("Please upload an image first");
      return;
    }

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('image', uploadedFile);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/greenscan/analyze/', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.analysis || !data.analysis.recommendations) {
        throw new Error('Invalid response format from server');
      }

      setAnalysis(data.analysis);
      setResultsVisible(true);
    } catch (error) {
      console.error("Error analyzing image:", error);
      alert("Failed to analyze image. Please try again.");
      setResultsVisible(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="greenscan">
      <section className="hero">
        <div className="content">
          <h1>Get Crop Insights with GreenScan</h1>
          <p>Upload a crop image to detect diseases and get expert recommendations instantly.</p>
          <button id="uploadButton" className="cta-button" onClick={() => document.getElementById("fileInput").click()}>
            Upload Image
          </button>
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
          {image && (
            <>
              <img src={image} alt="Preview" className="preview" />
              <button 
                className="cta-button" 
                onClick={handlePredict}
                disabled={loading}
              >
                {loading ? 'Analyzing...' : 'Predict Disease'}
              </button>
            </>
          )}
        </div>
      </section>

      {resultsVisible && analysis && (
        <section className="results-section">
          <div id="results" className="results">
            <h2>Analysis Results</h2>
            <div className="result-card">
              <i className="fas fa-bug"></i>
              <p><strong>Disease:</strong> {analysis.disease || 'Unknown'}</p>
              <p><strong>Severity:</strong> {analysis.severity || 'Unknown'}</p>
            </div>
            <div className="result-card">
              <i className="fas fa-leaf"></i>
              <p><strong>Recommendations:</strong></p>
              <ul>
                {analysis.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
