import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "../InitialPage/Sidebar/Header";
import Sidebar from "../InitialPage/Sidebar/Sidebar";
import { pagesRoute, posRoutes, publicRoutes } from "./router.link";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import ThemeSettings from "../InitialPage/themeSettings";
import ProtectedRoute from "./ProtectedRoute";

const AllRoutes = () => {
  const data = useSelector((state) => state.toggle_header);

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
    <div>
      <Routes>
        {/* ✅ POS routes (Private) */}
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

        {/* ✅ App main pages (Private) */}
        <Route
          path={"/"}
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

        {/* ✅ Auth pages (Public) */}
        <Route path={"/"} element={<Authpages />}>
          {pagesRoute.map((route, id) => (
            <Route path={route.path} element={route.element} key={id} />
          ))}
        </Route>
      </Routes>
    </div>
  );
};
export default AllRoutes;
