import { useState } from "react";
import HandTracker from "../components/HandTracker";
import "../style/HandTrackerPage.scss";

export default function HandTrackerPage() {
  const [data, setData] = useState({
    handsCount: 0,
    fingers: 0,
    gesture: "NO_HAND",
    gestureIcon: "❌",
  });

 const metrics = [
   {
     label: "Hands Detected",
     value: data.handsCount,
     icon: "🖐️",
   },
   {
     label: "Fingers Up",
     value: data.fingers,
     icon: "☝️",
   },
   {
     label: "Current Gesture",
     value: data.gesture,
     icon: data.gestureIcon,
   },
   {
     label: "Hand Type",
     value: data.handType,
     icon: "🤚",
   },
   {
     label: "Confidence",
     value: data.confidence,
     icon: "🎯",
   },
   {
     label: "Status",
     value: data.handsCount > 0 ? "TRACKING" : "SEARCHING",
     icon: "🟢",
   },
 ];

  return (
    <div className="ht-page">
      <header className="ht-header">
        <span className="tag">AI VISION SYSTEM</span>

        <h1>
          Hand Tracking
          <br />
          Intelligence
        </h1>

        <p>
          Real-time finger tracking, gesture recognition and AI powered hand
          analysis.
        </p>
      </header>
      <div className="system-status">
        <span>AI Vision Engine</span>
        <span>MediaPipe Neural Tracking</span>
        <span>Real-Time Analysis</span>
      </div>
      <div className="tracker-board">
        <div className="live-tag">LIVE AI ANALYSIS</div>

        <div className="camera-section">
          <HandTracker onUpdate={setData} />
        </div>

        <div className="metrics-grid">
          {metrics.map((item) => (
            <div key={item.label} className="metric-card">
              <div className="icon">{item.icon}</div>

              <div className="label">{item.label}</div>

              <div className="value">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
