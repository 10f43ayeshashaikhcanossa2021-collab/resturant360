import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "../../styles/dashboard.css";


function DashboardLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <div className={`dashboard ${isDarkMode ? "dark-theme" : "light-theme"}`}>

      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />


      <div className={`main-content ${isCollapsed ? "sidebar-collapsed" : ""}`}>
        <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
