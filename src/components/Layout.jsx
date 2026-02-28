import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-5 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
