import { useState } from "react";
import { Link } from "react-router-dom";
import { communityPostDetail } from "../../components/RouteNames/RouteName";

const CommunityPost = () => {
  const [likedPosts, setLikedPosts] = useState([]); // Track liked post IDs

  const handleLikeButton = (postId) => {
    setLikedPosts(
      (prev) =>
        prev.includes(postId)
          ? prev.filter((id) => id !== postId) // Unlike
          : [...prev, postId] // Like
    );
  };

  const dummyPosts = [
    {
      id: 1,
      title: "Master DSA with *NeetCode*",
      shortDescription: "Best YouTube playlist to crack coding interviews!",
    },
    {
      id: 2,
      title: "Why Every Developer Should Learn Next.js 🚀",
      shortDescription: "Modern web apps need Next.js. Period.",
    },
    {
      id: 3,
      title: "First Contributions GitHub Repo",
      shortDescription: "Perfect starting point for open-source beginners.",
    },
    {
      id: 4,
      title: "Stay Ahead with *TLDR.tech*",
      shortDescription: "Bite-sized tech news daily. Stay updated!",
    },
    {
      id: 5,
      title: "VS Code Still Rules 👑",
      shortDescription:
        "Fast, lightweight, powerful extensions. Just unbeatable.",
    },
    {
      id: 6,
      title: "GitHub Copilot: AI Coding Partner",
      shortDescription: "Code faster and smarter with Copilot!",
    },
    {
      id: 7,
      title: "Top 10 JavaScript Tricks You Should Know",
      shortDescription: "Level up your JS skills today!",
    },
    {
      id: 8,
      title: "React 19 is Coming! What to Expect",
      shortDescription: "New features and optimizations incoming.",
    },
    {
      id: 9,
      title: "Top 5 Resources to Master TypeScript",
      shortDescription: "Take your TypeScript skills to pro level.",
    },
    {
      id: 10,
      title: "Node.js 2025 Trends 🚀",
      shortDescription: "Learn the upcoming Node.js innovations.",
    },
    {
      id: 11,
      title: "Master Tailwind CSS Quickly",
      shortDescription: "Supercharge your UI development.",
    },
    {
      id: 12,
      title: "Deploy Apps with Vercel & Netlify",
      shortDescription: "Get your projects live in minutes!",
    },
    {
      id: 13,
      title: "Learn MongoDB Basics in 1 Hour",
      shortDescription: "NoSQL made super simple.",
    },
    {
      id: 14,
      title: "Python vs JavaScript in 2025",
      shortDescription: "Which language should you master first?",
    },
    {
      id: 15,
      title: "Best Free APIs for Your Projects",
      shortDescription: "Spice up your apps using cool APIs.",
    },
    {
      id: 16,
      title: "How to Build a Portfolio Website",
      shortDescription: "Tips and templates for developers.",
    },
    {
      id: 17,
      title: "Understanding Git & GitHub Fast",
      shortDescription: "Version control essentials simplified.",
    },
    {
      id: 18,
      title: "AI Tools Every Student Should Know",
      shortDescription: "Boost productivity with AI apps.",
    },
    {
      id: 19,
      title: "What's New in HTML6?",
      shortDescription: "Future of HTML revealed!",
    },
    {
      id: 20,
      title: "5 Best Coding Fonts for 2025",
      shortDescription: "Your eyes will thank you later.",
    },
    {
      id: 21,
      title: "Use Docker Like a Pro",
      shortDescription: "Containerize your apps easily.",
    },
    {
      id: 22,
      title: "Learn Express.js in 30 Minutes",
      shortDescription: "Backend skills for web devs.",
    },
    {
      id: 23,
      title: "Why You Should Learn Rust 🦀",
      shortDescription: "Blazingly fast, memory-safe systems programming.",
    },
    {
      id: 24,
      title: "Clean Code Principles",
      shortDescription: "Write code that's easy to read and maintain.",
    },
    {
      id: 25,
      title: "SEO Tips for Developers",
      shortDescription: "Make your websites rank higher!",
    },
    {
      id: 26,
      title: "Top 10 VS Code Extensions",
      shortDescription: "Boost your productivity instantly.",
    },
    {
      id: 27,
      title: "How to Ace Tech Interviews",
      shortDescription: "Strategies and mindset for success.",
    },
    {
      id: 28,
      title: "Firebase vs Supabase",
      shortDescription: "Choosing the right backend service.",
    },
    {
      id: 29,
      title: "Top Programming Memes 😂",
      shortDescription: "Because coding should be fun too.",
    },
    {
      id: 30,
      title: "AI Future: Should You Be Worried?",
      shortDescription: "Opportunities and risks explained.",
    },
    {
      id: 31,
      title: "Should You Still Learn C++ in 2025?",
      shortDescription:
        "C++ isn't dead. Game dev, embedded systems, and high-frequency trading still love it. Should you?",
    },
    {
      id: 32,
      title: "What is Serverless Computing? 🤯",
      shortDescription:
        "Deploy apps without managing servers. AWS Lambda, Vercel, Cloudflare Workers — here's how serverless works.",
    },
    {
      id: 33,
      title: "Must-Know Git Commands Beyond Push & Pull",
      shortDescription:
        "Git rebase, cherry-pick, reflog — become a Git power user with these essential commands.",
    },
    {
      id: 34,
      title: "Dark Mode UX: Why It Matters",
      shortDescription:
        "Dark mode isn’t just a trend — it's easier on the eyes and can save battery. Here's how to design for it.",
    },
    {
      id: 35,
      title: "Introduction to Quantum Computing for Developers",
      shortDescription:
        "Quantum computers are here. Get a simple intro to qubits, superposition, and how it impacts developers.",
    },
    {
      id: 36,
      title: "Firebase vs. Supabase: Which Backend to Pick?",
      shortDescription:
        "Firebase is the OG, but Supabase offers open-source goodness. Which backend should you bet on?",
    },
    {
      id: 37,
      title: "Roadmap to Becoming a Full Stack Developer",
      shortDescription:
        "HTML, CSS, JS, Node.js, React, databases — here's a simple step-by-step roadmap to full stack mastery.",
    },
    {
      id: 38,
      title: "The Rise of AI Startups in 2025 🚀",
      shortDescription:
        "AI startups are booming — from health tech to edtech. Here’s what’s trending in the AI world.",
    },
    {
      id: 39,
      title: "Top Backend Frameworks You Should Know",
      shortDescription:
        "Express, Django, FastAPI, NestJS — backend dev in 2025 offers tons of options. Here’s what’s hot.",
    },
    {
      id: 40,
      title: "Everything You Need to Know About Web 3.0",
      shortDescription:
        "Blockchain, decentralization, NFTs, smart contracts — here’s what Web 3.0 actually means for developers.",
    },
    {
      id: 41,
      title: "Top VS Code Extensions for 10x Productivity ⚡",
      shortDescription:
        "Prettier, ESLint, Tabnine, GitLens — these extensions will level up your coding speed and quality.",
    },
    {
      id: 42,
      title: "Is Flutter Still Worth Learning in 2025?",
      shortDescription:
        "Cross-platform apps with beautiful UIs — Flutter continues to dominate mobile dev. Here’s why you should learn it.",
    },
    {
      id: 43,
      title: "What’s New in JavaScript ES2025",
      shortDescription:
        "New syntax, better performance, and cleaner async handling — check out the latest JavaScript features.",
    },
    {
      id: 44,
      title: "The Power of Personal Tech Blogs",
      shortDescription:
        "Blogging can skyrocket your career. Here’s how writing tech blogs makes you stand out to recruiters.",
    },
    {
      id: 45,
      title: "Monorepos vs. Polyrepos: What’s Better?",
      shortDescription:
        "Managing code at scale? Monorepo or polyrepo? Let’s break down the pros and cons.",
    },
    {
      id: 46,
      title: "How to Become an AWS Certified Developer",
      shortDescription:
        "AWS certification boosts your salary. Here’s a complete guide to passing the AWS Certified Developer exam.",
    },
    {
      id: 47,
      title: "Why You Should Learn Rust in 2025 🦀",
      shortDescription:
        "Memory safety, zero-cost abstractions, blazingly fast — Rust is redefining systems programming.",
    },
    {
      id: 48,
      title: "Cloudflare Workers: The Future of Serverless?",
      shortDescription:
        "Deploy serverless functions globally in milliseconds — Cloudflare Workers are reshaping serverless apps.",
    },
    {
      id: 49,
      title: "How to Ace Tech Interviews in 2025",
      shortDescription:
        "DSA, system design, behavioral rounds — a no-BS guide to cracking your next tech interview.",
    },
    {
      id: 50,
      title: "Top Paid Tech Internships 2025 💸",
      shortDescription:
        "Google, Meta, Stripe — here’s where you can bag the highest-paying internships next summer.",
    },
    {
      id: 51,
      title: "Best Practices for Writing Clean Code 🧹",
      shortDescription:
        "Readable, reusable, reliable — make your code beautiful with these tips.",
    },
    {
      id: 52,
      title: "Understanding OAuth 2.0 — Simply Explained",
      shortDescription:
        "Secure logins without passwords? Here’s how OAuth 2.0 powers authentication.",
    },
    {
      id: 53,
      title: "Containerization: Why Docker is a Developer’s Best Friend",
      shortDescription:
        "Ship apps fast, run them anywhere — Docker makes it possible.",
    },
    {
      id: 54,
      title: "How 5G is Changing App Development 📱",
      shortDescription:
        "Faster speeds, low latency — new doors are opening for mobile app developers.",
    },
    {
      id: 55,
      title: "CSS Grid vs Flexbox: When to Use Which?",
      shortDescription:
        "Both are powerful layout tools — learn when to use Flexbox vs Grid.",
    },
    {
      id: 56,
      title: "Top 5 VS Code Extensions for Faster Coding",
      shortDescription:
        "Prettier, ESLint, GitLens — speed up your development workflow with these extensions.",
    },
    {
      id: 57,
      title: "Why Cybersecurity Should Be Every Developer’s Priority 🔒",
      shortDescription:
        "From SQL injections to XSS attacks — learn the basics of keeping apps secure.",
    },
    {
      id: 58,
      title: "Augmented Reality Apps: Getting Started with ARKit",
      shortDescription:
        "Create your first AR app with Apple’s ARKit — the future is immersive.",
    },
  ];

  return (
    <div className="p-6 grid grid-cols-1 font-quicksand md:grid-cols-2  gap-6">
      {dummyPosts.map((post) => (
        <div
          key={post.id}
          className="border flex flex-col justify-between rounded-xl p-4 shadow hover:shadow-lg transition"
        >
          <Link
            to={communityPostDetail.replace(":postId", post.id)}
            className="text-xl font-bold mb-2"
          >
            {post.title}
          </Link>
          <p className="text-gray-600 mb-4">{post.shortDescription}</p>
          <button
            onClick={() => handleLikeButton(post.id)}
            className={`px-3 py-2 w-24 rounded-full   font-semibold transition ${
              likedPosts.includes(post.id)
                ? "bg-gray-200 text-gray-700"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {likedPosts.includes(post.id) ? "Liked ❤️" : "Like 🤍"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default CommunityPost;
