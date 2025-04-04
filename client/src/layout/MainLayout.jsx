import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import LeftSide from "../components/Home/LeftSide";
const MainLayout = () => {
  return (
    <section className="relative flex min-h-screen w-full ">
      {/* Navbar - Stays on Top */}
      <Navbar className="fixed top-0 left-0 w-full z-50 shadow-md " />

      {/* Left Sidebar */}
      <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white  p-4 shadow-md">
        <LeftSide />
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 mr-64 min-h-screen py-28 px-10">
        <Outlet />
      </main>
    </section>
  );
};

export default MainLayout;
