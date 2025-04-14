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
    <div className="max-w-6xl font-inter mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-center mb-12">
        Features of StudySphere
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-6 border rounded-2xl shadow-md hover:shadow-lg transition duration-300"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
