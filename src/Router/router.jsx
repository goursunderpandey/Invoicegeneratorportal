/* eslint-disable react/prop-types */
import React from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import Header from "../InitialPage/Sidebar/Header";
import Sidebar from "../InitialPage/Sidebar/Sidebar";
import ThemeSettings from "../InitialPage/themeSettings";

import { pagesRoute, posRoutes, publicRoutes } from "./router.link";
import ProtectedRoute from "./ProtectedRoute";

const AllRoutes = () => {
  const data = useSelector((state) => state.toggle_header);

  // Layouts
  const HeaderLayout = () => (
    <div className={`main-wrapper ${data ? "header-collapse" : ""}`}>
      <Header />
      <Sidebar />
      <Outlet />
      <ThemeSettings />
    </div>
  );

  const Authpages = () => (
    <div className={data ? "header-collapse" : ""}>
      <Outlet />
      <ThemeSettings />
    </div>
  );

  const Pospages = () => (
    <div>
      <Header />
      <Outlet />
      <ThemeSettings />
    </div>
  );

  return (
    <Routes>
      {/* 🔒 Protected POS routes */}
      <Route
        path="/pos"
        element={
          <ProtectedRoute>
            <Pospages />
          </ProtectedRoute>
        }
      >
        {posRoutes.map((route, id) => (
          <Route path={route.path} element={route.element} key={id} />
        ))}
      </Route>

      {/* 🔒 Protected main app routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HeaderLayout />
          </ProtectedRoute>
        }
      >
        {publicRoutes.map((route, id) => (
          <Route path={route.path} element={route.element} key={id} />
        ))}
      </Route>

      {/* 🌐 Public auth routes */}
      <Route element={<Authpages />}>
        {pagesRoute.map((route, id) => (
          <Route path={route.path} element={route.element} key={id} />
        ))}
      </Route>
    </Routes>
  );
};

export default AllRoutes;
