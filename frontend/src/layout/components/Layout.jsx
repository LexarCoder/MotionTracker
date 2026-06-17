import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../Style/Outlet.scss"

export default function Layout() {
  return (
    <div className="layout">
      {/* Shared Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
