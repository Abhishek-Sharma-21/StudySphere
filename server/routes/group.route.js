import express from "express";
import {
  createGroup,
  getAllGroups,
  getGroupById,
  joinGroup,
  leaveGroup,
  requestToJoinGroup,
  handleJoinRequest,
  toggleLiveStatus,
  removeMember,
  deleteGroup,
  uploadResource,
  deleteResource
} from "../controller/group.controller.js";
import upload from "../middlewares/multer.middleware.js";


import { authMiddleware } from "../middlewares/CheckAuthenication.js";

const router = express.Router();

router.post("/groups/create", authMiddleware, createGroup);
router.get("/groups", getAllGroups);
router.get("/groups/:id", getGroupById);
router.post("/groups/join/:id", authMiddleware, joinGroup);
router.post("/groups/leave/:id", authMiddleware, leaveGroup);
router.post("/groups/:id/request", authMiddleware, requestToJoinGroup);
router.post("/groups/:id/requests/:requestId", authMiddleware, handleJoinRequest);
router.patch("/groups/:id/toggle-live", authMiddleware, toggleLiveStatus);
router.delete("/groups/:id/members/:userId", authMiddleware, removeMember);
router.delete("/groups/:id", authMiddleware, deleteGroup);

// Repository Routes
router.post("/groups/:groupId/resources/upload", authMiddleware, upload.single("file"), uploadResource);
router.delete("/groups/:groupId/resources/:resourceId", authMiddleware, deleteResource);



export default router;
