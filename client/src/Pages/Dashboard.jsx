import { Globe } from "lucide-react";
import React from "react";
import {
  FaHome,
  FaBook,
  FaComments,
  FaVideo,
  FaUsers,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa"; // Import icons
import { Link } from "react-router-dom";
import { RouteIndex } from "../components/RouteNames/RouteName";

const Dashboard = () => {
  return (
    <div className="flex h-screen font-quicksand bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <Link to={RouteIndex} className="flex items-center mb-8">
          <span className="text-2xl font-bold mr-2">
            <Globe size={18} color="white" />
          </span>
          <span className="text-lg">StudySphere</span>
        </Link>
        <nav>
          <a
            href="#"
            className="flex items-center py-2 px-4 rounded hover:bg-gray-700"
          >
            <FaHome className="mr-2" /> Dashboard
          </a>
          <Link
            to="/resources"
            className="flex items-center py-2 px-4 rounded hover:bg-gray-700"
          >
            <FaBook className="mr-2" /> Resources
          </Link>
          <a
            href="#"
            className="flex items-center py-2 px-4 rounded hover:bg-gray-700"
          >
            <FaComments className="mr-2" /> Discussions
          </a>
          <a
            href="#"
            className="flex items-center py-2 px-4 rounded hover:bg-gray-700"
          >
            <FaVideo className="mr-2" /> Live Collaboration
          </a>
          <a
            href="#"
            className="flex items-center py-2 px-4 rounded hover:bg-gray-700"
          >
            <FaUsers className="mr-2" /> Study Groups
          </a>
          <a
            href="#"
            className="flex items-center py-2 px-4 rounded hover:bg-gray-700"
          >
            <FaCog className="mr-2" /> Settings
          </a>
          <a
            href="#"
            className="flex items-center py-2 px-4 rounded hover:bg-gray-700 mt-auto"
          >
            <FaSignOutAlt className="mr-2" /> Log out
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to StudySphere!</h1>
          <p className="text-gray-600">
            Your ultimate hub for collaborative learning and resource sharing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Resources Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Resources</h2>
              <a href="#" className="text-blue-500">
                View all
              </a>
            </div>
            <ul className="space-y-2">
              <li className="flex justify-between items-center bg-white p-4 rounded shadow">
                <span>Data Structures Cheat Sheet.pdf</span>
                <span className="text-gray-500">4K</span>
              </li>
              <li className="flex justify-between items-center bg-white p-4 rounded shadow">
                <span>Debugging Tips.png</span>
                <span className="text-gray-500">3K</span>
              </li>
              <li className="flex justify-between items-center bg-white p-4 rounded shadow">
                <span>SQL Tutorial.docx</span>
                <span className="text-gray-500">5K</span>
              </li>
              <li className="flex justify-between items-center bg-white p-4 rounded shadow">
                <span>Python Quick Reference.pdf</span>
                <span className="text-gray-500">5M</span>
              </li>
            </ul>
          </div>

          {/* Study Groups Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Study Groups</h2>
              <a href="#" className="text-blue-500">
                See all
              </a>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center bg-white p-4 rounded shadow">
                <div className="w-10 h-10 rounded-full bg-blue-200 mr-4"></div>
                <div>
                  <h3 className="font-semibold">Web Development</h3>
                  <p className="text-gray-500">Meeting in 2 hours</p>
                </div>
              </li>
              <li className="flex items-center bg-white p-4 rounded shadow">
                <div className="w-10 h-10 rounded-full bg-green-200 mr-4"></div>
                <div>
                  <h3 className="font-semibold">Algorithms</h3>
                  <p className="text-gray-500">Meeting at 4.00 PM</p>
                </div>
              </li>
              <li className="flex items-center bg-white p-4 rounded shadow">
                <div className="w-10 h-10 rounded-full bg-yellow-200 mr-4"></div>
                <div>
                  <h3 className="font-semibold">Database Systems</h3>
                  <p className="text-gray-500">Meeting tomorrow</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Discussions Section */}
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Discussions</h2>
              <a href="#" className="text-blue-500">
                View all
              </a>
            </div>
            <ul className="space-y-2">
              <li className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold">Help with dynamic programming</h3>
                <p className="text-gray-500">14 hours ago</p>
              </li>
              <li className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold">Best practices for API design</h3>
                <p className="text-gray-500">14 hours ago</p>
              </li>
              <li className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold">
                  Introduction to machine learning
                </h3>
                <p className="text-gray-500">54 minutes ago</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Start Live Collaboration Button */}
        <div className="text-center mt-8">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full">
            Start Live Collaboration
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
