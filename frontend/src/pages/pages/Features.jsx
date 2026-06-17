import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ScanFace, Activity, Hand, Radar, ArrowUpRight } from "lucide-react";
import "../style/Features.scss"; // Path check kar lena apne folder ke hisab se

export default function Features() {
  const trackingModules = [
    {
      icon: <ScanFace size={22} />,
      title: "Face Tracking",
      desc: "Sub-millimeter landmark structural mesh tracking mapping 468 spatial coordinates natively over raw video fields.",
      path: "/facetracker",
      colorClass: "neon-blue-variant",
    },
    {
      icon: <Activity size={22} />,
      title: "Body Tracking",
      desc: "Kinematic skeletal mapping, advanced posture matrices, and biometric gait tracking systems.",
      path: "/bodytracker",
      colorClass: "neon-purple-variant",
    },
    {
      icon: <Hand size={22} />,
      title: "Hand Tracking",
      desc: "High-density multi-finger dimensional articulation tracking for interface gestures without hardware wear.",
      path: "/handtracker",
      colorClass: "neon-blue-variant",
    },
    {
      icon: <Radar size={22} />,
      title: "Motion Tracking",
      desc: "Predictive real-time velocity calculations, positional analytics, and temporal tracking sequences.",
      path: "/motiontracker",
      colorClass: "neon-emerald-variant",
    },
  ];

  return (
    <div className="features-container">
  

      <section className="modules-grid-section">
        <div className="section-header-minimal">
          <span className="index">• Real-Time Tracking Architecture</span>
          <h2>Subsystem Telemetry Modules</h2>
          <p className="subtitle">
            High-fidelity compute structures handling physical telemetry arrays
            at scale. Click a module to access specialized subsystem telemetry.
          </p>
        </div>

        <div className="grid-layout">
          {trackingModules.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
              whileHover={{ y: -6 }}
              className={`module-card-wrapper ${item.colorClass}`}
            >
              <Link to={item.path} className="glass-card module-card-link">
                {/* Micro Corner lines matching the HUD simulator */}
                <div className="corner-bracket top-left" />
                <div className="corner-bracket bottom-right" />

                <div className="card-header-meta">
                  <div className="icon-wrapper">{item.icon}</div>
                  <span className="status-node">SYS_ACTIVE</span>
                </div>

                <h3>{item.title}</h3>
                <p>{item.desc}</p>

                <div className="card-terminal-anchor">
                  <span>INITIALIZE SYS_FEED</span>
                  <ArrowUpRight size={14} className="arrow-icon" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
