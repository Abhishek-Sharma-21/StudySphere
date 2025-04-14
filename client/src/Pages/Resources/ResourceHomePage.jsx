import React from "react";
import {
  FaUniversity,
  FaClipboardList,
  FaTrain,
  FaShieldAlt,
  FaLandmark,
  FaChalkboardTeacher,
  FaUserShield,
  FaFileInvoiceDollar,
  FaBalanceScale,
  FaGraduationCap,
  FaLaptopCode,
  FaBook,
  FaBriefcase,
  FaFlask,
  FaGavel,
  FaChartLine,
  FaLeaf,
  FaPaintBrush,
  FaDraftingCompass,
  FaHotel,
  FaFilm,
  FaRunning,
  FaTshirt,
  FaPlane,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { ResourcesDetailPage } from "../../components/RouteNames/RouteName";

const topics = [
  {
    id: 1,
    title: "Engineering & Technology",
    description:
      "Electrical, Mechanical, Civil, Computer, and AI Engineering disciplines.",
    icon: <FaGraduationCap className="text-3xl text-blue-600" />,
    category: "academic",
    type: "journals",
  },
  {
    id: 2,
    title: "Computer Science & IT",
    description:
      "Software Development, Cybersecurity, Data Science, Machine Learning, and Cloud Computing.",
    icon: <FaLaptopCode className="text-3xl text-blue-600" />,
    category: "academic",
    type: "ebooks",
  },
  {
    id: 3,
    title: "Mathematics & Statistics",
    description:
      "Algebra, Calculus, Probability, Statistics, Data Analysis, and Operations Research.",
    icon: <FaBook className="text-3xl text-blue-600" />,
    category: "academic",
    type: "pdf",
  },
  {
    id: 4,
    title: "Business & Management Studies",
    description:
      "Finance, Marketing, Business Analytics, Supply Chain Management, and Entrepreneurship.",
    icon: <FaBriefcase className="text-3xl text-blue-600" />,
    category: "academic",
    type: "practice set",
  },
  {
    id: 5,
    title: "Medical & Health Sciences",
    description:
      "Medicine, Pharmacy, Nursing, Public Health, Anatomy, and Biomedical Engineering.",
    icon: <FaFlask className="text-3xl text-blue-600" />,
    category: "academic",
    type: "journals",
  },
  {
    id: 6,
    title: "Law & Legal Studies",
    description:
      "Corporate Law, Intellectual Property, Criminal Justice, International Law, and Human Rights Law.",
    icon: <FaGavel className="text-3xl text-blue-600" />,
    category: "academic",
    type: "ebooks",
  },
  {
    id: 7,
    title: "Economics & Social Sciences",
    description:
      "Microeconomics, Behavioral Economics, Sociology, Psychology, and International Relations.",
    icon: <FaChartLine className="text-3xl text-blue-600" />,
    category: "academic",
    type: "pdf",
  },
  {
    id: 8,
    title: "Environmental & Earth Sciences",
    description:
      "Environmental Engineering, Geology, Climate Science, and Renewable Energy.",
    icon: <FaLeaf className="text-3xl text-blue-600" />,
    category: "academic",
    type: "practice set",
  },
  {
    id: 9,
    title: "Arts, Humanities & Communication",
    description:
      "History, Philosophy, Linguistics, Journalism, Literature, and Cultural Studies.",
    icon: <FaPaintBrush className="text-3xl text-blue-600" />,
    category: "academic",
    type: "journals",
  },
  {
    id: 10,
    title: "Architecture & Design",
    description:
      "Architectural Design, Urban Planning, Interior Design, and Sustainable Architecture.",
    icon: <FaDraftingCompass className="text-3xl text-blue-600" />,
    category: "academic",
    type: "ebooks",
  },
  {
    id: 11,
    title: "Education & Pedagogy",
    description:
      "Curriculum Development, Educational Technology, Special Education, and E-Learning.",
    icon: <FaChalkboardTeacher className="text-3xl text-blue-600" />,
    category: "academic",
    type: "pdf",
  },
  {
    id: 12,
    title: "Hospitality & Tourism Management",
    description:
      "Hotel Management, Travel & Tourism, Event Planning, and Culinary Arts.",
    icon: <FaHotel className="text-3xl text-blue-600" />,
    category: "academic",
    type: "practice set",
  },
  {
    id: 13,
    title: "Media & Film Studies",
    description:
      "Film Production, Media Communication, Digital Media, and Animation.",
    icon: <FaFilm className="text-3xl text-blue-600" />,
    category: "academic",
    type: "journals",
  },
  {
    id: 14,
    title: "Sports Science & Physical Education",
    description:
      "Kinesiology, Sports Management, Athletic Training, and Exercise Science.",
    icon: <FaRunning className="text-3xl text-blue-600" />,
    category: "academic",
    type: "ebooks",
  },
  {
    id: 15,
    title: "Fashion & Textile Design",
    description:
      "Fashion Design, Textile Engineering, Apparel Merchandising, and Styling.",
    icon: <FaTshirt className="text-3xl text-blue-600" />,
    category: "academic",
    type: "pdf",
  },
  {
    id: 16,
    title: "Aerospace & Aviation Studies",
    description:
      "Aeronautical Engineering, Pilot Training, and Aviation Management.",
    icon: <FaPlane className="text-3xl text-blue-600" />,
    category: "academic",
    type: "practice set",
  },
  {
    id: 17,
    title: "UPSC Civil Services",
    description:
      "Prepare for IAS, IPS, IFS, and other top administrative services.",
    icon: <FaUniversity className="text-3xl text-gray-700" />,
    category: "competitive",
    type: "ebooks",
  },
  {
    id: 18,
    title: "SSC Exams",
    description:
      "CGL, CHSL, MTS, Stenographer and other SSC competitive exams.",
    icon: <FaClipboardList className="text-3xl text-gray-700" />,
    category: "competitive",
    type: "practice set",
  },
  {
    id: 19,
    title: "Banking Exams",
    description:
      "IBPS PO, IBPS Clerk, SBI PO, RBI Grade B, and more banking sector exams.",
    icon: <FaUniversity className="text-3xl text-gray-700" />,
    category: "competitive",
    type: "pdf",
  },
  {
    id: 20,
    title: "Railway Exams",
    description:
      "RRB NTPC, Group D, JE, ALP, and other Railway Recruitment exams.",
    icon: <FaTrain className="text-3xl text-gray-700" />,
    category: "competitive",
    type: "practice set",
  },
  {
    id: 21,
    title: "Defence Services",
    description:
      "NDA, CDS, AFCAT, CAPF and other armed forces recruitment exams.",
    icon: <FaShieldAlt className="text-3xl text-gray-700" />,
    category: "competitive",
    type: "ebooks",
  },
  {
    id: 22,
    title: "State Public Service Commissions",
    description:
      "Prepare for PCS, State Civil Services, and other local government posts.",
    icon: <FaLandmark className="text-3xl text-gray-700" />,
    category: "competitive",
    type: "pdf",
  },
  {
    id: 23,
    title: "Teaching Exams",
    description: "CTET, UPTET, KVS, DSSSB and other teacher eligibility tests.",
    icon: <FaChalkboardTeacher className="text-3xl text-gray-700" />,
    category: "competitive",
    type: "practice set",
  },
  {
    id: 24,
    title: "Police & Paramilitary Forces",
    description: "SSC GD, SI, Constable, and related police recruitment exams.",
    icon: <FaUserShield className="text-3xl text-gray-700" />,
    category: "competitive",
    type: "ebooks",
  },
  {
    id: 25,
    title: "Insurance Exams",
    description:
      "LIC AAO, LIC ADO, NIACL Assistant, and other insurance sector exams.",
    icon: <FaFileInvoiceDollar className="text-3xl text-gray-700" />,
    category: "competitive",
    type: "pdf",
  },
  {
    id: 26,
    title: "Judiciary Exams",
    description:
      "Preparation for Civil Judge, Magistrate, and Judicial Services.",
    icon: <FaBalanceScale className="text-3xl text-gray-700" />,
    category: "competitive",
    type: "practice set",
  },
];

const ResourceHomePage = () => {
  const [activeCategory, setActiveCategory] = React.useState("all");

  const filteredTopics =
    activeCategory === "all"
      ? topics
      : topics.filter((topic) => topic.category === activeCategory);

  return (
    <div className="bg-gray-50 font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Educational Resources
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive learning materials and preparation guides for academic
            disciplines and competitive examinations.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`px-5 py-2.5 text-sm font-medium rounded-l-lg border ${
                activeCategory === "all"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              All Resources
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("academic")}
              className={`px-5 py-2.5 text-sm font-medium border-t border-b ${
                activeCategory === "academic"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              Academic Disciplines
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("competitive")}
              className={`px-5 py-2.5 text-sm font-medium rounded-r-lg border ${
                activeCategory === "competitive"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              Competitive Exams
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                  {topic.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {topic.title}
                </h3>
                <p className="text-gray-600 text-sm">{topic.description}</p>
              </div>
              <div className="px-6 py-3   border-t border-gray-100">
                <Link
                  to={ResourcesDetailPage.replace(":topicId", topic.id)}
                  className="text-blue-600  text-sm font-medium hover:text-blue-800 transition-colors duration-200"
                >
                  Explore Resources
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourceHomePage;
