import './schemeslider.css'
import { useState, useEffect } from "react";
export default function ShemeSlider() {
  const [schemesArray, setSchemesArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const apiKey = "AIzaSyCc1pbU3Zag-CEqQxoc6Qecw-WEUKZAwa8";
  const prompt = "Provide me any 10 agriculture schemes details from India and their description";

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const { GoogleGenerativeAI } = await import("https://cdn.jsdelivr.net/npm/@google/generative-ai/+esm");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const responseText = await result.response.text();
        const items = responseText.split("\n").filter((item) => item.trim() !== "");
        setSchemesArray(items);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching schemes:", error);
        setSchemesArray([]);
        setIsLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  return (
    <div className="agriculture-slider-container">
      {isLoading ? (
        <div className="agriculture-slider-loading">Loading schemes...</div>
      ) : schemesArray.length > 0 ? (
        <div className="agriculture-slider-items">
          {schemesArray.map((scheme, index) => {
            const [name, description] = scheme.split(":");
            return (
              <div className="agriculture-slider-item" key={index}>
                <div className="agriculture-slider-item-title">{name || "Scheme Name"}</div>
                <div className="agriculture-slider-item-description">
                  {description || "No description available."}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="agriculture-slider-loading">
          No schemes found. Please try again later.
        </div>
      )}
    </div>
  );
}
