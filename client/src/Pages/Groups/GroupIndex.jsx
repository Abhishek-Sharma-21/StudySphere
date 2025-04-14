import React, { useState } from "react";
import { FaUsers, FaPlusCircle, FaUserPlus, FaEllipsisH } from "react-icons/fa";

const GroupsIndex = () => {
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: "React Developers Network",
      description:
        "A collaborative hub for React developers to exchange knowledge and projects.",
      members: ["John Doe", "Jane Smith", "Peter Jones"],
      projects: ["React UI Library", "E-commerce Platform"],
    },
    {
      id: 2,
      name: "Data Science Innovators",
      description:
        "A community for data scientists to explore cutting-edge techniques and projects.",
      members: ["Alice Johnson", "Bob Williams", "Eve Brown"],
      projects: ["Predictive Analytics Tool", "Data Visualization Dashboard"],
    },
  ]);

  const [newGroup, setNewGroup] = useState({ name: "", description: "" });
  const [showAddGroupForm, setShowAddGroupForm] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [showGroupMenu, setShowGroupMenu] = useState(false);

  const handleGroupChange = (e) => {
    setNewGroup({ ...newGroup, [e.target.name]: e.target.value });
  };

  const addGroup = () => {
    if (newGroup.name && newGroup.description) {
      setGroups([
        ...groups,
        {
          id: Date.now(),
          name: newGroup.name,
          description: newGroup.description,
          members: ["You"],
          projects: [],
        },
      ]);
      setNewGroup({ name: "", description: "" });
      setShowAddGroupForm(false);
    }
  };

  const handleViewGroup = (groupId) => {
    setSelectedGroupId(groupId);
    // Simulate navigation to the group's page or display group details
    console.log(`View group with ID: ${groupId}`);
  };

  const toggleGroupMenu = (event, groupId) => {
    event.stopPropagation(); // Prevent event bubbling
    setSelectedGroupId(groupId);
    setShowGroupMenu(!showGroupMenu);
  };

  return (
    <div className="container mx-auto font-quicksand p-6">
      <h1 className="text-3xl font-semibold mb-6 flex items-center">
        <FaUsers className="mr-2 text-blue-600" /> Community Groups
      </h1>

      <div className="mb-8">
        {!showAddGroupForm ? (
          <button
            onClick={() => setShowAddGroupForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded flex items-center"
          >
            <FaPlusCircle className="mr-2" /> Create New Group
          </button>
        ) : (
          <div className="p-4 border rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaPlusCircle className="mr-2 text-green-600" /> New Group Details
            </h2>
            <input
              type="text"
              name="name"
              placeholder="Group Name"
              value={newGroup.name}
              onChange={handleGroupChange}
              className="w-full p-2 border rounded mb-2"
            />
            <textarea
              name="description"
              placeholder="Group Description"
              value={newGroup.description}
              onChange={handleGroupChange}
              className="w-full p-2 border rounded mb-2"
            />
            <div className="flex justify-end">
              <button
                onClick={addGroup}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mr-2"
              >
                Create
              </button>
              <button
                onClick={() => setShowAddGroupForm(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div
            key={group.id}
            className="border rounded shadow-md flex flex-col"
          >
            <div className="p-6 flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">{group.name}</h2>
                  <p className="text-gray-700 mb-4">{group.description}</p>
                </div>
                <div className="relative">
                  <button
                    onClick={(event) => toggleGroupMenu(event, group.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaEllipsisH />
                  </button>
                  {showGroupMenu && selectedGroupId === group.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                        Edit Group
                      </button>
                      <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                        Delete Group
                      </button>
                      {/* Add more menu items as needed */}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <FaUsers className="mr-2 text-indigo-600" /> Members
                </h3>
                <p className="text-gray-600">{group.members.join(", ")}</p>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <FaUserPlus className="mr-2 text-green-600" /> Projects
                </h3>
                <ul className="list-disc list-inside">
                  {group.projects.map((project, index) => (
                    <li key={index} className="text-gray-600">
                      {project}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 border-t">
              <button
                onClick={() => handleViewGroup(group.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded w-full"
              >
                View Group
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupsIndex;
