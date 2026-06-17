import React, { useEffect, useRef } from "react";

const MotionTracker = ({
  videoRef,
  isArmed,
  sensitivity,
  onMotionDetected,
  onMotionStopped,
}) => {
  const canvasRef = useRef(document.createElement("canvas"));
  const requestRef = useRef(null);
  const previousFrameRef = useRef(null);
  const motionTimeoutRef = useRef(null);

  // Naya: Camera jab on hota hai toh shuru mein light adjust karta hai.
  // Humein shuru ke kuch frames (lagbhag 2 seconds) ignore karne hain warna fake alarm bajega.
  const warmupFramesRef = useRef(0);

  const PROCESS_WIDTH = 64;
  const PROCESS_HEIGHT = 48;

  // Theek kiya hua Threshold: 20 bohot sensitive tha, 45 thoda kam. 30 ekdum best hai sir ki movement ke liye.
  const PIXEL_NOISE_THRESHOLD = 40;

  useEffect(() => {
    canvasRef.current.width = PROCESS_WIDTH;
    canvasRef.current.height = PROCESS_HEIGHT;
    warmupFramesRef.current = 0; // Har baar arm hone pe reset

    const detectMotion = () => {
      if (!isArmed || !videoRef.current || videoRef.current.readyState !== 4) {
        requestRef.current = requestAnimationFrame(detectMotion);
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });

      ctx.drawImage(video, 0, 0, PROCESS_WIDTH, PROCESS_HEIGHT);
      const currentFrame = ctx.getImageData(
        0,
        0,
        PROCESS_WIDTH,
        PROCESS_HEIGHT,
      ).data;

      if (previousFrameRef.current) {
        // Camera Warmup (Shuru ke 60 frames lagbhag 1-2 second delay deta hai auto-focus ke liye)
        if (warmupFramesRef.current < 60) {
          warmupFramesRef.current++;
          previousFrameRef.current = new Uint8ClampedArray(currentFrame);
          requestRef.current = requestAnimationFrame(detectMotion);
          return;
        }

        let diffPixels = 0;
        const totalPixels = PROCESS_WIDTH * PROCESS_HEIGHT;

        for (let i = 0; i < currentFrame.length; i += 4) {
          const rDiff = Math.abs(currentFrame[i] - previousFrameRef.current[i]);
          const gDiff = Math.abs(
            currentFrame[i + 1] - previousFrameRef.current[i + 1],
          );
          const bDiff = Math.abs(
            currentFrame[i + 2] - previousFrameRef.current[i + 2],
          );

          if (rDiff + gDiff + bDiff > PIXEL_NOISE_THRESHOLD) {
            diffPixels++;
          }
        }

        const motionPercentage = (diffPixels / totalPixels) * 100;

        if (motionPercentage >= sensitivity) {
          onMotionDetected(motionPercentage);

          if (motionTimeoutRef.current) clearTimeout(motionTimeoutRef.current);

          motionTimeoutRef.current = setTimeout(() => {
            onMotionStopped();
          }, 1500);
        }
      }

      previousFrameRef.current = new Uint8ClampedArray(currentFrame);
      requestRef.current = requestAnimationFrame(detectMotion);
    };

    if (isArmed) {
      requestRef.current = requestAnimationFrame(detectMotion);
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (motionTimeoutRef.current) clearTimeout(motionTimeoutRef.current);
    };
  }, [isArmed, sensitivity, videoRef, onMotionDetected, onMotionStopped]);

  return null;
};

export default MotionTracker;
