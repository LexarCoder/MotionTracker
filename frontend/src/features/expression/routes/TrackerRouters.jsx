import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "../../../layout/components/Layout";
import FaceTracker from "../pages/FaceTrackerPage";
import BodyTracker from "../pages/BodyTrackerPage";
import HandTracker from "../pages/HandTrackerPage";
import MotionTracker from "../pages/MotionTrackerPage";
import Protected from "../../auth/components/Protected";
export default function TrackerRouters() {
  return (
    <Routes>
      <Route
        element={
          <Protected>
            <Layout />
          </Protected>
        }
      >
        <Route path="/facetracker" element={<FaceTracker />} />
        <Route path="/bodytracker" element={<BodyTracker />} />
        <Route path="/handtracker" element={<HandTracker />} />
        <Route path="/motiontracker" element={<MotionTracker />} />
      </Route>
    </Routes>
  );
}
