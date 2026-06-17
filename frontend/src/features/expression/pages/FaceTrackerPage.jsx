import React, { useState , useRef} from "react";
import FaceTracker from "../components/FaceTracker";
import "../style/FaceTrackerPage.scss";

const FaceTrackerPage = () => {


  const [stats, setStats] = useState({
    confidence: "0%",
    fps: "0",
    status: "Searching",
    blinks: 0,
  });

  return (
    <div className="face-tracker-page">
      <div className="hero">
        <h1>
          Face Tracking
          <span> Intelligence System</span>
        </h1>

        <p>
          Real-time AI powered face analysis, emotion recognition and tracking.
        </p>
      </div>

      <div className="camera-panel">
        <FaceTracker onStatsUpdate={setStats} />
      </div>
      <div className="live-stats">
        <div className="stat-card">
          <span>Detection</span>
          <h2>{stats.confidence}</h2>
        </div>

        <div className="stat-card">
          <span>FPS</span>
          <h2>{stats.fps}</h2>
        </div>

        <div className="stat-card">
          <span>Status</span>
          <h2>{stats.status}</h2>
        </div>

        <div className="stat-card">
          <span>Blinks</span>
          <h2>{stats.blinks}</h2>
        </div>
      </div>
    </div>
  );
};

export default FaceTrackerPage;
