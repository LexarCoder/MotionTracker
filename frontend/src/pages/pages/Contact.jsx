import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Globe, Send, ShieldAlert } from "lucide-react";
import "../style/Contact.scss";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subsystem: "", // Default empty to trigger floating label logic
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Telemetry Payload Dispatched:", formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="contact-container">
      <main className="contact-split-layout">
        {/* Left Side: System Metadata */}
        <div className="telemetry-info-panel">
          <div className="status-badge">
            <span className="pulse-node"></span>
            <span>COMMS_CHANNEL // ONLINE</span>
          </div>

          <h2>Establish Secure Node Connection</h2>
          <p className="description">
            Have questions regarding tracking mesh optimizations, SDK
            integration, or commercial deployment blueprints? Ping our core
            relay array.
          </p>

          <div className="meta-cards-stack">
            {[
              {
                icon: Mail,
                title: "CORE RELAY EMAIL",
                val: "lexarcoder@gmail.com",
              },
              {
                icon: Globe,
                title: "NODE LOCATION",
                val: "Haridwar, UTTRAKHAND",
              },
              {
                icon: ShieldAlert,
                title: "SECURITY OVERVIEW",
                val: "End-to-End Encrypted Handshake",
              },
            ].map((item, i) => (
              <div key={i} className="info-meta-card">
                <div className="meta-icon">
                  <item.icon size={18} />
                </div>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Glassmorphic Terminal */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="form-terminal-wrapper"
        >
          <form onSubmit={handleSubmit} className="terminal-glass-card">
            <div className="corner-bracket top-left" />
            <div className="corner-bracket bottom-right" />

            <div className="terminal-header">
              <div className="terminal-bullets">
                <span className="bullet red"></span>
                <span className="bullet yellow"></span>
                <span className="bullet green"></span>
              </div>
              <span className="terminal-title">SYS_COMMS_INPUT.EXE</span>
            </div>

            <div className="form-fields">
              <div className="input-group">
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
                <label className={formData.name ? "active" : ""}>
                  OPERATOR NAME
                </label>
              </div>

              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
                <label className={formData.email ? "active" : ""}>
                  DIGITAL MAIL ENDPOINT
                </label>
              </div>

              <div className="input-group">
                <select
                  name="subsystem"
                  required
                  value={formData.subsystem}
                  onChange={handleChange}
                >
                  <option value="" disabled></option>
                  <option value="general">General Node Telemetry</option>
                  <option value="face">Face Mesh Modules</option>
                  <option value="body">Skeletal Body Vectors</option>
                </select>
                <label className={formData.subsystem ? "active" : ""}>
                  SUBSYSTEM TARGET
                </label>
              </div>

              <div className="input-group">
                <textarea
                  name="message"
                  rows="3"
                  required
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
                <label className={formData.message ? "active" : ""}>
                  PAYLOAD MESSAGE / DATA BRIEF
                </label>
              </div>

              <button type="submit" className="btn-terminal-submit">
                <span>DISPATCH TRANSMISSION</span>
                <Send size={14} />
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
