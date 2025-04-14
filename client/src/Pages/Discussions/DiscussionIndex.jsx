import React, { useState } from "react";

const DiscussionsIndex = () => {
  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      title: "Best Practices for React Hooks?",
      author: "John Doe",
      content:
        "What are some of the best practices you follow when working with React hooks?",
      comments: [
        {
          id: 101,
          author: "Jane Smith",
          text: "Avoid using hooks inside loops, conditions, or nested functions.",
        },
        {
          id: 102,
          author: "Peter Jones",
          text: "Use useCallback and useMemo to optimize performance.",
        },
      ],
    },
    {
      id: 2,
      title: "Tips for Learning Data Structures and Algorithms?",
      author: "Alice Johnson",
      content:
        "I'm struggling to understand data structures and algorithms. Any tips for beginners?",
      comments: [
        {
          id: 201,
          author: "Bob Williams",
          text: "Start with basic data structures like arrays and linked lists.",
        },
        {
          id: 202,
          author: "Eve Brown",
          text: "Practice coding problems on platforms like LeetCode and HackerRank.",
        },
      ],
    },
    // Add more discussions as needed
  ]);

  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    content: "",
  });
  const [newComment, setNewComment] = useState("");
  const [selectedDiscussionId, setSelectedDiscussionId] = useState(null);

  const handleDiscussionChange = (e) => {
    setNewDiscussion({ ...newDiscussion, [e.target.name]: e.target.value });
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const addDiscussion = () => {
    if (newDiscussion.title && newDiscussion.content) {
      setDiscussions([
        ...discussions,
        {
          id: Date.now(),
          title: newDiscussion.title,
          author: "You", // Assuming the current user is adding the discussion
          content: newDiscussion.content,
          comments: [],
        },
      ]);
      setNewDiscussion({ title: "", content: "" });
    }
  };

  const addComment = (discussionId) => {
    if (newComment) {
      setDiscussions(
        discussions.map((discussion) =>
          discussion.id === discussionId
            ? {
                ...discussion,
                comments: [
                  ...discussion.comments,
                  { id: Date.now(), author: "You", text: newComment }, // Assuming the current user is adding the comment
                ],
              }
            : discussion
        )
      );
      setNewComment("");
      setSelectedDiscussionId(null);
    }
  };

  return (
    <div className="container mx-auto font-quicksand p-4">
      <h1 className="text-3xl font-bold mb-4">Discussions</h1>

      {/* Add New Discussion */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Start a New Discussion</h2>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newDiscussion.title}
          onChange={handleDiscussionChange}
          className="w-full p-2 border rounded mb-2"
        />
        <textarea
          name="content"
          placeholder="Content"
          value={newDiscussion.content}
          onChange={handleDiscussionChange}
          className="w-full p-2 border rounded mb-2"
        />
        <button
          onClick={addDiscussion}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Post Discussion
        </button>
      </div>

      {/* List of Discussions */}
      {discussions.map((discussion) => (
        <div key={discussion.id} className="border rounded p-4 mb-4">
          <h2 className="text-2xl font-semibold mb-2">{discussion.title}</h2>
          <p className="text-gray-600 mb-2">By {discussion.author}</p>
          <p className="mb-4">{discussion.content}</p>

          {/* Comments */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Comments</h3>
            {discussion.comments.map((comment) => (
              <div key={comment.id} className="border rounded p-2 mb-2">
                <p className="text-gray-600 mb-1">
                  <strong>{comment.author}:</strong> {comment.text}
                </p>
              </div>
            ))}
          </div>

          {/* Add Comment */}
          <div>
            <textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={handleCommentChange}
              className="w-full p-2 border rounded mb-2"
            />
            <button
              onClick={() => addComment(discussion.id)}
              className="bg-green-500 text-white p-2 rounded"
            >
              Post Comment
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DiscussionsIndex;
