import { useState } from "react";
import {
  FaUniversity, FaClipboardList, FaTrain, FaShieldAlt,
  FaLandmark, FaChalkboardTeacher, FaUserShield,
  FaFileInvoiceDollar, FaBalanceScale, FaGraduationCap,
  FaLaptopCode, FaBook, FaBriefcase, FaFlask, FaGavel,
  FaChartLine, FaLeaf, FaPaintBrush, FaDraftingCompass,
  FaHotel, FaFilm, FaRunning, FaTshirt, FaPlane, FaSearch,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { ResourcesDetailPage } from "../../components/RouteNames/RouteName";

const topics = [
  { id: 1,  title: "Engineering & Technology",         description: "Electrical, Mechanical, Civil, Computer, and AI Engineering disciplines.", icon: <FaGraduationCap />,      category: "academic",     type: "Journals",      color: "from-blue-500 to-indigo-600" },
  { id: 2,  title: "Computer Science & IT",            description: "Software Development, Cybersecurity, Data Science, ML, and Cloud Computing.", icon: <FaLaptopCode />,        category: "academic",     type: "eBooks",        color: "from-violet-500 to-purple-700" },
  { id: 3,  title: "Mathematics & Statistics",         description: "Algebra, Calculus, Probability, Statistics, and Operations Research.", icon: <FaBook />,               category: "academic",     type: "PDF",           color: "from-cyan-500 to-blue-600" },
  { id: 4,  title: "Business & Management",            description: "Finance, Marketing, Analytics, Supply Chain, and Entrepreneurship.", icon: <FaBriefcase />,          category: "academic",     type: "Practice Sets", color: "from-amber-500 to-orange-600" },
  { id: 5,  title: "Medical & Health Sciences",        description: "Medicine, Pharmacy, Nursing, Public Health, and Biomedical Engineering.", icon: <FaFlask />,             category: "academic",     type: "Journals",      color: "from-rose-500 to-pink-600" },
  { id: 6,  title: "Law & Legal Studies",              description: "Corporate Law, IP, Criminal Justice, International Law, and Human Rights.", icon: <FaGavel />,             category: "academic",     type: "eBooks",        color: "from-slate-600 to-gray-700" },
  { id: 7,  title: "Economics & Social Sciences",      description: "Microeconomics, Behavioral Economics, Sociology, and Psychology.", icon: <FaChartLine />,          category: "academic",     type: "PDF",           color: "from-teal-500 to-emerald-600" },
  { id: 8,  title: "Environmental Sciences",           description: "Environmental Engineering, Geology, Climate Science, and Renewable Energy.", icon: <FaLeaf />,             category: "academic",     type: "Practice Sets", color: "from-green-500 to-teal-600" },
  { id: 9,  title: "Arts, Humanities & Communication", description: "History, Philosophy, Linguistics, Journalism, and Cultural Studies.", icon: <FaPaintBrush />,        category: "academic",     type: "Journals",      color: "from-fuchsia-500 to-pink-600" },
  { id: 10, title: "Architecture & Design",            description: "Architectural Design, Urban Planning, Interior Design, and Sustainability.", icon: <FaDraftingCompass />,   category: "academic",     type: "eBooks",        color: "from-orange-500 to-red-600" },
  { id: 11, title: "Education & Pedagogy",             description: "Curriculum Development, EdTech, Special Education, and E-Learning.", icon: <FaChalkboardTeacher />, category: "academic",     type: "PDF",           color: "from-sky-500 to-blue-600" },
  { id: 12, title: "Hospitality & Tourism",            description: "Hotel Management, Travel & Tourism, Event Planning, and Culinary Arts.", icon: <FaHotel />,             category: "academic",     type: "Practice Sets", color: "from-yellow-500 to-amber-600" },
  { id: 13, title: "Media & Film Studies",             description: "Film Production, Media Communication, Digital Media, and Animation.", icon: <FaFilm />,              category: "academic",     type: "Journals",      color: "from-red-500 to-rose-600" },
  { id: 14, title: "Sports Science & Physical Ed",     description: "Kinesiology, Sports Management, Athletic Training, and Exercise Science.", icon: <FaRunning />,           category: "academic",     type: "eBooks",        color: "from-lime-500 to-green-600" },
  { id: 15, title: "Fashion & Textile Design",         description: "Fashion Design, Textile Engineering, Apparel Merchandising, and Styling.", icon: <FaTshirt />,           category: "academic",     type: "PDF",           color: "from-pink-500 to-fuchsia-600" },
  { id: 16, title: "Aerospace & Aviation",             description: "Aeronautical Engineering, Pilot Training, and Aviation Management.", icon: <FaPlane />,             category: "academic",     type: "Practice Sets", color: "from-blue-600 to-indigo-700" },
  { id: 17, title: "UPSC Civil Services",              description: "Prepare for IAS, IPS, IFS, and other top administrative services.", icon: <FaUniversity />,        category: "competitive",  type: "eBooks",        color: "from-indigo-600 to-blue-800" },
  { id: 18, title: "SSC Exams",                        description: "CGL, CHSL, MTS, Stenographer and other SSC competitive exams.", icon: <FaClipboardList />,     category: "competitive",  type: "Practice Sets", color: "from-blue-500 to-cyan-600" },
  { id: 19, title: "Banking Exams",                    description: "IBPS PO, SBI PO, RBI Grade B, and more banking sector exams.", icon: <FaUniversity />,        category: "competitive",  type: "PDF",           color: "from-emerald-600 to-teal-700" },
  { id: 20, title: "Railway Exams",                    description: "RRB NTPC, Group D, JE, ALP, and other Railway Recruitment exams.", icon: <FaTrain />,             category: "competitive",  type: "Practice Sets", color: "from-sky-600 to-blue-700" },
  { id: 21, title: "Defence Services",                 description: "NDA, CDS, AFCAT, CAPF and other armed forces recruitment exams.", icon: <FaShieldAlt />,         category: "competitive",  type: "eBooks",        color: "from-slate-700 to-gray-800" },
  { id: 22, title: "State Public Service Commissions", description: "PCS, State Civil Services, and other local government posts.", icon: <FaLandmark />,          category: "competitive",  type: "PDF",           color: "from-violet-600 to-purple-700" },
  { id: 23, title: "Teaching Exams",                   description: "CTET, UPTET, KVS, DSSSB and other teacher eligibility tests.", icon: <FaChalkboardTeacher />, category: "competitive",  type: "Practice Sets", color: "from-orange-600 to-amber-700" },
  { id: 24, title: "Police & Paramilitary",            description: "SSC GD, SI, Constable, and related police recruitment exams.", icon: <FaUserShield />,        category: "competitive",  type: "eBooks",        color: "from-red-600 to-rose-700" },
  { id: 25, title: "Insurance Exams",                  description: "LIC AAO, LIC ADO, NIACL Assistant, and other insurance exams.", icon: <FaFileInvoiceDollar />, category: "competitive",  type: "PDF",           color: "from-teal-600 to-cyan-700" },
  { id: 26, title: "Judiciary Exams",                  description: "Civil Judge, Magistrate, and Judicial Services preparation.", icon: <FaBalanceScale />,      category: "competitive",  type: "Practice Sets", color: "from-amber-600 to-yellow-700" },
];

const typeBadgeColor = {
  "Journals":      "bg-blue-100 text-blue-700",
  "eBooks":        "bg-violet-100 text-violet-700",
  "PDF":           "bg-emerald-100 text-emerald-700",
  "Practice Sets": "bg-orange-100 text-orange-700",
};

const categories = [
  { key: "all",         label: "All Resources" },
  { key: "academic",    label: "Academic" },
  { key: "competitive", label: "Competitive Exams" },
];

const ResourceHomePage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery]       = useState("");

  const filteredTopics = topics.filter((t) => {
    const matchesCategory = activeCategory === "all" || t.category === activeCategory;
    const matchesSearch   = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-10 px-4 bg-[#0a0a0a] min-h-screen font-quicksand">
      {/* ── Header ── */}
      <div className="text-center mb-16 pb-16 border-b border-[#262626] relative group">
        <div className="absolute -left-4 top-0 w-1 h-20 bg-[#ff5e00] rounded-full opacity-50 group-hover:h-32 transition-all duration-700"></div>
        <p className="inline-flex items-center gap-3 bg-[#161616] border border-[#262626] text-[#ff5e00] text-[10px] font-black px-6 py-2 rounded-full mb-6 uppercase tracking-[0.3em] shadow-lg shadow-orange-900/10">
          STUDYSPHERE // KNOWLEDGE REPOSITORY
        </p>
        <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight tracking-tighter uppercase">
          Resource <span className="text-[#ff5e00]">Archive</span>
        </h1>
        <p className="text-gray-500 text-xs font-bold max-w-2xl mx-auto mb-10 uppercase tracking-widest leading-relaxed">
          Access specialized academic telemetry across 26 disciplines. 
          Multi-threaded data streams including Journals, eBooks, and Practice Protocols.
        </p>

        {/* Search */}
        <div className="relative max-w-xl mx-auto group/search">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within/search:text-[#ff5e00] transition-colors" />
          <input
            type="text"
            placeholder="SCAN REPOSITORY FOR SUBJECT DATA..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-5 rounded-[2rem] border border-[#262626] bg-[#161616] text-white text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-[#ff5e00]/20 focus:border-[#ff5e00] transition-all placeholder-gray-800 shadow-2xl"
          />
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap justify-center gap-16 mt-12">
          {[["26+", "Active Sectors"], ["4", "Data Formats"], ["SYNCED", "Network Status"]].map(([num, label]) => (
            <div key={label} className="text-center group/stat">
              <div className="text-2xl font-black text-white tracking-tighter group-hover:text-[#ff5e00] transition-colors">{num}</div>
              <div className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em] mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main ── */}
      <div className="max-w-7xl mx-auto">
        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-14">
          {categories.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                activeCategory === key
                  ? "bg-[#ff5e00] text-white shadow-xl shadow-orange-900/30 -translate-y-1"
                  : "bg-[#161616] text-gray-500 hover:text-white border border-[#262626] hover:border-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center gap-4 mb-10 overflow-hidden">
           <div className="h-px bg-[#262626] flex-1"></div>
           <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] whitespace-nowrap">
             Detected <span className="text-[#ff5e00]">{filteredTopics.length}</span> Active Nodes
             {searchQuery && <> in sector <span className="text-white">"{searchQuery}"</span></>}
           </p>
           <div className="h-px bg-[#262626] flex-1"></div>
        </div>

        {/* Cards grid */}
        {filteredTopics.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredTopics.map((topic) => (
              <Link
                key={topic.id}
                to={ResourcesDetailPage.replace(":topicId", topic.id)}
                className="group relative bg-[#161616] border border-[#262626] border-b-4 border-b-[#ff5e00] rounded-[2.5rem] p-8 transition-all duration-500 hover:bg-[#1a1a1a] flex flex-col hover:-translate-y-2 overflow-hidden shadow-xl"
              >
                {/* Decorative background element */}
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#ff5e00]/5 rounded-full blur-2xl group-hover:bg-[#ff5e00]/10 transition-all"></div>
                
                {/* Card header */}
                <div className="flex items-start justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-[#0a0a0a] border border-[#262626] flex items-center justify-center text-[#ff5e00] text-2xl shadow-inner group-hover:border-[#ff5e00]/50 transition-colors">
                    {topic.icon}
                  </div>
                  <span className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border border-white/5 shadow-sm ${topic.type === 'eBooks' ? 'bg-indigo-900/20 text-indigo-400' : topic.type === 'PDF' ? 'bg-emerald-900/20 text-emerald-400' : 'bg-[#ff5e00]/10 text-[#ff5e00]'}`}>
                    {topic.type}
                  </span>
                </div>

                {/* Card body */}
                <div className="flex flex-col flex-1 relative z-10">
                  <h3 className="text-sm font-black text-white mb-3 uppercase tracking-tight group-hover:text-[#ff5e00] transition-colors leading-tight">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-bold leading-relaxed flex-1 italic">
                    "{topic.description}"
                  </p>
                  
                  <div className="mt-8 pt-6 border-t border-[#262626] flex items-center justify-between group/link">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover/link:text-white transition-colors">Initiate Sync</span>
                    <div className="w-8 h-8 rounded-full bg-[#0a0a0a] border border-[#262626] flex items-center justify-center group-hover/link:bg-[#ff5e00] group-hover/link:text-white group-hover/link:border-transparent transition-all">
                       <span className="text-lg">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-[#161616] rounded-[4rem] border border-dashed border-[#262626] flex flex-col items-center">
            <div className="w-24 h-24 bg-[#0a0a0a] rounded-[2rem] flex items-center justify-center mb-8 border border-[#262626] shadow-inner">
               <FaSearch className="text-3xl text-gray-800" />
            </div>
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Zero Matches</h3>
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest max-w-xs mx-auto mb-10">No repository data matches the current search parameters.</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
              className="bg-[#ff5e00] text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#e65100] transition-all shadow-xl shadow-orange-900/20 active:scale-95"
            >
              Reset Global Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceHomePage;
