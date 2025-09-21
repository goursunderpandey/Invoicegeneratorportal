/* eslint-disable react/prop-types */
import React from "react";
import { Navigate } from "react-router-dom";
import { all_routes } from "./all_routes";

const ProtectedRoute = ({ children }) => {
    const routes = all_routes;
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to={routes.signintwo} replace />;
  }
  return children;
};

export default ProtectedRoute;
