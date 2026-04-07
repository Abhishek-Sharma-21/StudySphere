import { AccessToken, RoomServiceClient } from "livekit-server-sdk";
import dotenv from "dotenv";
import Group from "../models/group.model.js";
import { getIO } from "../socket/socket.js";


dotenv.config();

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;
const livekitUrl = process.env.LIVEKIT_URL;

const roomServiceClient = new RoomServiceClient(livekitUrl, apiKey, apiSecret);

/**
 * Generate a LiveKit Access Token for a participant.
 * @param {string} roomName - The name/ID of the Colony.
 * @param {string} participantName - The user's name.
 * @param {boolean} isAdmin - Whether the user has administrative permissions.
 */
const createToken = async (roomName, participantName, isAdmin) => {
  // Append a unique session identifier to allow multi-device/multi-browser login for same user
  const uniqueIdentity = `${participantName}-${Math.random().toString(36).substring(7)}`;
  
  const at = new AccessToken(apiKey, apiSecret, {
    identity: uniqueIdentity,
  });


  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
    roomAdmin: isAdmin, // Only admins get roomAdmin status
  });

  return await at.toJwt();
};

export const getLiveSyncToken = async (req, res) => {
  const { roomName, participantName, isAdmin } = req.body;
  const userId = req.user?.id;

  if (!roomName || !participantName) {
    return res.status(400).json({ message: "Room name and participant name are required." });
  }

  try {
    const group = await Group.findById(roomName);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // Admission Control Check
    if (group.callAdmissionMode === "request" && !isAdmin) {
      const waitEntry = group.callWaitingRoom.find(entry => String(entry.user) === String(userId));
      if (!waitEntry || waitEntry.status !== "approved") {
        return res.status(403).json({ message: "Access Denied: You have not been admitted to the colony session yet." });
      }
    }

    const token = await createToken(roomName, participantName, isAdmin);
    res.status(200).json({ token, serverUrl: livekitUrl });
  } catch (error) {
    console.error("LiveKit Token Generation Error:", error);
    res.status(500).json({ message: "Failed to generate synchronization token." });
  }
};

/**
 * Request Entry to a Live Call (Waiting Room)
 */
export const requestCallEntry = async (req, res) => {
  const { roomName } = req.body;
  const userId = req.user?.id;

  try {
    const group = await Group.findById(roomName);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // If already approved or open mode, return success
    if (group.callAdmissionMode === "open") {
      return res.status(200).json({ status: "approved", message: "Open Access mode active." });
    }

    const existingRequest = group.callWaitingRoom.find(r => String(r.user) === String(userId));
    if (existingRequest) {
      return res.status(200).json({ status: existingRequest.status, message: "Request already in queue." });
    }

    group.callWaitingRoom.push({ user: userId, status: "pending" });
    await group.save();

    const updatedGroup = await Group.findById(roomName).populate("callWaitingRoom.user", "name email");
    const io = getIO();
    io.to(roomName).emit("session_request_updated", { 
      groupId: roomName, 
      waitingRoom: updatedGroup.callWaitingRoom.filter(entry => entry.status === "pending") 
    });


    res.status(200).json({ status: "pending", message: "Neural synchronization request transmitted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get the Waiting Room for Admins
 */
export const getCallWaitingRoom = async (req, res) => {
  const { roomName } = req.params;

  try {
    const group = await Group.findById(roomName).populate("callWaitingRoom.user", "name email");
    if (!group) return res.status(404).json({ message: "Group not found" });

    res.status(200).json(group.callWaitingRoom.filter(entry => entry.status === "pending"));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Admit or Deny a Participant
 */
export const admitParticipant = async (req, res) => {
  const { roomName, targetUserId, action } = req.body; // action: 'approved' or 'denied'

  try {
    const group = await Group.findById(roomName);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const requestIndex = group.callWaitingRoom.findIndex(r => String(r.user) === String(targetUserId));
    if (requestIndex === -1) {
      return res.status(404).json({ message: "No such request in queue." });
    }

    if (action === "approved") {
      group.callWaitingRoom[requestIndex].status = "approved";
    } else {
      group.callWaitingRoom.splice(requestIndex, 1); // Remove if denied
    }

    await group.save();
    
    // Also sync the Group status in case admissionMode changed or members updated
    const fullUpdatedGroup = await Group.findById(roomName)
      .populate("admins", "name email")
      .populate("members", "name email")
      .populate("pendingRequests.user", "name email");
    
    const io = getIO();
    io.to(roomName).emit("group_synced", fullUpdatedGroup);
    
    // Specifically update the waiting room list for admins
    io.to(roomName).emit("session_request_updated", { 
      groupId: roomName, 
      waitingRoom: fullUpdatedGroup.callWaitingRoom.filter(entry => entry.status === "pending") 
    });

    res.status(200).json({ message: `Participant node ${action}.` });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Remove a participant from a LiveKit room.
 */
export const kickParticipant = async (req, res) => {
  const { roomName, participantIdentity } = req.body;

  if (!roomName || !participantIdentity) {
    return res.status(400).json({ message: "Room name and participant identity are required." });
  }

  try {
    // Forcibly remove the participant from the room
    await roomServiceClient.removeParticipant(roomName, participantIdentity);
    res.status(200).json({ message: `Participant ${participantIdentity} has been ejected.` });
  } catch (error) {
    console.error("LiveKit Kick Error:", error);
    res.status(500).json({ message: "Failed to eject participant." });
  }
};
