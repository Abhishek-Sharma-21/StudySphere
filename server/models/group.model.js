import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    privacy: { type: String, enum: ["public", "private"], default: "public" },
    tags: [{ type: String }],
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    pendingRequests: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        bio: String,
        links: [String],
        purpose: String,
        requestedAt: { type: Date, default: Date.now }
      }
    ],
    projects: [{ type: String }],
    image: { type: String }, // Optional group image URL
    isLive: { type: Boolean, default: false },
    callAdmissionMode: { type: String, enum: ["open", "request"], default: "open" },
    callWaitingRoom: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: { type: String, enum: ["pending", "approved", "denied"], default: "pending" },
        requestedAt: { type: Date, default: Date.now }
      }
    ],
    liveParticipants: { type: Number, default: 0 },
    resources: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        size: { type: Number }, // in bytes
        fileType: { type: String },
        resourceType: { type: String, default: "image" }, // for cloudinary deletion
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);


const Group = mongoose.model("Group", GroupSchema);
export default Group;
