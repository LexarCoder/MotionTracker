import { Link } from "react-router-dom";
import { Radar, ScanFace, Hand, Activity, Mail, ArrowUp } from "lucide-react";

import "../Style/Footer.scss";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">
      <div className="footer-glow"></div>

      <div className="footer-container">
        {/* BRAND */}
        <div className="footer-brand">
          <div className="brand-header">
            <div className="brand-icon">
              <Radar size={22} />
            </div>

            <h2>
              <span>Lexar</span>Tracker
            </h2>
          </div>

          <p>
            Advanced AI-powered human tracking platform built for face analysis,
            body posture, hand gestures and motion intelligence.
          </p>

          <div className="footer-badges">
            <span>AI Tracking</span>
            <span>Real-Time</span>
            <span>MediaPipe</span>
          </div>
        </div>

        {/* TRACKERS */}
        <div className="footer-links">
          <h3>Trackers</h3>

          <Link to="/facetracker">
            <ScanFace size={18} />
            Face Tracker
          </Link>

          <Link to="/bodytracker">
            <Activity size={18} />
            Body Tracker
          </Link>

          <Link to="/handtracker">
            <Hand size={18} />
            Hand Tracker
          </Link>

          <Link to="/motiontracker">
            <Radar size={18} />
            Motion Tracker
          </Link>
        </div>

        {/* PLATFORM */}
        <div className="footer-links">
          <h3>Platform</h3>

          <Link to="/">Home</Link>
          <Link to="/features">Features</Link>
          <Link to="/contact">Contact</Link>
        </div>

        {/* CONTACT */}
        <div className="footer-links">
          <h3>Contact</h3>

          <div className="contact-item">
            <Mail size={18} />
            lexarcoder@gmail.com
          </div>

          <p>Building next-generation browser-based tracking systems.</p>
        </div>
      </div>

      {/* BOTTOM */}

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} LexarTracker. All Rights Reserved.</p>

        <button className="top-btn" onClick={scrollToTop}>
          <ArrowUp size={18} />
        </button>
      </div>
    </footer>
  );
}