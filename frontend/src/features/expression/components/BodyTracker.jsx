import React, { useEffect, useRef } from "react";
import { Pose, POSE_CONNECTIONS } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";

const BodyTracker = ({ videoRef, canvasRef, onFrameData }) => {
  const poseRef = useRef(null);
  const cameraRef = useRef(null);

  const getDistance = (p1, p2) =>
    Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

  useEffect(() => {
    const initializeTracker = async () => {
      const pose = new Pose({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
      });

      pose.onResults(onResults);
      poseRef.current = pose;

      if (videoRef.current) {
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (poseRef.current)
              await poseRef.current.send({ image: videoRef.current });
          },
          width: 1280,
          height: 720,
        });
        camera.start();
        cameraRef.current = camera;
      }
    };

    initializeTracker();

    return () => {
      if (cameraRef.current) cameraRef.current.stop();
      if (poseRef.current) poseRef.current.close();
    };
  }, [videoRef]);

  const onResults = (results) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!results.poseLandmarks) return;

    const lm = results.poseLandmarks;
    drawMinimalSkeleton(ctx, lm, POSE_CONNECTIONS, canvas.width, canvas.height);

    // Raw metrics extraction for the 5-second deep scan
    const shoulderWidth = getDistance(lm[11], lm[12]);
    const hipWidth = getDistance(lm[23], lm[24]);
    const shoulderTilt = Math.abs(lm[11].y - lm[12].y);
    const hipTilt = Math.abs(lm[23].y - lm[24].y);

    // Estimate overall height in frame (Nose to Ankle)
    const bodyHeight = getDistance(lm[0], lm[27] || lm[23]); // Fallback to hip if legs not visible

    onFrameData({
      shoulderWidth,
      hipWidth,
      shoulderTilt,
      hipTilt,
      bodyHeight,
      ratio: shoulderWidth / (hipWidth || 1),
    });
  };

  const drawMinimalSkeleton = (ctx, landmarks, connections, w, h) => {
    ctx.beginPath();
    connections.forEach(([startIdx, endIdx]) => {
      const start = landmarks[startIdx];
      const end = landmarks[endIdx];
      if (start.visibility > 0.6 && end.visibility > 0.6) {
        ctx.moveTo(start.x * w, start.y * h);
        ctx.lineTo(end.x * w, end.y * h);
      }
    });
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 3;
    ctx.stroke();

    landmarks.forEach((landmark) => {
      if (landmark.visibility > 0.6) {
        ctx.beginPath();
        ctx.arc(landmark.x * w, landmark.y * h, 4, 0, 2 * Math.PI);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      }
    });
  };

  return null;
};

export default BodyTracker;
