import React from "react";

const ResourcesDashboard = () => {
  return (
    <div>
      <div className="flex justify-between items-center  p-6 mb-4">
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
  );
};

export default ResourcesDashboard;
