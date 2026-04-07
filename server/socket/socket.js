let io;
const userSocketMap = {}; // { userId: socketId }

export const initSocket = (socketIo) => {
  io = socketIo;

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId && userId !== "undefined") {
      userSocketMap[userId] = socket.id;
      console.log(`User connected: ${userId} (${socket.id})`);
    }

    // Join a specific group room for targeted updates
    socket.on("join_group", (groupId) => {
      socket.join(groupId);
      console.log(`Socket ${socket.id} joined group room: ${groupId}`);
      
      // Emit presence update to the room
      const roomSize = io.sockets.adapter.rooms.get(groupId)?.size || 0;
      io.to(groupId).emit("presence_update", { groupId, count: roomSize });
    });

    socket.on("leave_group", (groupId) => {
      socket.leave(groupId);
      console.log(`Socket ${socket.id} left group room: ${groupId}`);
      
      const roomSize = io.sockets.adapter.rooms.get(groupId)?.size || 0;
      io.to(groupId).emit("presence_update", { groupId, count: roomSize });
    });

    socket.on("disconnect", () => {
      if (userId) {
        delete userSocketMap[userId];
        console.log(`User disconnected: ${userId}`);
      }
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};
