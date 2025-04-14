import React from "react";
import { MdEdit, MdDelete } from "react-icons/md"; // Importing the update and delete icons from React Icons

const DiscussionDashboard = () => {
  return (
    <div className="md:col-span-2 font-quicksand">
      <div className="flex justify-between items-center p-6 mb-4">
        <h2 className="text-xl font-semibold">Community-Posts</h2>
      </div>
      <ul className="space-y-2">
        <li className="bg-white p-4 rounded shadow flex justify-between items-center">
          <div>
            <h3 className="font-semibold">Help with dynamic programming</h3>
            <p className="text-gray-500">14 hours ago</p>
          </div>
          <div className="flex space-x-4">
            <button className="text-yellow-500 hover:text-yellow-700 transition duration-300">
              <MdEdit className="w-5 h-5" />
            </button>
            <button className="text-red-500 hover:text-red-700 transition duration-300">
              <MdDelete className="w-5 h-5" />
            </button>
          </div>
        </li>
        <li className="bg-white p-4 rounded shadow flex justify-between items-center">
          <div>
            <h3 className="font-semibold">Best practices for API design</h3>
            <p className="text-gray-500">14 hours ago</p>
          </div>
          <div className="flex space-x-4">
            <button className="text-yellow-500 hover:text-yellow-700 transition duration-300">
              <MdEdit className="w-5 h-5" />
            </button>
            <button className="text-red-500 hover:text-red-700 transition duration-300">
              <MdDelete className="w-5 h-5" />
            </button>
          </div>
        </li>
        <li className="bg-white p-4 rounded shadow flex justify-between items-center">
          <div>
            <h3 className="font-semibold">Introduction to machine learning</h3>
            <p className="text-gray-500">54 minutes ago</p>
          </div>
          <div className="flex space-x-4">
            <button className="text-yellow-500 hover:text-yellow-700 transition duration-300">
              <MdEdit className="w-5 h-5" />
            </button>
            <button className="text-red-500 hover:text-red-700 transition duration-300">
              <MdDelete className="w-5 h-5" />
            </button>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default DiscussionDashboard;
