import React from "react";
import { FileText, MessageCircle, Users, Laptop } from "lucide-react";

const features = [
  {
    icon: <FileText className="w-8 h-8 text-blue-600" />,
    title: "File Sharing",
    description:
      "Easily upload and access study materials like PDFs, notes, and problem sets shared by the community.",
  },
  {
    icon: <MessageCircle className="w-8 h-8 text-green-600" />,
    title: "Discussions",
    description:
      "Ask questions, clear doubts, and collaborate with peers through vibrant discussion forums.",
  },
  {
    icon: <Laptop className="w-8 h-8 text-purple-600" />,
    title: "Live Collaboration",
    description:
      "Study together in real-time with tools for live note-taking, brainstorming, and project work.",
  },
  {
    icon: <Users className="w-8 h-8 text-pink-600" />,
    title: "Study Groups",
    description:
      "Create or join study groups based on subjects, exams, or interests, and learn together effectively.",
  },
];

const Features = () => {
  return (
    <div className="max-w-7xl font-quicksand mx-auto px-8 py-16 bg-[#0a0a0a]">
      <div className="text-center mb-20 relative group">
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
          System <span className="text-[#ff5e00]">Capabilities</span>
        </h2>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-2">Operational features // Integrated study ecosystem</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group/card flex flex-col items-center text-center p-8 bg-[#161616] border border-[#262626] rounded-3xl shadow-xl hover:border-[#ff5e00]/50 hover:bg-[#1a1a1a] transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-[#ff5e00] opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
            <div className="mb-6 p-4 bg-[#0a0a0a] rounded-2xl border border-[#262626] group-hover/card:border-[#ff5e00]/30 transition-colors shadow-inner">
               {React.cloneElement(feature.icon, { className: "w-8 h-8 text-[#ff5e00]" })}
            </div>
            <h3 className="text-sm font-black text-white mb-3 uppercase tracking-widest">{feature.title}</h3>
            <p className="text-gray-500 text-xs font-bold leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
