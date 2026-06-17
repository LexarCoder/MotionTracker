import React from "react";
import PageRouter from "../pages/routes/PageRouter";
import TrakerRouters from "../features/expression/routes/TrackerRouters";
import AuthRoutes from "../features/auth/routes/AuthRoutes";
import { BrowserRouter } from "react-router-dom";

function routes() {
  return (
    <>
      <BrowserRouter>
        <PageRouter />
          <TrakerRouters />
        <AuthRoutes />
      </BrowserRouter>
    </>
  );
}

export default routes;
