import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import Group from "../models/group.model.js";
import { fileURLToPath } from "url";
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../.env") });

const seedGroups = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not found in environment");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for group seeding...");

    const users = await User.find().limit(7);
    if (users.length < 1) {
      console.log("No users found. Please run seedPosts.js first.");
      process.exit(1);
    }

    const groupsData = [
      {
        name: "React Mastery Circle",
        description: "A deep dive into advanced React patterns, hooks, and performance optimization. Weekly pair programming sessions included.",
        admin: users[0]._id,
        members: [users[0]._id, users[1]._id, users[2]._id],
        projects: ["StudySphere Frontend", "Open Source UI Library"],
      },
      {
        name: "Data Science Squad",
        description: "Exploring machine learning, data visualization, and predictive modeling using Python and R. Join us for kaggle competitions!",
        admin: users[1]._id,
        members: [users[1]._id, users[3]._id, users[4]._id],
        projects: ["Stock Predictor", "Customer Segmentation"],
      },
      {
        name: "DevOps & Cloud Native",
        description: "Breaking down Docker, Kubernetes, and CI/CD pipelines. We focus on building scalable and resilient infrastructure.",
        admin: users[2]._id,
        members: [users[2]._id, users[5]._id, users[0]._id],
        projects: ["K8s Cluster Setup", "Auto-deploy Script"],
      },
      {
        name: "UI/UX Design Hub",
        description: "Focusing on user-centric design, typography, and color theory. We critique each other's designs and build beautiful interfaces.",
        admin: users[4]._id,
        members: [users[4]._id, users[6]._id, users[1]._id],
        projects: ["StudySphere Redesign", "Mobile App Mockup"],
      },
    ];

    // Optional: Clear existing groups
    // await Group.deleteMany({});

    await Group.insertMany(groupsData);
    console.log(`Successfully seeded ${groupsData.length} study groups!`);

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding groups:", error);
    process.exit(1);
  }
};

seedGroups();
