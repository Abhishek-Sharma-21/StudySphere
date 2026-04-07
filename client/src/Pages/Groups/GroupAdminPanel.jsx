import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Check, Trash2, User, Link as LinkIcon, Info, ExternalLink, ShieldCheck, Users } from "lucide-react";
import { handleRequest, removeMember } from "../../features/groupSlice";
import { useSocket } from "../../context/SocketContext";
import toast from "react-hot-toast";


/**
 * GroupAdminPanel - The Moderation Command Center
 */
const GroupAdminPanel = ({ group, onClose }) => {
  const [activeTab, setActiveTab] = useState("requests"); // "requests", "members", "session"
  const dispatch = useDispatch();
  const { token, user: currentUser } = useSelector((state) => state.auth);
  const [waitingRoom, setWaitingRoom] = useState([]);
  const socket = useSocket();

  const currentUserId = currentUser?._id || currentUser?.user?._id;

  // WebSocket: Session Waiting Room Sync
  React.useEffect(() => {
    if (socket && activeTab === "session" && group.isLive) {
      const syncWaiting = async () => {
        try {
          const { getCallWaitingRoom } = await import("../../features/liveSync/liveKitService");
          const data = await getCallWaitingRoom(token, group._id);
          setWaitingRoom(data);
        } catch (err) {
          console.error("Session Sync Failed", err);
        }
      };

      syncWaiting();

      socket.on("session_request_updated", (data) => {
        if (data.groupId === group._id) {
          setWaitingRoom(data.waitingRoom);
        }
      });

      return () => {
        socket.off("session_request_updated");
      };
    }
  }, [socket, activeTab, group.isLive, group._id, token]);


  const onHandleRequest = (requestId, action) => {
    dispatch(handleRequest({ token, groupId: group._id, requestId, action }))
      .then((res) => {
        if (handleRequest.fulfilled.match(res)) {
          toast.success(`Request ${action === "approve" ? "approved" : "rejected"} successfully`);
        } else {
          toast.error(res.payload || "Operation failed");
        }
      });
  };

  const onHandleSessionAdmit = async (userId, action) => {
    try {
      const { admitParticipantNode } = await import("../../features/liveSync/liveKitService");
      await admitParticipantNode(token, { roomName: group._id, targetUserId: userId, action });
      toast.success(`Neural node ${action}.`);
      setWaitingRoom(prev => prev.filter(r => r.user?._id !== userId));
    } catch (err) {
      toast.error("Handshake failed.");
    }
  };

  const onRemoveMember = (userId, name) => {
    if (!window.confirm(`Are you sure you want to terminate synchronization for ${name}?`)) return;
    
    dispatch(removeMember({ token, groupId: group._id, userId }))
      .then((res) => {
        if (removeMember.fulfilled.match(res)) {
          toast.success(`${name} has been removed from the colony`);
        } else {
          toast.error(res.payload || "Removal failed");
        }
      });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[#0a0a0a]/90 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="bg-[#161616] w-full max-w-4xl max-h-[85vh] rounded-[4rem] border border-[#262626] shadow-2xl relative overflow-hidden flex flex-col">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#ff5e00]"></div>
        
        {/* Header */}
        <div className="p-10 border-b border-[#262626] flex flex-col lg:flex-row justify-between items-center bg-[#1a1a1a] gap-6">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
              <ShieldCheck className="text-[#ff5e00]" />
              Moderation <span className="text-[#ff5e00]">Command</span>
            </h2>
            <div className="flex flex-wrap items-center gap-4 mt-4">
               <TabButton 
                 active={activeTab === "requests"} 
                 label="Join Requests" 
                 count={group.pendingRequests?.length} 
                 onClick={() => setActiveTab("requests")} 
               />
               <TabButton 
                 active={activeTab === "members"} 
                 label="Active Members" 
                 count={group.members?.length} 
                 onClick={() => setActiveTab("members")} 
               />
               {group.isLive && (
                 <TabButton 
                   active={activeTab === "session"} 
                   label="Live Session" 
                   count={waitingRoom.length} 
                   onClick={() => setActiveTab("session")} 
                 />
               )}
            </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 bg-[#0a0a0a] text-gray-500 hover:text-white rounded-full flex items-center justify-center border border-[#262626] transition-all self-start lg:self-center">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 space-y-6 no-scrollbar">
          {activeTab === "requests" && (
            group.pendingRequests?.length > 0 ? (
              group.pendingRequests.map((request) => (
                <div key={request.user?._id} className="bg-[#0a0a0a] border border-[#262626] rounded-[2.5rem] p-8 flex flex-col lg:flex-row gap-8 hover:border-[#ff5e00]/30 transition-all group/item">
                  
                  {/* User Info */}
                  <div className="lg:w-1/3 flex flex-col items-center lg:items-start text-center lg:text-left border-b lg:border-b-0 lg:border-r border-[#262626] pb-8 lg:pb-0 lg:pr-8">
                    <div className="w-20 h-20 bg-[#161616] rounded-3xl flex items-center justify-center text-[#ff5e00] border border-[#262626] mb-4 shadow-inner group-hover/item:scale-105 transition-transform">
                      <User size={40} />
                    </div>
                    <h3 className="text-xl font-black text-white leading-tight mb-1">{request.user?.name}</h3>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">{request.user?.email}</p>
                    
                    <div className="w-full flex flex-wrap gap-2 justify-center lg:justify-start">
                      {request.links?.map((link, i) => (
                        <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#161616] text-[#ff5e00] rounded-xl border border-transparent hover:border-[#ff5e00]/40 transition-all"><ExternalLink size={14} /></a>
                      ))}
                    </div>
                  </div>

                  {/* Application Details */}
                  <div className="flex-1 space-y-6">
                    <div className="space-y-2">
                       <h4 className="text-[10px] font-black text-[#ff5e00] uppercase tracking-widest flex items-center gap-2"><Info size={12} /> Bio</h4>
                       <p className="text-gray-400 text-sm font-bold leading-relaxed italic border-l-2 border-[#262626] pl-4">"{request.bio || "No bio"}"</p>
                    </div>
                    <div className="space-y-2">
                       <h4 className="text-[10px] font-black text-[#ff5e00] uppercase tracking-widest flex items-center gap-2"><ShieldCheck size={12} /> Mission</h4>
                       <p className="text-gray-300 text-sm font-black leading-relaxed">{request.purpose || "No statement"}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-3 justify-center lg:justify-start">
                    <button onClick={() => onHandleRequest(request.user?._id, "approve")} className="w-14 h-14 bg-emerald-900/10 text-emerald-500 border border-emerald-900/30 rounded-2xl flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all"><Check size={24} /></button>
                    <button onClick={() => onHandleRequest(request.user?._id, "reject")} className="w-14 h-14 bg-rose-900/10 text-rose-500 border border-rose-900/30 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={24} /></button>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState icon={<ShieldCheck size={32} />} message="No pending requests detected" />
            )
          )}

          {activeTab === "session" && (
            waitingRoom.length > 0 ? (
              <div className="space-y-4">
                <div className="p-6 bg-orange-900/10 border border-orange-900/30 rounded-[2.5rem] mb-8">
                  <p className="text-[10px] font-black text-[#ff5e00] uppercase tracking-[0.2em] italic">The following nodes are awaiting neural synchronization. Admitting them will grant access to the live video grid.</p>
                </div>
                {waitingRoom.map((req) => (
                   <div key={req.user?._id} className="bg-[#0a0a0a] border border-[#262626] rounded-[2.5rem] p-6 lg:p-8 flex items-center justify-between hover:border-[#ff5e00]/30 transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-[#161616] rounded-2xl flex items-center justify-center text-white border border-[#262626] text-xl font-black">
                          {req.user?.name?.[0]}
                        </div>
                        <div>
                          <h4 className="text-white text-lg font-black uppercase tracking-tight italic">{req.user?.name}</h4>
                          <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-1">Status: Neural Handshake Pending</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button onClick={() => onHandleSessionAdmit(req.user?._id, "approved")} className="px-8 py-3 bg-emerald-600/10 text-emerald-500 border border-emerald-600/30 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all">Admit Node</button>
                        <button onClick={() => onHandleSessionAdmit(req.user?._id, "denied")} className="px-8 py-3 bg-rose-600/10 text-rose-500 border border-rose-600/30 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">Deny Access</button>
                      </div>
                   </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={<Users size={32} />} message="Waiting room is currently vacant" />
            )
          )}

          {activeTab === "members" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="p-6 bg-[#0a0a0a] border border-[#262626] rounded-[2rem] flex justify-between items-center shadow-inner">
                  <div>
                    <h4 className="text-[10px] font-black text-[#ff5e00] uppercase tracking-[0.2em] mb-1">Synchronization Statistics</h4>
                    <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest italic">Monitoring all active colonial nodes in the current sector</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-white leading-none">{group.members?.length}</span>
                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-tighter mt-1">Total Nodes</span>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {group.members?.map((member) => {
                   const isAdmin = group.admins?.some(a => String(a._id || a) === String(member._id));
                   return (
                     <div key={member._id} className="bg-[#0a0a0a] border border-[#262626] rounded-3xl p-6 flex items-center justify-between group/member hover:border-[#ff5e00]/30 transition-all">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-[#161616] rounded-2xl flex items-center justify-center text-gray-500 group-hover/member:text-[#ff5e00] transition-colors border border-[#262626]">
                              <User size={20} />
                           </div>
                           <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-white text-xs font-black uppercase tracking-tight">
                                  {member.name} {String(member._id) === String(currentUserId) && "(YOU)"}
                                </h4>
                                {isAdmin && (
                                  <span className="bg-[#ff5e00]/10 text-[#ff5e00] text-[7px] font-black px-1.5 py-0.5 rounded uppercase border border-[#ff5e00]/20 tracking-tighter">
                                    System Admin
                                  </span>
                                )}
                              </div>
                              <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{member.email}</p>
                           </div>
                        </div>
                        {/* Only show remove button if not the admin themselves and requester is admin */}
                        {String(member._id) !== String(currentUserId) && (
                          <button 
                            onClick={() => onRemoveMember(member._id, member.name)}
                            className="w-10 h-10 bg-rose-900/10 text-rose-500 border border-rose-900/20 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover/member:opacity-100"
                            title="Remove Member"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                     </div>
                   );
                 })}
               </div>
            </div>
          )}

        </div>
        
        {/* Footer */}
        <div className="px-10 py-6 bg-[#1a1a1a] border-t border-[#262626] flex justify-center">
            <button onClick={onClose} className="text-[10px] font-black text-gray-500 hover:text-[#ff5e00] uppercase tracking-[0.4em] transition-colors">Terminate Interface</button>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, label, count, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
      active ? "bg-[#ff5e00] text-white shadow-lg shadow-orange-900/30" : "bg-[#262626] text-gray-500 hover:text-white"
    }`}
  >
    {label}
    {count > 0 && <span className={`ml-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] ${active ? "bg-white text-[#ff5e00]" : "bg-[#ff5e00] text-white"}`}>{count}</span>}
  </button>
);

const EmptyState = ({ icon, message }) => (
  <div className="text-center py-20 bg-[#0a0a0a] rounded-[3rem] border border-dashed border-[#262626]">
    <div className="w-20 h-20 bg-[#161616] rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-700 border border-[#262626]">
      {icon}
    </div>
    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{message}</p>
  </div>
);

export default GroupAdminPanel;
