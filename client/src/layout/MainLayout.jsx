import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import LeftSide from "../components/Home/LeftSide";
const MainLayout = () => {
  return (
    <section className="relative flex min-h-screen w-full bg-[#0a0a0a]">
      {/* Navbar - Stays on Top */}
      <Navbar className="fixed top-0 left-0 w-full z-50 shadow-md" />

      {/* Left Sidebar */}
      <aside className="fixed left-0 top-[3.75rem] h-[calc(100vh-3.75rem)] w-64 bg-[#0f0f0f] p-4 border-r border-[#262626] overflow-y-auto">
        <LeftSide />
      </aside>
 
      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen py-20 px-6">
        <Outlet />
      </main>
    </section>
  );
};

export default MainLayout;
