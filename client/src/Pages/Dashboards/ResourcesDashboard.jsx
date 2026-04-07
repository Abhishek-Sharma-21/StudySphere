import React, { useState } from "react";
import { useSelector } from "react-redux";
import { BookOpen, Download, Eye, Search, Filter, Info, Trash2, Calendar, User, Shield } from "lucide-react";

const ResourcesDashboard = () => {
  const { groups } = useSelector((state) => state.groups);
  const { user } = useSelector((state) => state.auth);
  const currentUserId = user?._id || user?.user?._id;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");

  // Aggregate all resources from groups where the user is a member
  const allResources = groups
    .filter(group => group.members?.some(m => String(m._id || m) === String(currentUserId)))
    .reduce((acc, group) => {
      const groupResources = (group.resources || []).map(res => ({
        ...res,
        groupName: group.name,
        groupId: group._id,
        isGroupAdmin: group.admins?.some(a => String(a._id || a) === String(currentUserId))
      }));
      return [...acc, ...groupResources];
    }, [])
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Filter logic
  const filteredResources = allResources.filter(res => {
    const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = selectedGroup === "all" || res.groupId === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const joinedGroups = groups.filter(group => 
    group.members?.some(m => String(m._id || m) === String(currentUserId))
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header Segment */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#262626] pb-10">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-[#ff5e00]/10 rounded-2xl flex items-center justify-center text-[#ff5e00] border border-[#ff5e00]/20 shadow-[0_0_20px_rgba(255,94,0,0.1)]">
                <BookOpen size={24} />
              </div>
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Global <span className="text-[#ff5e00]">Repository</span></h1>
           </div>
           <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] ml-1">Universal Access Node // Secure Knowledge Base</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
           <div className="relative group/search w-full md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within/search:text-[#ff5e00] transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search Knowledge Nodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#161616] border border-[#262626] text-white py-4 pl-12 pr-6 rounded-2xl outline-none focus:border-[#ff5e00]/50 transition-all text-xs font-black uppercase tracking-widest shadow-xl"
              />
           </div>

           <div className="relative group/filter w-full md:w-56">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={16} />
              <select 
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full bg-[#161616] border border-[#262626] text-white py-4 pl-12 pr-10 rounded-2xl outline-none focus:border-[#ff5e00]/50 transition-all text-[10px] font-black uppercase tracking-widest shadow-xl appearance-none cursor-pointer"
              >
                <option value="all">Every Colony</option>
                {joinedGroups.map(g => (
                  <option key={g._id} value={g._id}>{g.name}</option>
                ))}
              </select>
           </div>
        </div>
      </div>

      {/* Resource Grid */}
      <div className="space-y-4">
        {filteredResources.length > 0 ? (
          filteredResources.map((res) => (
            <div key={res._id} className="bg-[#161616] border border-[#262626] p-6 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-6 group/row hover:border-[#ff5e00]/20 transition-all hover:bg-[#1a1a1a] shadow-xl">
              <div className="flex items-center gap-6">
                 <div className="w-14 h-14 bg-[#0a0a0a] rounded-2xl flex items-center justify-center text-gray-700 group-hover/row:text-[#ff5e00] transition-colors border border-[#262626] shadow-inner">
                   <BookOpen size={24} />
                 </div>
                 <div>
                    <h3 className="text-white text-sm font-black uppercase tracking-tight mb-1 group-hover/row:text-[#ff5e00] transition-colors">{res.name}</h3>
                    <div className="flex flex-wrap gap-4 text-[9px] font-black uppercase tracking-widest text-gray-600">
                       <span className="flex items-center gap-1.5"><Calendar size={10} /> {new Date(res.createdAt).toLocaleDateString()}</span>
                       <span className="flex items-center gap-1.5 text-[#ff5e00]/60"><Shield size={10} /> Sector: {res.groupName}</span>
                       <span className="flex items-center gap-1.5"><User size={10} /> Transmission by {res.uploader?.name || "Member Node"}</span>
                    </div>
                 </div>
              </div>

              <div className="flex items-center gap-4 border-t md:border-t-0 border-[#262626] pt-4 md:pt-0">
                 <div className="text-right hidden xl:block mr-4">
                    <p className="text-[9px] font-black text-gray-700 uppercase tracking-tighter">Status</p>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Synchronized</p>
                 </div>
                 
                 <div className="flex items-center gap-2">
                   <div className="px-4 py-2 bg-[#0a0a0a] border border-[#262626] rounded-xl text-[10px] font-black text-gray-500 uppercase">
                     {(res.size / 1024 / 1024).toFixed(2)} MB
                   </div>

                   {/* Preview Button */}
                   <button 
                     onClick={() => window.open(res.url, "_blank")} 
                     className="w-12 h-12 bg-[#0a0a0a] border border-[#262626] rounded-2xl flex items-center justify-center text-[#ff5e00] hover:bg-[#ff5e00] hover:text-white hover:border-[#ff5e00] transition-all shadow-lg"
                     title="Preview"
                   >
                     <Eye size={18} />
                   </button>

                   {/* Access Button */}
                   <button 
                     onClick={() => window.open(res.url, "_blank")} 
                     className="w-12 h-12 bg-[#0a0a0a] border border-[#262626] rounded-2xl flex items-center justify-center text-gray-500 hover:text-[#ff5e00] hover:border-[#ff5e00] transition-all shadow-lg"
                     title="Open in New Tab"
                   >
                     <Download size={18} />
                   </button>
                 </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-32 text-center bg-[#161616]/30 border-4 border-dashed border-[#262626] rounded-[4rem] group hover:border-[#ff5e00]/20 transition-all">
             <Info className="w-16 h-16 text-gray-800 mx-auto mb-6 group-hover:scale-110 transition-transform" />
             <h2 className="text-2xl font-black text-gray-700 uppercase tracking-tighter mb-2">No Node Detected</h2>
             <p className="text-[10px] font-black text-gray-800 uppercase tracking-[0.4em]">Search query or filters returned zero operational units</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-[#262626] opacity-30">
         <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.5em]">Sector Storage Capacity : 500 TB // Operational</p>
         <div className="flex gap-4">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
         </div>
      </div>
    </div>
  );
};

export default ResourcesDashboard;
