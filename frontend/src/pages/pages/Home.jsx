import React from "react";
import "../style/Home.scss";
import Features from "./Features";
import Contact from "./Contact";
const Home = () => {
  return (
    <div class="landing-container">
      <div className="center-grid-matrix" />
      <div className="center-core-glow" />
      {/* Hero Section */}
      <main class="hero-section">
        {/* Left Side: Pitch and Headings */}
        <div class="hero-content">
          <div class="badge">
            <span class="dot"></span>
            Real-Time Motion Intelligence
          </div>

          <h1>
            Capture Every Move. <br />
            <span>In Real-Time.</span>
          </h1>

          <p>
            Experience high-fidelity face meshes and 3D full-body skeletal
            tracking directly via webcam. Zero latency, high precision.
          </p>

          <div class="cta-group">
            <a href="/features">
              <button class="btn-primary">Start Tracking</button>
            </a>

            <button class="btn-secondary">View Docs</button>
          </div>

          {/* Technical Info Stats */}
          <div class="stats-grid">
            <div class="stat-item">
              <h3>
                60 <span>FPS</span>
              </h3>
              <p>ULTRA-LOW LATENCY</p>
            </div>
            <div class="stat-item">
              <h3>468</h3>
              <p>FACE LANDMARKS</p>
            </div>
            <div class="stat-item">
              <h3>33</h3>
              <p>SKELETAL JOINTS</p>
            </div>
          </div>
        </div>

        {/* Right Side: Cyber Tracker HUD Canvas Placeholder */}
        <div className="hero-visual">
          <div className="hud-container">
            <div className="hud-screen">
              {/* Cyberpunk Telemetry Details */}
              <div className="hud-tag-left">
                SYS.STATUS: ACTIVE <br />
                FEED: WEBCAM_01
              </div>
              <div className="hud-tag-right">
                LATENCY: 11ms <br />
                RESOLUTION: 1080p
              </div>

              {/* NEW: 3D Hologram Face Scan Simulation Container */}
              <div className="hologram-face-matrix">
                {/* Moving Laser Line Effect */}
                <div className="laser-scanner-line"></div>

                {/* Futuristic Wireframe Face Vector Nodes */}
                <div className="face-wireframe-mesh">
                  {/* Facial Landmark Structural Nodes */}
                  <span className="landmark-node eye-l"></span>
                  <span className="landmark-node eye-r"></span>
                  <span className="landmark-node nose-tip"></span>
                  <span className="landmark-node mouth-l"></span>
                  <span className="landmark-node mouth-r"></span>
                  <span className="landmark-node jaw-center"></span>

                  {/* Simulated Outer Contour Mesh Ring */}
                  <div className="contour-ring-1"></div>
                  <div className="contour-ring-2"></div>
                </div>
              </div>

              {/* Interactive Info Label */}
              <div className="hud-status-pill">[ SCANNING FACE MESH... ]</div>
            </div>
          </div>
        </div>
      </main>
      <Features />
      <Contact />
    </div>
  );
};

export default Home;
