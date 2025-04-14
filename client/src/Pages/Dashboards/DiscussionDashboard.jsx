import React from "react";

const DiscussionDashboard = () => {
  return (
    <div className="md:col-span-2">
      <div className="flex justify-between items-center p-6 mb-4">
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
          <h3 className="font-semibold">Introduction to machine learning</h3>
          <p className="text-gray-500">54 minutes ago</p>
        </li>
      </ul>
    </div>
  );
};

export default DiscussionDashboard;
