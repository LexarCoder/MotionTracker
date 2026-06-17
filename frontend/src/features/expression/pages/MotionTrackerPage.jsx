import React, { useRef, useState, useEffect } from "react";
import MotionTracker from "../components/MotionTracker";
import "../style/MotionTrackerPage.scss";

const MotionTrackerPage = () => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const [isArmed, setIsArmed] = useState(false);
  const [isAlerting, setIsAlerting] = useState(false);

  useEffect(() => {
    const startCameraAutomatically = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: 1280, height: 720 },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsArmed(true);
        }
      } catch (err) {
        console.error("Camera auto-start failed:", err);
        alert("Please allow camera permissions for automatic start!");
      }
    };

    startCameraAutomatically();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleMotionDetected = (percentage) => {
    if (!isAlerting) {
      setIsAlerting(true);
      if (audioRef.current) {
        audioRef.current
          .play()
          .catch((e) => console.log("Sound autoplay blocked by browser:", e));
      }
    }
  };

  const handleMotionStopped = () => {
    setIsAlerting(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const toggleSystem = () => {
    if (isArmed) {
      setIsArmed(false);
      setIsAlerting(false);
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      handleMotionStopped();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className={`cctv-container ${isAlerting ? "alert-mode" : ""}`}>
      <audio ref={audioRef} src="/sound/security-alarm.mpeg" loop />

      <header>
        <h1>
          SEC-COM <span>// TACTICAL SURVEILLANCE</span>
        </h1>
        <button
          onClick={toggleSystem}
          className={isArmed ? "btn-stop" : "btn-start"}
        >
          {isArmed ? "SHUTDOWN SYSTEM" : "SYSTEM REBOOT"}
        </button>
      </header>

      <div className="camera-box">
        {!isArmed && <div className="no-signal">SYSTEM OFFLINE</div>}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="video-feed"
        />

        {isAlerting && (
          <div className="alert-overlay">
            🚨 MOTION DETECTED! ALARM ACTIVE 🚨
          </div>
        )}
      </div>

      <MotionTracker
        videoRef={videoRef}
        isArmed={isArmed}
        // Theek ki hui limit: 1.5% ekdam perfect hai. Na fake alarm bajega aur head movement bhi pakdega.
        sensitivity={3.0}
        onMotionDetected={handleMotionDetected}
        onMotionStopped={handleMotionStopped}
      />
    </div>
  );
};

export default MotionTrackerPage;
