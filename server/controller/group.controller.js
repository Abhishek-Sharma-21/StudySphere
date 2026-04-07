import Group from "../models/group.model.js";
import { getIO } from "../socket/socket.js";

// Cloudinary removed as per request for static feature


export const createGroup = async (req, res) => {
  const { name, description, projects, privacy, tags } = req.body;
  const userId = req.user?.id;

  if (!name || !description) {
    return res.status(400).json({ message: "Name and description are required." });
  }

  try {
    const existingGroup = await Group.findOne({ name });
    if (existingGroup) {
      return res.status(400).json({ message: "Group name already exists." });
    }

    const group = await Group.create({
      name,
      description,
      projects: projects || [],
      privacy: privacy || "public",
      tags: tags || [],
      admins: [userId],
      members: [userId], // Admin is the first member
    });

    const populatedGroup = await Group.findById(group._id)
      .populate("admins", "name email")
      .populate("members", "name email");

    res.status(201).json(populatedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find()
      .populate("admins", "name email")
      .populate("members", "name email")
      .populate("pendingRequests.user", "name email")
      .populate("resources.uploader", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("admins", "name email")
      .populate("members", "name email")
      .populate("pendingRequests.user", "name email")
      .populate("resources.uploader", "name email");
    if (!group) return res.status(404).json({ message: "Group not found" });
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const joinGroup = async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;

  try {
    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.members.includes(userId)) {
      return res.status(400).json({ message: "You are already a member." });
    }

    if (group.privacy === "private") {
      return res.status(400).json({ message: "This group is private. Please request to join." });
    }

    group.members.push(userId);
    await group.save();

    const updatedGroup = await Group.findById(id)
      .populate("admins", "name email")
      .populate("members", "name email")
      .populate("pendingRequests.user", "name email");

    // Socket: Sync all group nodes with updated membership state
    const io = getIO();
    io.to(id).emit("group_synced", updatedGroup);

    res.status(200).json(updatedGroup);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const requestToJoinGroup = async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;
  const { bio, links, purpose } = req.body;

  try {
    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.members.includes(userId)) {
      return res.status(400).json({ message: "You are already a member." });
    }

    const alreadyRequested = group.pendingRequests.some(req => String(req.user) === String(userId));
    if (alreadyRequested) {
      return res.status(400).json({ message: "Join request already pending." });
    }

    group.pendingRequests.push({ user: userId, bio, links, purpose });
    await group.save();

    const updatedGroup = await Group.findById(id)
      .populate("admins", "name email")
      .populate("members", "name email")
      .populate("pendingRequests.user", "name email");

    // Socket: Notify all nodes in this group room
    const io = getIO();
    io.to(id).emit("request_updated", updatedGroup);

    res.status(200).json(updatedGroup);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const handleJoinRequest = async (req, res) => {
  const { id, requestId } = req.params; // Group ID and Request User ID
  const { action } = req.body; // 'approve' or 'reject'
  const adminId = req.user?.id;

  try {
    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (!group.admins.includes(adminId)) {
      return res.status(403).json({ message: "Only admins can handle join requests." });
    }

    const requestIndex = group.pendingRequests.findIndex(req => String(req.user) === String(requestId));
    if (requestIndex === -1) {
      return res.status(404).json({ message: "Join request not found." });
    }

    if (action === "approve") {
      group.members.push(requestId);
    }

    group.pendingRequests.splice(requestIndex, 1);
    await group.save();

    const updatedGroup = await Group.findById(id)
      .populate("admins", "name email")
      .populate("members", "name email")
      .populate("pendingRequests.user", "name email");

    // Socket: Sync all group nodes with updated membership state
    const io = getIO();
    io.to(id).emit("group_synced", updatedGroup);

    res.status(200).json(updatedGroup);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const leaveGroup = async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;

  try {
    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // If last admin leaves, designate new admin or group becomes inactive?
    // For now, prevent leaving if last admin.
    if (group.admins.length === 1 && String(group.admins[0]) === String(userId)) {
      return res.status(400).json({ message: "Admin cannot leave the group. Transfer ownership first." });
    }

    group.members = group.members.filter((m) => String(m) !== String(userId));
    group.admins = group.admins.filter((a) => String(a) !== String(userId));
    await group.save();

    const updatedGroup = await Group.findById(id)
      .populate("admins", "name email")
      .populate("members", "name email");

    res.status(200).json(updatedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleLiveStatus = async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;
  const { admissionMode = "open" } = req.body;

  try {
    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // Robust Admin Check: Handle both ID strings and populated objects
    const isAdmin = group.admins.some(admin => {
       const adminId = admin._id ? admin._id.toString() : admin.toString();
       return adminId === String(userId);
    });

    if (!isAdmin) {
      return res.status(403).json({ message: "Only admins can toggle live status." });
    }

    group.isLive = !group.isLive;
    
    if (group.isLive) {
      group.callAdmissionMode = admissionMode;
      group.callWaitingRoom = []; 
      group.liveParticipants = 1; 
    } else {
      group.callWaitingRoom = [];
      group.liveParticipants = 0;
    }

    await group.save();

    const updatedGroup = await Group.findById(id)
      .populate("admins", "name email")
      .populate("members", "name email")
      .populate("pendingRequests.user", "name email");

    // Socket: Sync all group nodes and broadcast global status
    const io = getIO();
    io.to(id).emit("group_synced", updatedGroup);
    io.emit("global_group_update", { 
      groupId: id, 
      isLive: updatedGroup.isLive, 
      liveParticipants: updatedGroup.liveParticipants 
    });

    res.status(200).json(updatedGroup);

  } catch (error) {
    console.error("CRITICAL ERROR in toggleLiveStatus:", error);
    res.status(500).json({ message: error.message });
  }
};




export const removeMember = async (req, res) => {
  const { id, userId } = req.params; // Group ID and target User ID
  const adminId = req.user?.id;

  try {
    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // Check if requester is an admin
    if (!group.admins.some(a => String(a) === String(adminId))) {
      return res.status(403).json({ message: "Only admins can remove members." });
    }

    // Prevent removing the last admin
    if (group.admins.length === 1 && String(group.admins[0]) === String(userId)) {
      return res.status(400).json({ message: "Cannot remove the last admin. Transfer ownership first." });
    }

    // Remove from members and admins
    group.members = group.members.filter(m => String(m) !== String(userId));
    group.admins = group.admins.filter(a => String(a) !== String(userId));

    await group.save();

    const updatedGroup = await Group.findById(id)
      .populate("admins", "name email")
      .populate("members", "name email")
      .populate("pendingRequests.user", "name email");

    // Socket: Sync all group nodes with updated membership state
    const io = getIO();
    io.to(id).emit("group_synced", updatedGroup);

    res.status(200).json(updatedGroup);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteGroup = async (req, res) => {
  const { id } = req.params;
  const adminId = req.user?.id;

  try {
    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // Check if requester is an admin
    if (!group.admins.some(a => String(a) === String(adminId))) {
      return res.status(403).json({ message: "Only admins can delete the group." });
    }

    await Group.findByIdAndDelete(id);

    res.status(200).json({ message: "Group deleted successfully", groupId: id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadResource = async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user?.id;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file transmitted." });
  }

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    // const result = await uploadToCloudinary(file.buffer, file.originalname);

    // Mock response for static resource feature
    const resource = {
       name: file.originalname,
       url: "https://via.placeholder.com/150?text=Static+Resource", // Placeholder URL
       publicId: `static_${Date.now()}`,
       resourceType: "raw",
       uploader: userId,
       size: file.size,
       fileType: file.mimetype
    };

    group.resources.push(resource);
    await group.save();

    const populatedGroup = await Group.findById(groupId).populate("members admins resources.uploader", "name email");

    // Real-time Sync
    const io = getIO();
    io.to(groupId).emit("group_synced", populatedGroup);

    res.status(200).json({ message: "Data transmitted to repository.", group: populatedGroup });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Transmission failed.", error: error.message });
  }
};

export const deleteResource = async (req, res) => {
  const { groupId, resourceId } = req.params;
  const userId = req.user?.id;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    const resource = group.resources.id(resourceId);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found." });
    }

    const isAdmin = group.admins.some(admin => String(admin._id || admin) === String(userId));
    const isUploader = String(resource.uploader) === String(userId);

    if (!isAdmin && !isUploader) {
      return res.status(403).json({ message: "Not authorized to delete this resource." });
    }

    // await deleteFromCloudinary(resource.publicId, resource.resourceType);
    group.resources.pull(resourceId);
    await group.save();

    const populatedGroup = await Group.findById(groupId).populate("members admins resources.uploader", "name email");

    // Real-time Sync
    const io = getIO();
    io.to(groupId).emit("group_synced", populatedGroup);

    res.status(200).json({ message: "Resource purged from repository.", group: populatedGroup });
  } catch (error) {
    res.status(500).json({ message: "Purge failed.", error: error.message });
  }
};


