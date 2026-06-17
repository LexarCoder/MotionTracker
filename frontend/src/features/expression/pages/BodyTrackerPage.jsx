import React, { useRef, useState, useEffect } from "react";
import BodyTracker from "../components/BodyTracker";
import "../style/BodyTrackerPage.scss";

const BodyTrackerPage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // App States: 'idle' | 'scanning' | 'analyzing' | 'report'
  const [appState, setAppState] = useState("idle");
  const [timeLeft, setTimeLeft] = useState(5);
  const framesDataRef = useRef([]);

  const [finalReport, setFinalReport] = useState(null);

  const startDeepScan = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
      });
      if (videoRef.current) videoRef.current.srcObject = stream;

      framesDataRef.current = []; // Reset data
      setAppState("scanning");
      setTimeLeft(5);
    } catch (err) {
      alert("Camera access required for scan.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  const resetSystem = () => {
    stopCamera();
    setAppState("idle");
    setFinalReport(null);
  };

  // Timer Logic
  useEffect(() => {
    let timer;
    if (appState === "scanning" && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (appState === "scanning" && timeLeft === 0) {
      setAppState("analyzing");
      setTimeout(generateFinalReport, 1500); // Fake analyzing delay for premium feel
    }
    return () => clearTimeout(timer);
  }, [appState, timeLeft]);

  // Collecting real-time frames during scan
  const handleFrameData = (data) => {
    if (appState === "scanning") {
      framesDataRef.current.push(data);
    }
  };

  // Generate Report based on 5-second average
  const generateFinalReport = () => {
    stopCamera();
    const dataFrames = framesDataRef.current;

    if (dataFrames.length < 10) {
      alert("Not enough data. Please stand in frame clearly.");
      resetSystem();
      return;
    }

    // Averages
    const avgRatio =
      dataFrames.reduce((sum, d) => sum + d.ratio, 0) / dataFrames.length;
    const avgShoulderTilt =
      dataFrames.reduce((sum, d) => sum + d.shoulderTilt, 0) /
      dataFrames.length;
    const avgHipTilt =
      dataFrames.reduce((sum, d) => sum + d.hipTilt, 0) / dataFrames.length;

    // Body Type Estimation (Somatotype proxy)
    let bodyType = "Mesomorph (Athletic)";
    let buildDesc =
      "Balanced muscle-to-fat ratio. Broad shoulders, narrow waist.";

    if (avgRatio > 1.45) {
      bodyType = "V-Taper Mesomorph";
      buildDesc = "Highly athletic skeletal structure. Dominant upper body.";
    } else if (avgRatio < 1.18) {
      bodyType = "Ectomorph (Slim)";
      buildDesc =
        "Lean build. Fast metabolism type frame. Narrower skeletal width.";
    } else if (avgRatio >= 1.18 && avgRatio <= 1.3) {
      bodyType = "Endomorph (Broad)";
      buildDesc =
        "Solid, broad core structure. Tends to carry more mass/volume.";
    }

    // Health Score Math
    let score = 100;
    if (avgShoulderTilt > 0.03) score -= 10;
    if (avgHipTilt > 0.03) score -= 15;
    if (avgShoulderTilt > 0.06 || avgHipTilt > 0.06) score -= 25;

    setFinalReport({
      bodyType,
      buildDesc,
      score: Math.max(0, score),
      symmetry:
        score > 85
          ? "Excellent (Highly Aligned)"
          : score > 70
            ? "Moderate Imbalance"
            : "Poor Posture",
      ratio: avgRatio.toFixed(2),
    });
    setAppState("report");
  };

  // Keep Canvas aspect ratio aligned
  useEffect(() => {
    if (appState === "scanning" && videoRef.current && canvasRef.current) {
      canvasRef.current.width = videoRef.current.clientWidth;
      canvasRef.current.height = videoRef.current.clientHeight;
    }
  }, [appState]);

  return (
    <div className="tracker-container">
      <header className="tracker-header">
        <div className="title-block">
          <h1>
            LEXAR <span>// DEEP HEALTH SCANNER</span>
          </h1>
        </div>
        {appState === "idle" && (
          <button onClick={startDeepScan} className="btn-start">
            INITIATE DEEP SCAN
          </button>
        )}
        {appState === "report" && (
          <button onClick={resetSystem} className="btn-start">
            NEW SCAN
          </button>
        )}
      </header>

      <div className="tracker-layout">
        {/* Camera / Status Section */}
        <div className="camera-section">
          {appState === "idle" && (
            <div className="placeholder-text">
              SYSTEM READY. CLICK INITIATE.
            </div>
          )}

          {appState === "analyzing" && (
            <div className="analyzing-screen">
              <div className="spinner"></div>
              <h2>PROCESSING BIOMETRICS...</h2>
            </div>
          )}

          {appState === "report" && (
            <div className="report-success">
              <h2>SCAN COMPLETE</h2>
              <p>Biometric data successfully extracted and analyzed.</p>
            </div>
          )}

          {(appState === "scanning" || appState === "analyzing") && (
            <>
              <video
                ref={videoRef}
                className="live-video"
                autoPlay
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="skeleton-canvas" />
            </>
          )}

          {appState === "scanning" && (
            <BodyTracker
              videoRef={videoRef}
              canvasRef={canvasRef}
              onFrameData={handleFrameData}
            />
          )}

          {/* Scanning Progress Overlay */}
          {appState === "scanning" && (
            <div className="scan-progress-overlay">
              <div className="timer-text">SCANNING: {timeLeft}s</div>
              <div className="progress-bar-container">
                <div
                  className="progress-bar"
                  style={{ width: `${((5 - timeLeft) / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Results / Dossier Panel */}
        <div className="results-panel">
          {appState !== "report" ? (
            <div className="waiting-card">
              {appState === "scanning"
                ? "GATHERING FRAME DATA..."
                : "AWAITING SCAN RESULTS"}
            </div>
          ) : (
            <>
              <div className="report-card primary-card fade-in">
                <h3 className="card-title">ESTIMATED BODY TYPE</h3>
                <div className="big-result">{finalReport.bodyType}</div>
                <p className="detail-text">{finalReport.buildDesc}</p>
              </div>

              <div
                className="report-card fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                <h3 className="card-title">SKELETAL HEALTH SCORE</h3>
                <div className="score-display">
                  <span className="count">{finalReport.score}</span>
                  <span className="max-score">/ 100</span>
                </div>
                <div className="data-row">
                  <span className="row-label">Posture & Symmetry</span>
                  <strong className="row-value">{finalReport.symmetry}</strong>
                </div>
              </div>

              <div
                className="report-card fade-in"
                style={{ animationDelay: "0.4s" }}
              >
                <h3 className="card-title">BIOMETRIC RATIOS</h3>
                <div className="data-row">
                  <span className="row-label">Shoulder-to-Hip Ratio</span>
                  <strong className="row-value">{finalReport.ratio}</strong>
                </div>
                <p className="note" style={{ marginTop: "10px" }}>
                  *Note: System uses skeletal width to estimate frame density.
                  Actual muscle/fat mass requires clinical DEXA hardware.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BodyTrackerPage;
