import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './results.css';

export default function ResultsImageOnly() {
  const navigate = useNavigate();
  const { state } = useLocation() || {};

  const { ca, lambda1, lambda2 } = state || {};
  const imageUrl = lambda2?.body?.imageUrl;
  const recommendation = lambda1?.body?.recommendation?.toLowerCase();

  const getPopeyeReaction = () => {
    switch (recommendation) {
      case 'strong sell':
      case 'sell':
        return '/sell.png';
      case 'neutral':
        return '/neutral.png';
      case 'buy':
      case 'strong buy':
        return '/strong-buy-gif.gif';
      default:
        return '/character-popeye.png';
    }
  };

  if (!ca) {
    return (
      <div className="fw-results">
        <div className="no-ca-box">
          <p>No contract address provided.</p>
          <button onClick={() => navigate('/input')}>Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className='fw-results'>
      <div className='inner-results'>
        <img src={getPopeyeReaction()} className="popeye3" alt="Popeye Reaction" />
        <img src='/spinach2.png' className='spinach' alt="spinach" />

        <div className='chart-title'>
          <h2 className='chart-predicted'>Predicted Chart</h2>
          <h2 className='recommendation'>
            Recommendation: <span className={`rec-${recommendation}`}>{recommendation}</span>
          </h2>
        </div>

        <div>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Predicted Chart"
              className="results-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/fallback-chart.png';
              }}
            />
          ) : (
            <img src="/fallback-chart.png" alt="Fallback Chart" className="results-image" />
          )}
        </div>

        <div className='buttons-results'>
          <button className='share-btn'>Share</button>
          <button
            className='analysis-btn'
            onClick={() => navigate('/analysis', { state })}
          >
            Analysis &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
