import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Features from "../pages/Features";
import Contact from "../pages/Contact";
import Profile from "../../layout/components/Profile";
import Layout from "../../layout/components/Layout";

function PageRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element ={<Profile/>}/>
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}

export default PageRouter;
