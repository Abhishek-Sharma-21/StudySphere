import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const MainLayout = () => {
  return (
    <section className="flex min-h-screen w-full">
      {/* Left Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg ">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen bg-gray-50 p-2 pt-1">
        <Outlet />
      </main>
    </section>
  );
};

export default MainLayout;
