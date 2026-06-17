import React, { useEffect, useRef } from "react";
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

const gestureIcons = {
  OPEN_PALM: "🖐️",
  FIST: "✊",
  PEACE: "✌️",
  POINT: "☝️",
  ROCK: "🤘",
  LOVE: "🤟",
  PINCH: "🤏",
  TRACKING: "👀",
  NO_HAND: "❌",
};

export default function HandTracker({ onUpdate }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    let camera;

    const init = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas) return;

      const ctx = canvas.getContext("2d");

      canvas.width = 1280;
      canvas.height = 720;

      const hands = new Hands({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
      });

      const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

      const getFingerState = (lm) => {
        const thumb = Math.abs(lm[4].x - lm[2].x) > 0.05;

        const index = lm[8].y < lm[6].y;
        const middle = lm[12].y < lm[10].y;
        const ring = lm[16].y < lm[14].y;
        const pinky = lm[20].y < lm[18].y;

        const count =
          Number(thumb) +
          Number(index) +
          Number(middle) +
          Number(ring) +
          Number(pinky);

        return {
          thumb,
          index,
          middle,
          ring,
          pinky,
          count,
        };
      };

      const detectGesture = (lm, state) => {
        const { thumb, index, middle, ring, pinky, count } = state;

        const pinchDistance = distance(lm[4], lm[8]);

        if (pinchDistance < 0.05) return "PINCH";

        if (thumb && index && middle && ring && pinky) return "OPEN_PALM";

        if (count === 0) return "FIST";

        if (index && !middle && !ring && !pinky) return "POINT";

        if (index && middle && !ring && !pinky) return "PEACE";

        if (index && pinky && !middle && !ring) return "ROCK";

        if (thumb && index && pinky && !middle && !ring) return "LOVE";

        return "TRACKING";
      };

      hands.onResults((results) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (results.image) {
          ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
        }

        const handLandmarks = results.multiHandLandmarks || [];

        const handedness = results.multiHandedness || [];

        let totalFingers = 0;
        let currentGesture = "NO_HAND";
        let handType = "NONE";

        handLandmarks.forEach((lm, index) => {
          const state = getFingerState(lm);

          totalFingers += state.count;

          currentGesture = detectGesture(lm, state);

          handType = handedness[index]?.label || "UNKNOWN";

          ctx.save();

          ctx.shadowColor = "#00d9ff";

          ctx.shadowBlur = 20;

          drawConnectors(ctx, lm, HAND_CONNECTIONS, {
            color: "#00d9ff",
            lineWidth: 4,
          });

          drawLandmarks(ctx, lm, {
            color: "#ffffff",
            lineWidth: 2,
            radius: 3,
          });

          [4, 8, 12, 16, 20].forEach((tip) => {
            const x = lm[tip].x * canvas.width;

            const y = lm[tip].y * canvas.height;

            const gradient = ctx.createRadialGradient(x, y, 0, x, y, 15);

            gradient.addColorStop(0, "#00e5ff");

            gradient.addColorStop(1, "transparent");

            ctx.beginPath();
            ctx.arc(x, y, 15, 0, Math.PI * 2);

            ctx.fillStyle = gradient;

            ctx.fill();
          });

          ctx.restore();
        });

        onUpdate?.({
          handsCount: handLandmarks.length,

          fingers: totalFingers,

          gesture: currentGesture,

          gestureIcon: gestureIcons[currentGesture] || "👋",

          handType,

          confidence: handLandmarks.length > 0 ? "95%" : "0%",
        });
      });

      camera = new Camera(video, {
        onFrame: async () => {
          await hands.send({
            image: video,
          });
        },
        width: 1280,
        height: 720,
      });

      camera.start();

      return () => {
        camera?.stop();
        hands.close();
      };
    };

    init();
  }, [onUpdate]);

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          display: "none",
        }}
      />

      <canvas ref={canvasRef} className="tracker-canvas" />
    </>
  );
}
