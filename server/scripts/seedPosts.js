import mongoose from "mongoose";
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    const names = ["Abhishek", "Ayush", "Govind", "Aditya", "Vanik", "Sachin", "Vikash"];
    const password = await bcryptjs.hash("password123", 10);
    
    const users = [];
    for (const name of names) {
      let user = await User.findOne({ email: `${name.toLowerCase()}@studysphere.com` });
      if (!user) {
        user = await User.create({
          name,
          email: `${name.toLowerCase()}@studysphere.com`,
          password,
        });
        console.log(`Created user: ${name}`);
      }
      users.push(user);
    }

    const posts = [
      {
        title: "Mastering Data Structures with Abhishek",
        shortDescription: "A deep dive into arrays and linked lists for competitive coding.",
        longDescription: "In this community post, I share my experience with basic data structures and how they form the foundation of problem solving.",
        category: "community",
        creator: users[0]._id,
      },
      {
        title: "Discussion: React vs Vue in 2024",
        shortDescription: "Which framework should a beginner start with?",
        longDescription: "Let's discuss the pros and cons of modern frontend frameworks. I've been using React for a while but Vue looks promising.",
        category: "discussion",
        creator: users[0]._id,
      },
      {
        title: "Ayush's Tips for Effective Time Management",
        shortDescription: "How to balance study and projects effectively.",
        longDescription: "Time management is key for students. I use the Pomodoro technique and it has changed my productivity levels significantly.",
        category: "community",
        creator: users[1]._id,
      },
      {
        title: "Is it worth learning C++ for Backend?",
        shortDescription: "Discussion on using C++ for high performance backend services.",
        longDescription: "C++ is often overlooked for backend due to faster alternatives like Go or Node.js. What do you guys think?",
        category: "discussion",
        creator: users[1]._id,
      },
      {
        title: "Govind's Machine Learning Roadmap",
        shortDescription: "Step by step guide from Math to Deep Learning.",
        longDescription: "I've compiled a list of resources that helped me land an ML internship. Starting from linear algebra to building transformers.",
        category: "community",
        creator: users[2]._id,
      },
      {
        title: "Best VS Code Extensions for JS",
        shortDescription: "Govind shares his favorite productivity tools.",
        longDescription: "Extensions like Prettier, ESLint, and GitLens are essential. Do you have any hidden gems to share?",
        category: "discussion",
        creator: users[2]._id,
      },
      {
        title: "Aditya's System Design Basics",
        shortDescription: "Understanding scalability, load balancing, and caching.",
        longDescription: "System design is fundamental for senior roles. Here I explain the core concepts of building distributed systems.",
        category: "community",
        creator: users[3]._id,
      },
      {
        title: "Monolith vs Microservices for Startups",
        shortDescription: "Aditya asks: When should we transition?",
        longDescription: "Many startups start with microservices too early. Let's discuss when is the right time to make the switch.",
        category: "discussion",
        creator: users[3]._id,
      },
      {
        title: "Vanik's UI/UX Case Study: StudySphere",
        shortDescription: "How I designed the interaction flow for our app.",
        longDescription: "Designing a student portal requires a balance between information density and ease of use. This is how I approached it.",
        category: "community",
        creator: users[4]._id,
      },
      {
        title: "Discussion on Glassmorphism in Web Design",
        shortDescription: "Is the trend still alive or fading away?",
        longDescription: "Vanik wants to know your opinion on the 'frosted glass' look. Does it improve accessibility or hinder it?",
        category: "discussion",
        creator: users[4]._id,
      },
      {
        title: "Sachin's Guide to DevOps for Beginners",
        shortDescription: "Docker, Kubernetes, and CI/CD pipelines explained.",
        longDescription: "Deploying code is just as important as writing it. This guide covers the basics of modern deployment workflows.",
        category: "community",
        creator: users[5]._id,
      },
      {
        title: "Serverless vs Traditional Hosting",
        shortDescription: "Sachin opens a debate on costs and complexity.",
        longDescription: "AWS Lambda or a dedicated EC2 instance? Let's talk about the cold start issues and vendor lock-in.",
        category: "discussion",
        creator: users[5]._id,
      },
      {
        title: "Vikash's Python for Automation Scripts",
        shortDescription: "Save hours by automating your daily boring tasks.",
        longDescription: "Python is perfect for scripting. I've automated my file organization and email reports with these simple scripts.",
        category: "community",
        creator: users[6]._id,
      },
      {
        title: "Discussion: The Future of AI in Coding",
        shortDescription: "Vikash asks: Will AI eventually replace junior devs?",
        longDescription: "With tools like Copilot and Antigravity getting better, how should students prepare for their first job?",
        category: "discussion",
        creator: users[6]._id,
      },
    ];

    // Clear existing posts (optional, but good for clean seed)
    // await Post.deleteMany({}); 
    
    await Post.insertMany(posts);
    console.log(`Successfully seeded ${posts.length} posts and discussions!`);

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
