import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

async function fetchAny(url) {
  try {
    const res = await fetch(url, { method: 'GET' });
    const ct = (res.headers.get('content-type') || '').toLowerCase();

    // Handle images explicitly
    if (ct.startsWith('image/')) {
      return { ok: res.ok, status: res.status, url, body: { kind: 'image', imageUrl: url } };
    }

    // JSON or plain text
    if (ct.includes('application/json')) {
      try {
        const json = await res.json();
        return { ok: res.ok, status: res.status, url, body: json };
      } catch {
        // malformed JSON despite header
      }
    }

    const txt = await res.text();
    try {
      const parsed = JSON.parse(txt);
      return { ok: res.ok, status: res.status, url, body: parsed };
    } catch {
      return { ok: res.ok, status: res.status, url, body: { kind: 'text', raw: txt } };
    }
  } catch (err) {
    return { ok: false, status: 0, url, body: { kind: 'error', error: err?.message || 'Network error' } };
  }
}

export default function Loading() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const ca = state?.ca;

  const videoRef = useRef(null);
  const resultsRef = useRef(null);

  const [fetchDone, setFetchDone] = useState(false);
  const [videoDone, setVideoDone] = useState(false);

  // Kick off both Lambda requests
  useEffect(() => {
    if (!ca) {
      navigate('/input');
      return;
    }

    const urls = [
      `https://5az6o4mezri2q2mpj6yo3o5jcm0eqqnb.lambda-url.us-east-1.on.aws/?contract=${encodeURIComponent(ca)}&resolution=15&chainid=56`,
      `https://2fvrg32iwoai6vjseepvvqi3pa0pmgky.lambda-url.us-east-1.on.aws/?contract_address=${encodeURIComponent(ca)}`,
    ];

    let cancelled = false;
    (async () => {
      const [r1, r2] = await Promise.all(urls.map(fetchAny));
      if (cancelled) return;
      resultsRef.current = { lambda1: r1, lambda2: r2 };
      setFetchDone(true);
    })();

    return () => { cancelled = true; };
  }, [ca, navigate]);

  // Navigate only when both requests finish AND video has fully played
  useEffect(() => {
    if (fetchDone && videoDone && resultsRef.current) {
      const { lambda1, lambda2 } = resultsRef.current;
      navigate('/analysis', { state: { ca, lambda1, lambda2 } });
    }
  }, [fetchDone, videoDone, navigate, ca]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#000',
        zIndex: 9999,
      }}
    >
      {/* Fullscreen background video */}
      <video
        ref={videoRef}
        src="/waiting3.mp4"       // Place your video in /public
        autoPlay
        muted
        playsInline
        onEnded={() => setVideoDone(true)}
        onError={() => setVideoDone(true)}  // fallback to avoid stuck states
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',  // Ensures full-screen coverage
        }}
      />

      {/* Optional text overlay (can delete this if you want a clean full-video experience) */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          width: '100%',
          textAlign: 'center',
          color: '#fff',
          fontFamily: 'Inter, sans-serif',
          fontSize: '1.2rem',
        }}
      >
        Analyzing <strong>{ca}</strong>…
      </div>
    </div>
  );
}
