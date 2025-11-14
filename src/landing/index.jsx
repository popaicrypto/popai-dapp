import React from 'react';
import { useNavigate } from 'react-router-dom';
import './landing.css';

export default function Landing() {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/input');
  };

  return (
    <div className="fw-landing">
      <div className="inner-landing">
        <div>
          <img src="/character-popeye.png" className="popeye" alt="Popeye" />
        </div>

        <div className="title-texts">
          <img src="/popai-title.png" className="popeye-title" alt="popAI" />
          <h2>
            Predict the future price action of any
            <span>
              {' '}
              <img src="/bsc-logo.png" className="bsc-logo" alt="BSC" />
            </span>{' '}
            BSC Token
          </h2>
        </div>

        <div className="lower-div">
          <button type="button" className="next-button2" onClick={handleNext}>
            Next &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
