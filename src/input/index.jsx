import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './input.css';

export default function Input() {
  const navigate = useNavigate();

  // sequential fade-ins (no typing)
  const [bubble1Visible, setBubble1Visible] = useState(false);
  const [bubble2Visible, setBubble2Visible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setBubble1Visible(true), 300);   // first bubble
    const t2 = setTimeout(() => setBubble2Visible(true), 1500);   // second bubble after a beat
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // CA input + submit
  const [ca, setCa] = useState('');
  const [err, setErr] = useState('');

  const onSubmit = () => {
    const value = (ca || '').trim();
    const ok = /^0x[a-fA-F0-9]{40}$/.test(value);
    if (!ok) {
      setErr('Please enter a valid BNB (EVM) contract address (0x…40 hex).');
      return;
    }
    setErr('');
    // send to loading page where you play video and call both Lambdas
    navigate('/loading', { state: { ca: value } });
  };

  return (
    <div className="fw-input">
      <div className="inner-input">
        <div>
          <img src="/character-popeye.png" className="popeye2" alt="Popeye" />
          <img src="/CZ_guy-final.png" className="cz-guy" alt="CZ" />
        </div>

        <div className="input-fields">
          <div className="yellow-div">
            <img src='/bsc-logo.png' className='bsc-logo-input'></img>
            <div className="popeye-talk">
              {/* Bubble 1 */}
              <div className={`provide-div pop ${bubble1Visible ? 'show' : ''}`}>
                <h2>
                  Hey you! My Name is <strong>Popeye</strong>, my first appearance was{' '}
                  <strong>January 17, 1929</strong>. Because I am an Iconic character
                  scientists decided to make me immortal. Now I am a <strong>hybrid</strong>{' '}
                  Popeye / A.I. with special functions.
                </h2>
              </div>

              {/* Bubble 2 */}
              <div className={`provide-div2 pop ${bubble2Visible ? 'show' : ''}`}>
                <h2>
                  Give me a <strong>contract address</strong> of any BNB chain token and I will <strong>predict the
                  future of the chart</strong> for you!
                </h2>
              </div>
            </div>

            {/* Static input block */}
            <div className="input">
              <input
                id="ca"
                className="ca-input"
                placeholder="Enter contract address"
                value={ca}
                onChange={(e) => setCa(e.target.value)}
                inputMode="text"
                autoComplete="off"
                spellCheck={false}
              />
              {err && <div className="error">{err}</div>}
            </div>
          </div>
        </div>

        <div className="lower-div">
          <button type="button" className="next-button" onClick={onSubmit}>
            Submit &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
