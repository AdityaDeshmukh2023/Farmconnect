import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./dairycompo.css";
import { dairyData } from "../../dummyData";

const DairyCompo = () => {
  const { id } = useParams(); // Retrieve the ID from the route parameters
  const [showExtraContent, setShowExtraContent] = useState(false);

  const dairyItem = dairyData[id]; // Retrieve data for the selected ID

  if (!dairyItem) {
    return <div>Dairy item not found!</div>;
  }

  const toggleExtraContent = () => {
    setShowExtraContent(!showExtraContent);
  };

  return (
    <div className="dairyWrapper">
      

      <div className="content">
        <div className="main-content">
          <div className="dairy-text-section">
            <h1 className="dairy-title">{dairyItem.title}</h1>
            <img
            src={dairyItem.images[0]} // Use the first image for main display
            alt={`${dairyItem.title}`}
            className="dairy-main-image"
          />
            <p className="dairy-description">{dairyItem.description}</p>
            <button
              className="dairy-btn"
              id="toggleButton"
              onClick={toggleExtraContent}
            >
              {showExtraContent ? "Show Less" : "Learn More"}
            </button>
          </div>
        </div>

        {showExtraContent && (
          <div className="dairy-extra-content" id="extraContent">
            {dairyItem.extraContent?.map((content, index) => (
              <div key={index}>
                <p>
                  <strong>{content.heading}:</strong>{" "}
                  {Array.isArray(content.details) ? (
                    <ul className="dairy-control-list">
                      {content.details.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    content.details
                  )}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DairyCompo;
