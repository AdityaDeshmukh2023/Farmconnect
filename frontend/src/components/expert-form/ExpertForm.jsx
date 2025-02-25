import React from 'react';
import './expertform.css';
import { useNavigate } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';  

export default function ExpertForm() {
    const navigate = useNavigate(); 

    const handleOnClick = (e) => {
        e.preventDefault(); 
        navigate('/application/experts-page'); 
    };
    const handleOnClickRequest = (e) => {
        e.preventDefault(); 
        navigate('/application/my-requests'); 
    };

    return (
        <div className='expertform'>
            <div className="requests-icon" onClick={handleOnClickRequest}>
                <FiMail size={30} color="#fff" className="ebell-icon" />
                <h4>My Requests</h4>
            </div>
            <h1 className='expertformHeading'>Connect with an Expert</h1>
            <div className="expertformWrapper">
                <form id="expertForm">
                    <label htmlFor="field" className='expertformLabel'>Select Field of Expertise:</label>
                    <select id="expert-field" className='expertformSelect' required>
                        <option className='expertformOption' value="" disabled selected>Choose a field</option>
                        <option className='expertformOption' value="irrigation">Irrigation</option>
                        <option className='expertformOption' value="crop_diseases">Crop Diseases</option>
                        <option className='expertformOption' value="soil_health">Soil Health</option>
                        <option className='expertformOption' value="market_analysis">Market Analysis</option>
                    </select>

                    <label className='expertformLabel' htmlFor="language">Preferred Language:</label>
                    <select id="language" className='expertformSelect' required>
                        <option className='expertformOption' value="" disabled selected>Choose a language</option>
                        <option className='expertformOption' value="english">English</option>
                        <option className='expertformOption' value="hindi">Hindi</option>
                        <option className='expertformOption' value="marathi">Marathi</option>
                        <option className='expertformOption' value="telugu">Telugu</option>
                    </select>

                    <label htmlFor="query" className='expertformLabel'>Your Query:</label>
                    <textarea id="query" rows="5" placeholder="Enter your query here..." required className='expertformTextarea'></textarea>

                    <button onClick={handleOnClick} className='expertformButton'>Submit</button>
                </form>
            </div>
        </div>
    );
}
