import React from "react";
import { useParams } from "react-router-dom";

const ResourcesDetail = () => {
  // Get the route parameters using useParams hook
  const { topicId } = useParams();

  return (
    <div>
      <h2>Resource Detail</h2>
      {topicId ? (
        <p>You are viewing the details for resource ID: {topicId}</p>
      ) : (
        <p>No resource ID provided.</p>
      )}
      {/* You would typically fetch and display resource details here
           based on the 'id' parameter. */}
    </div>
  );
};

export default ResourcesDetail;
