import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const userId = user?._id || user?.user?._id;

  useEffect(() => {
    let newSocket;
    if (isAuthenticated && userId) {
      const socketHost = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || "http://localhost:3000";
      newSocket = io(socketHost, {
        query: { userId },
      });

      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log(`Connected to Neural Sync server at ${socketHost}`);
      });

      return () => {
        newSocket.close();
        setSocket(null);
      };
    } else {
      setSocket(prev => {
        if (prev) prev.close();
        return null;
      });
    }
  }, [isAuthenticated, userId]);



  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

