import './cropprediction.css'
import { useState } from "react";


const cropIcons = {
  Wheat: "fas fa-seedling",
  Rice: "fas fa-water",
  Corn: "fas fa-tractor",
  Potato: "fas fa-carrot",
  Tomato: "fas fa-apple-alt",
  Soybean: "fas fa-leaf",
};
export default function CropPrediction() {
  const [inputs, setInputs] = useState({ n: '', p: '', k: '', temperature: '', humidity: '', ph: '', rainfall: '' });
  const [predictions, setPredictions] = useState([]);
  const [resultsVisible, setResultsVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const mockPredictions = ["Wheat", "Rice", "Maize"]; 
    setPredictions(mockPredictions);
    setResultsVisible(true);
  };

  return (
    <div className="crop-prediction-page">
      
      <section className="crop-hero">
        <div className="crop-content">
          <h1>Predict Best Crops</h1>
          <p>Input soil and weather details to get recommendations for suitable crops.</p>
        </div>
        <img src='/assets/crop-prediction/soil-anylisis.png' alt="Soil Analysis" className="crop-hero-image" />
      </section>
      
      <section className="crop-input-section">
        <div className="crop-input-container">
          <h2>Enter Soil and Weather Details</h2>
          <form onSubmit={handleSubmit} className="crop-input-form">
            {[
              { label: "N (Nitrogen)", name: "n", unit: "mg/kg" },
              { label: "P (Phosphorus)", name: "p", unit: "mg/kg" },
              { label: "K (Potassium)", name: "k", unit: "mg/kg" },
              { label: "Temperature", name: "temperature", unit: "°C" },
              { label: "Humidity", name: "humidity", unit: "%" },
              { label: "pH Level", name: "ph", unit: "pH" },
              { label: "Rainfall", name: "rainfall", unit: "mm" },
            ].map(({ label, name, unit }, index) => (
              <div className="crop-input-group" key={index}>
                <label htmlFor={name}>{label}:</label>
                <input 
                  type="number" 
                  id={name} 
                  name={name} 
                  value={inputs[name]} 
                  onChange={handleChange} 
                  placeholder={`Enter ${label.split(" ")[0]} (${unit})`} 
                  required 
                />
              </div>
            ))}
            <button type="submit" className="crop-submit-button">Predict Crops</button>
          </form>
        </div>
      </section>

      {resultsVisible && (
        <section className="crop-results-section">
          <div className="crop-results">
            <h2>Predicted Crops</h2>
            {predictions.map((crop, index) => (
              <div className="crop-result-card" key={index}>
                <i className={cropIcons[crop] || "fas fa-leaf"}></i>
                <p>{crop}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
