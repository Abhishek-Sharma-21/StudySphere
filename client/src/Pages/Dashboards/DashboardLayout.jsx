import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";

const MainLayout = () => {
  const { isInCall } = useSelector((state) => state.liveSync);

  return (
    <section className="flex min-h-screen w-full bg-[#0a0a0a]">
      {/* Sidebar handles its own positioning & fixed height */}
      <Sidebar />

      {/* Main Content - Dynamic ml to match Sidebar collapse */}
      <main className={`flex-1 ${isInCall ? "ml-20" : "ml-64"} transition-all duration-500 min-h-screen p-10 no-scrollbar overflow-x-hidden`}>
        <Outlet />
      </main>

    </section>
  );
};

export default MainLayout;
