import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import "../style/FaceTracker.scss";

const emotionMap = {
  happy: "😄",
  sad: "😢",
  angry: "😠",
  fearful: "😨",
  disgusted: "🤢",
  surprised: "😲",
  neutral: "😐",
};

const FaceTracker = ({ onStatsUpdate }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  const [age, setAge] = useState("--");
  const [gender, setGender] = useState("--");
  const [emotion, setEmotion] = useState("Detecting...");
  const [emotionIcon, setEmotionIcon] = useState("🙂");
  const [loading, setLoading] = useState(true);
  const [confidence, setConfidence] = useState("0%");
  const [faceDetected, setFaceDetected] = useState(false);
  const [distance, setDistance] = useState("Unknown");
const [blinkCount] = useState(0);

const ageBufferRef = useRef([]);

const fpsRef = useRef(0);
const lastTimeRef = useRef(performance.now());

useEffect(() => {
  init();

  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
}, []);

  const init = async () => {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
        faceapi.nets.ageGenderNet.loadFromUri("/models"),
      ]);

      await startVideo();

      setLoading(false);

      detectFace();
    } catch (err) {
      console.error(err);
    }
  };

  const startVideo = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    videoRef.current.srcObject = stream;

    return new Promise((resolve) => {
      videoRef.current.onloadedmetadata = () => {
        resolve();
      };
    });
  };

 const detectFace = () => {
   intervalRef.current = setInterval(async () => {
     if (!videoRef.current) return;

     const now = performance.now();

     fpsRef.current = Math.round(1000 / (now - lastTimeRef.current));

     lastTimeRef.current = now;

     const detection = await faceapi
       .detectSingleFace(
         videoRef.current,
         new faceapi.TinyFaceDetectorOptions(),
       )
       .withFaceExpressions()
       .withAgeAndGender();

     const canvas = canvasRef.current;

     const displaySize = {
       width: videoRef.current.videoWidth,
       height: videoRef.current.videoHeight,
     };

     faceapi.matchDimensions(canvas, displaySize);

     const ctx = canvas.getContext("2d");

     ctx.clearRect(0, 0, canvas.width, canvas.height);

     if (!detection) {
       setFaceDetected(false);

       onStatsUpdate?.({
         confidence: "0%",
         fps: fpsRef.current,
         status: "Searching",
         blinks: blinkCount,
       });

       return;
     }

     setFaceDetected(true);

     const resized = faceapi.resizeResults(detection, displaySize);

     faceapi.draw.drawDetections(canvas, resized);

     // AGE SMOOTHING
     const currentAge = Math.round(detection.age);

     ageBufferRef.current.push(currentAge);

     if (ageBufferRef.current.length > 10) {
       ageBufferRef.current.shift();
     }

     const avgAge =
       ageBufferRef.current.reduce((a, b) => a + b, 0) /
       ageBufferRef.current.length;

     setAge(Math.round(avgAge));

     // GENDER
     setGender(
       detection.gender.charAt(0).toUpperCase() + detection.gender.slice(1),
     );

     // CONFIDENCE
     const conf = `${Math.round(detection.detection.score * 100)}%`;

     setConfidence(conf);

     // DISTANCE
     const faceWidth = detection.detection.box.width;

     let distanceValue = "Unknown";

     if (faceWidth > 300) {
       distanceValue = "📍 Very Close";
     } else if (faceWidth > 180) {
       distanceValue = "✅ Optimal";
     } else {
       distanceValue = "🔭 Far";
     }

     setDistance(distanceValue);

     // EMOTION
     const expressions = detection.expressions;

     const dominantEmotion = Object.keys(expressions).reduce((a, b) =>
       expressions[a] > expressions[b] ? a : b,
     );

     const emotionName =
       dominantEmotion.charAt(0).toUpperCase() + dominantEmotion.slice(1);

     setEmotion(emotionName);

     setEmotionIcon(emotionMap[dominantEmotion] || "🙂");

     onStatsUpdate?.({
       confidence: conf,
       fps: fpsRef.current,
       status: "Detected",
       blinks: blinkCount,
     });
   }, 700);
 };

  return (
    <div className="face-tracker">
      {loading && <div className="loading-text">Loading AI Models...</div>}

      <div className="camera-box">
        <video ref={videoRef} autoPlay muted playsInline />

        <canvas ref={canvasRef} />
      </div>

      <div className="info-grid">
        <div className="card">
          <span className="icon">🎂</span>
          <h3>Age</h3>
          <p>{age}</p>
        </div>

        <div className="card">
          <span className="icon">👨</span>
          <h3>Gender</h3>
          <p>{gender}</p>
        </div>

        <div className="card emotion-card">
          <span className="emoji">{emotionIcon}</span>

          <h3>Emotion</h3>
          <p>{emotion}</p>
        </div>

        <div className="card">
          <span className="icon">🎯</span>
          <h3>Confidence</h3>
          <p>{confidence}</p>
        </div>

        <div className="card">
          <span className="icon">📏</span>
          <h3>Distance</h3>
          <p>{distance}</p>
        </div>

        <div className="card">
          <span className="icon">{faceDetected ? "🟢" : "🔴"}</span>

          <h3>Status</h3>
          <p>{faceDetected ? "Face Found" : "Searching"}</p>
        </div>
      </div>
    </div>
  );
};

export default FaceTracker;
