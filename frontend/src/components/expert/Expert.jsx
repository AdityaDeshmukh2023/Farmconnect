import React, { useState } from 'react';
import './expert.css';

export default function Expert({ Expert }) {
  const [requestSent, setRequestSent] = useState(false);

  const handleSendRequest = () => {
    setRequestSent(true);
    alert('Request Sent Successfully'); 
  };

  return (
    <div className='expert'>
      <div className="expertcard">
        <img className='expert-img' src={Expert.profilePicture} alt='Expert' />
        <div className="expert-card-body">
          <h3 className='expertname'>{Expert.name}</h3>
          <p className='expertdetails'><strong>Specialty:</strong> {Expert.specialty}</p>
          <p className='expertdetails'><strong>Experience:</strong> {Expert.experience}</p>
          <p className='expertdetails'><strong>Location:</strong> {Expert.location}</p>
          <button 
            className={`expert-button ${requestSent ? 'sent' : ''}`} 
            onClick={handleSendRequest}
            disabled={requestSent}
          >
            {requestSent ? '✔' : 'Send Request'}
          </button>
        </div>
      </div>
    </div>
  );
}
