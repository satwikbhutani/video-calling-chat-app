import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useState } from "react";

const Layout = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(true);


  const toggleSidebar = () => {
    setShowSidebar(prev => !prev);
  };

  return (
    <div className="min-h-screen">
      <div className="flex">
        {showSidebar && <Sidebar />}
        <div className="flex-1 flex flex-col">
          <Navbar showLogo={!showSidebar} toggleSidebar={toggleSidebar} />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
