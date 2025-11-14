import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './analysis.css';

export default function ResultsAnalysisOnly() {
  const navigate = useNavigate();
  const { state } = useLocation() || {};
  const { ca, lambda1 } = state || {};
  const body = lambda1?.body;

  // Guard when missing CA
  if (!ca) {
    return (
      <div className="analysis-container">
        <div style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', padding: 16, borderRadius: 12 }}>
          <p>No contract address provided.</p>
          <button onClick={() => navigate('/input')}>Back</button>
        </div>
      </div>
    );
  }

  // ----- Dynamic fields from the model JSON -----
  const sentiment = (body?.sentiment || '').toLowerCase();           // "bullish" | "bearish"
  const trend = (body?.trend || '').toLowerCase();                    // "continue" | "reversal"
  const recommendation = (body?.recommendation || '').toLowerCase();  // strong buy | buy | neutral | sell | strong sell
  const indicatorAnalyses =
    body?.indicator_analyses ||
    "The latest RSI is at 77.95, indicating strong bullish momentum as it approaches the overbought zone. MA shows a slight upward trend, with the latest value at 0.001586, supporting the bullish sentiment. Bollinger Bands show price moving towards the upper band, suggesting increased volatility and bullish pressure. The MACD is positive at 0.000108, with a widening gap between FastMACD (0.000084) and SlowMACD (0.000048), further indicating bullish momentum. The LP is locked, providing some security.";
  const lpl = Number(body?.lpl);
  const lplValid = Number.isFinite(lpl);
  const lplPct = lplValid ? (lpl * 100).toFixed(2) : null;
  const isLocked = lplValid ? lpl > 0.9 : false;
  const honeypot = !!body?.honeypot;

  // ----- Sentiment pills -----
  const bullishClass = sentiment === 'bullish' ? 'pill bullish-active' : 'pill inactive';
  const bearishClass = sentiment === 'bearish' ? 'pill bearish-active' : 'pill inactive';

  // ----- Trend pills -----
  const continueClass = trend === 'continue' ? 'pill continue-active' : 'pill inactive';
  const reversalClass = trend === 'reversal' ? 'pill reversal-active' : 'pill inactive';

  // ----- Liquidity pill -----
  const liquidityText = lplValid
    ? `${isLocked ? 'Locked' : 'Unlocked'} (${lplPct}%)`
    : 'N/A';
  const liquidityClass = isLocked ? 'pill status-green' : 'pill status-red';

  // ----- Honeypot pill -----
  const honeypotText = honeypot ? 'Honeypot' : 'No Honeypot';
  const honeypotClass = honeypot ? 'pill status-red' : 'pill status-green';

  // ----- Suggested actions (recommendation) -----
  const recToClass = (recKey) => {
    const isActive = recKey === recommendation;
    if (!isActive) return 'suggest-pill inactive';

    switch (recKey) {
      case 'strong buy':
      case 'buy':
        return 'suggest-pill rec-green-active';
      case 'neutral':
        return 'suggest-pill rec-orange-active';
      case 'sell':
      case 'strong sell':
        return 'suggest-pill rec-red-active';
      default:
        return 'suggest-pill inactive';
    }
  };

  return (
    <div className="fw-analysis">
      <div className='inner-analysis'>
        <h2 className='title-analysis'>PopAI Analysis</h2>

        <div className='analysis-overview'>
          {/* LEFT SIDE */}
          <div className='left-analysis'>
            <div className='text-analysis'>
              <h2>Analysis</h2>
              <p>{indicatorAnalyses}</p>

              {/* Sentiment pills */}
              <div className='bullbear'>
                <h2 className={bullishClass}>Bullish</h2>
                <h2 className={bearishClass}>Bearish</h2>
              </div>
            </div>

            <div className='trend-patterns'>
              <h2>Trend Pattern</h2>
              <div className='trend-analyse'>
                <h2 className={continueClass}>Continue</h2>
                <h2 className={reversalClass}>Reversal</h2>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className='right-analysis'>
            <div className='top-right'>
              <div className='liquidity'>
                <h2>Liquidity</h2>
                <h2 className={lplValid ? liquidityClass : 'pill inactive'}>
                  {liquidityText}
                </h2>
              </div>

              <div className='honeypot'>
                <h2>Honeypot?</h2>
                <h2 className={honeypotClass}>{honeypotText}</h2>
              </div>
            </div>

            <div className='suggested'>
              <h2>Suggested action</h2>
              <h2 className={recToClass('strong buy')}>Strong Buy</h2>
              <h2 className={recToClass('buy')}>Buy</h2>
              <h2 className={recToClass('neutral')}>Do Nothing</h2>
              <h2 className={recToClass('sell')}>Sell</h2>
              <h2 className={recToClass('strong sell')}>Strong Sell</h2>
            </div>
          </div>
        </div>

        <div className='lower-buttons-analysis'>
          <button className='share'>Share</button>
          <div className='buttons-lower-side'>
            <button onClick={() => navigate('/results', { state })} className='prev'>Previous</button>
            <button onClick={() => navigate('/input')} className='new'>New +</button>
          </div>
        </div>
      </div>
    </div>
  );
}
