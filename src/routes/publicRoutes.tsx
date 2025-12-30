// src/routes/publicRoutes.tsx
import React from "react";
import { Route } from "react-router-dom";
import Home from "../views/Home";
// Add other public routes...

const PublicRoutes = () => (
  <>
    <Route path="/" element={<Home />} />
  </>
);

export default PublicRoutes;
