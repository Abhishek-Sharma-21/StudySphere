import express from "express";
import { 
  getLiveSyncToken, 
  kickParticipant, 
  requestCallEntry, 
  getCallWaitingRoom, 
  admitParticipant 
} from "../controller/liveSync.controller.js";

import { authMiddleware } from "../middlewares/CheckAuthenication.js";

const router = express.Router();

// Fetch Token for Synchronization
router.post("/token", authMiddleware, getLiveSyncToken);

// Kick Participant (Admin Auth)
router.post("/kick", authMiddleware, kickParticipant);

// Admission Control
router.post("/request-entry", authMiddleware, requestCallEntry);
router.get("/waiting-room/:roomName", authMiddleware, getCallWaitingRoom);
router.post("/admit", authMiddleware, admitParticipant);

export default router;


