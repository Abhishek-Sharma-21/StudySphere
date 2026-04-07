import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { 
  Users, Plus, LogIn, LogOut, Search, 
  Settings, UserPlus, Info, Layout, 
  ArrowRight, Shield, Activity, Loader, X,
  Globe, Lock, Zap, ExternalLink, Link as LinkIcon
} from "lucide-react";
import { getAllGroups, createGroup, joinGroup, requestToJoin, resetGroupState } from "../../features/groupSlice";
import toast from "react-hot-toast";

/* ─── Join Request Modal ───────────────────────────────── */
const JoinRequestModal = ({ group, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({ bio: "", links: "", purpose: "" });
  
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#0a0a0a]/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#161616] w-full max-w-lg rounded-[3rem] p-12 shadow-2xl border border-[#262626] relative overflow-hidden flex flex-col">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#ff5e00]"></div>
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Access <span className="text-[#ff5e00]">Request</span></h2>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Target Node: {group.name}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-[#0a0a0a] text-gray-500 hover:text-white rounded-full flex items-center justify-center border border-[#262626] transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Identity Bio</label>
            <textarea 
              required
              placeholder="Brief professional summary..."
              className="w-full p-4 bg-[#0a0a0a] border border-[#262626] rounded-2xl text-white text-sm font-bold focus:ring-2 focus:ring-[#ff5e00]/30 outline-none transition-all resize-none"
              rows={2}
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Neural Links (GitHub, LinkedIn, Portfolios)</label>
            <input 
              type="text"
              placeholder="Comma separated URLs..."
              className="w-full p-4 bg-[#0a0a0a] border border-[#262626] rounded-2xl text-white text-sm font-black focus:ring-2 focus:ring-[#ff5e00]/30 outline-none transition-all"
              value={formData.links}
              onChange={(e) => setFormData({...formData, links: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mission Objective</label>
            <textarea 
              required
              placeholder="Why do you wish to join this workspace?"
              className="w-full p-4 bg-[#0a0a0a] border border-[#262626] rounded-2xl text-white text-sm font-bold focus:ring-2 focus:ring-[#ff5e00]/30 outline-none transition-all resize-none"
              rows={3}
              value={formData.purpose}
              onChange={(e) => setFormData({...formData, purpose: e.target.value})}
            />
          </div>

          <button type="submit" className="w-full bg-[#ff5e00] hover:bg-[#e65100] text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-900/30 transition-all active:scale-95">
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

const GroupIndex = () => {
  const dispatch = useDispatch();
  const { groups, loading, error, success } = useSelector((state) => state.groups);
  const { token, user, isAuthenticated } = useSelector((state) => state.auth);
  const currentUserId = user?._id || user?.user?._id;

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(null); // stores the group object
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [formData, setFormData] = useState({ name: "", description: "", privacy: "public", tags: "" });

  useEffect(() => {
    dispatch(getAllGroups());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      toast.success("Group operation successful! 🎊");
      setShowCreateModal(false);
      setFormData({ name: "", description: "", privacy: "public", tags: "" });
      dispatch(resetGroupState());
    }
    if (error) {
      toast.error(error);
      dispatch(resetGroupState());
    }
  }, [success, error, dispatch]);

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error("Please login first");
    const tagsArray = formData.tags.split(",").map(t => t.trim()).filter(Boolean);
    dispatch(createGroup({ token, groupData: { ...formData, tags: tagsArray } }));
  };

  const handleJoinClick = (group) => {
    if (!isAuthenticated) return toast.error("Login to interact with nodes! 🔒");
    
    if (group.privacy === "private") {
      setShowJoinModal(group);
    } else {
      dispatch(joinGroup({ token, groupId: group._id }));
    }
  };

  const handleRequestSubmit = (requestData) => {
    const linksArray = requestData.links.split(",").map(l => l.trim()).filter(Boolean);
    dispatch(requestToJoin({ 
      token, 
      groupId: showJoinModal._id, 
      requestData: { ...requestData, links: linksArray } 
    })).then((res) => {
      if (requestToJoin.fulfilled.match(res)) {
        toast.success("Request transmitted to admins");
        setShowJoinModal(null);
      }
    });
  };

  const filteredGroups = groups.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          g.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || 
                          (activeFilter === "private" && g.privacy === "private") ||
                          (activeFilter === "public" && g.privacy === "public");
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto p-10 font-quicksand bg-[#0a0a0a] min-h-screen">
      
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-16 relative">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-1 h-8 bg-[#ff5e00] rounded-full"></div>
             <h1 className="text-5xl font-black text-white tracking-tighter uppercase">
               Active <span className="text-[#ff5e00]">Colonies</span>
             </h1>
          </div>
          <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] ml-4">Advanced collaborative workspace nodes</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-80 group/search">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within/search:text-[#ff5e00] transition-colors" />
            <input 
              type="text"
              placeholder="SCAN FOR NODE ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-[#161616] border border-[#262626] rounded-[2rem] text-white text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-[#ff5e00]/20 focus:border-[#ff5e00] outline-none shadow-2xl transition-all placeholder-gray-800"
            />
          </div>
          
          <button 
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-4 bg-[#ff5e00] hover:bg-[#e65100] text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-900/40 transition-all active:scale-95"
          >
            <Zap className="w-4 h-4" />
            Initialize Node
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-12 overflow-x-auto pb-4 no-scrollbar">
        {["all", "public", "private"].map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeFilter === f 
                ? "bg-[#161616] text-[#ff5e00] border border-[#ff5e00]/30 shadow-lg shadow-orange-900/10" 
                : "text-gray-600 border border-transparent hover:text-gray-400"
            }`}
          >
            {f === "all" ? "All Sectors" : f === "public" ? "Open Access" : "Restricted Access"}
          </button>
        ))}
      </div>

      {loading && !groups.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-80 bg-[#161616] animate-pulse rounded-[3rem] border border-[#262626]" />
          ))}
        </div>
      ) : filteredGroups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredGroups.map((group) => {
            const isMember = group.members?.some(m => String(m._id || m) === String(currentUserId));
            const isPending = group.pendingRequests?.some(req => String(req.user?._id || req.user) === String(currentUserId));
            
            return (
              <div 
                key={group._id}
                className="group relative bg-[#161616] border border-[#262626] border-b-8 border-b-[#ff5e00] rounded-[3rem] p-10 transition-all duration-500 hover:bg-[#1a1a1a] flex flex-col hover:-translate-y-2 shadow-2xl overflow-hidden"
              >
                {/* Visual Flair */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#ff5e00]/5 rounded-full blur-3xl group-hover:bg-[#ff5e00]/10 transition-all duration-700"></div>

                <div className="flex-grow relative z-10">
                  {/* Status Badges */}
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex flex-col gap-2">
                       <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest ${group.privacy === 'private' ? 'bg-indigo-900/20 text-indigo-400 border-indigo-900/30' : 'bg-emerald-900/20 text-emerald-400 border-emerald-900/30'}`}>
                         {group.privacy === 'private' ? <Lock size={10} /> : <Globe size={10} />}
                         {group.privacy === 'private' ? 'Restricted' : 'Open Node'}
                       </div>
                       {group.isLive && (
                         <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-900/20 text-rose-500 border border-rose-900/30 rounded-xl text-[9px] font-black uppercase tracking-widest animate-pulse">
                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                            Live Now ({group.liveParticipants})
                         </div>
                       )}
                    </div>
                    <div className="w-16 h-16 bg-[#0a0a0a] rounded-[1.5rem] flex items-center justify-center text-[#ff5e00] border border-[#262626] shadow-inner group-hover:scale-110 transition-transform">
                      <Layout className="w-8 h-8" />
                    </div>
                  </div>

                  <h2 className="text-2xl font-black text-white mb-3 uppercase tracking-tighter leading-tight group-hover:text-[#ff5e00] transition-colors">
                    {group.name}
                  </h2>
                  
                  <div className="flex items-center gap-4 mb-6 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <Users size={12} className="text-[#ff5e00]" />
                      {group.members?.length || 0} Synchronized
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-8 font-bold italic">
                    "{group.description}"
                  </p>

                  {/* Core Tags */}
                  <div className="flex flex-wrap gap-2 mb-10">
                    {(group.tags?.length > 0 ? group.tags : ["Deep Learning", "Sync-Mode"]).map((tag, i) => (
                      <span key={i} className="text-[8px] font-black text-gray-700 bg-black/30 border border-[#262626] px-3 py-1 rounded-lg uppercase tracking-[0.2em]">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 relative z-10">
                  {isMember ? (
                    <Link 
                      to={`/groups/${group._id}`}
                      className="flex-1 bg-[#ff5e00] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center shadow-lg shadow-orange-900/30 hover:bg-[#e65100] transition-all"
                    >
                      Enter Chamber
                    </Link>
                  ) : isPending ? (
                    <div className="flex-1 bg-[#262626] text-gray-500 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center border border-gray-800">
                      Sync Pending...
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleJoinClick(group)}
                      className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                        group.privacy === 'private' 
                          ? "bg-[#262626] text-gray-400 hover:text-white border border-[#333] hover:border-gray-600" 
                          : "bg-[#ff5e00] text-white hover:bg-[#e65100] shadow-lg shadow-orange-900/30"
                      }`}
                    >
                      {group.privacy === 'private' ? <Lock size={12} /> : <LogIn size={12} />}
                      {group.privacy === 'private' ? 'Request Link' : 'Establish Connection'}
                    </button>
                  )}
                  
                  <button className="w-14 h-14 bg-[#0a0a0a] border border-[#262626] rounded-2xl flex items-center justify-center text-gray-600 hover:text-white hover:border-[#ff5e00]/50 transition-all">
                    <Info size={20} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-32 bg-[#161616] rounded-[4rem] border border-dashed border-[#262626] flex flex-col items-center">
          <div className="w-32 h-32 bg-[#0a0a0a] rounded-[2.5rem] shadow-inner flex items-center justify-center mb-10 border border-[#262626]">
            <Users className="w-12 h-12 text-gray-800" />
          </div>
          <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Void Segment</h3>
          <p className="text-gray-600 max-w-sm font-black uppercase tracking-[0.2em] text-[10px] mb-12">
            No active colonies detected in this region. 
            Initialize a new node to begin synchronization.
          </p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-[#ff5e00] text-white px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-900/40 animate-bounce active:scale-95 transition-all"
          >
            Deploy First Colony
          </button>
        </div>
      )}

      {/* Initialize Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a0a]/90 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-[#161616] w-full max-w-2xl rounded-[4rem] p-16 shadow-2xl border border-[#262626] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#ff5e00]"></div>
            
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Node <span className="text-[#ff5e00]">Deployment</span></h2>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Configure operational parameters</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="w-12 h-12 bg-[#0a0a0a] text-gray-500 hover:text-white rounded-full flex items-center justify-center border border-[#262626] transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Colony Designation</label>
                  <input 
                    required
                    placeholder="e.g., SYNC_POINT_ALPHA"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-5 bg-[#0a0a0a] border border-[#262626] rounded-3xl focus:ring-2 focus:ring-[#ff5e00]/20 outline-none font-black text-white text-xs placeholder-gray-800 transition-all uppercase"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Access Protocol</label>
                  <select 
                    value={formData.privacy}
                    onChange={(e) => setFormData({ ...formData, privacy: e.target.value })}
                    className="w-full p-5 bg-[#0a0a0a] border border-[#262626] rounded-3xl focus:ring-2 focus:ring-[#ff5e00]/20 outline-none font-black text-white text-xs transition-all appearance-none cursor-pointer"
                  >
                    <option value="public">OPEN ACCESS (Sync Allowed)</option>
                    <option value="private">RESTRICTED (Approval Required)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mission Script</label>
                <textarea 
                  required
                  rows="3"
                  placeholder="Operational parameters and objectives..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-6 bg-[#0a0a0a] border border-[#262626] rounded-3xl focus:ring-2 focus:ring-[#ff5e00]/20 outline-none font-bold text-gray-400 text-sm placeholder-gray-800 transition-all resize-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sector Tags (Comma Separated)</label>
                <input 
                  placeholder="AI, PHY_SEC, NEURAL_SYNC..."
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full p-5 bg-[#0a0a0a] border border-[#262626] rounded-3xl focus:ring-2 focus:ring-[#ff5e00]/20 outline-none font-black text-white text-[10px] placeholder-gray-800 transition-all uppercase"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#ff5e00] hover:bg-[#e65100] py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-orange-900/40 transition-all flex items-center justify-center gap-4 active:scale-95"
              >
                {loading ? <Loader className="animate-spin" /> : <Zap className="w-5 h-5" />}
                DEPLOY DATA NODE
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Join Request Modal Overlay */}
      {showJoinModal && (
        <JoinRequestModal 
          group={showJoinModal} 
          onClose={() => setShowJoinModal(null)} 
          onSubmit={handleRequestSubmit}
        />
      )}
    </div>
  );
};

export default GroupIndex;
