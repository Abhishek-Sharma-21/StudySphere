import React from "react";

const GroupDashboard = () => {
  return (
    <div>
      <div className="flex justify-between items-center p-6 mb-4">
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
  );
};

export default GroupDashboard;
