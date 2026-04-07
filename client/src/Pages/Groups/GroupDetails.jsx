import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  Users, MessageSquare, BookOpen, Video, 
  Settings, Shield, ChevronRight, Activity, 
  Mic, Camera, Monitor, LogOut, Radio,Trash2,
  Lock, Download, Eye, Info, Zap, ChevronDown, UserCheck
} from "lucide-react";
import { getGroupById, toggleLiveStatus, leaveGroup, deleteGroup, syncGroup, removeMember, uploadResource, deleteResource } from "../../features/groupSlice";
import { requestCallEntry } from "../../features/liveSync/liveKitService";
import GroupAdminPanel from "./GroupAdminPanel";
import { useSocket } from "../../context/SocketContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import QuantumMeeting from "../../components/LiveSync/QuantumMeeting";



const GroupDetails = () => {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isInCall, activeRoomId } = useSelector((state) => state.liveSync); 
  const { groups, loading } = useSelector((state) => state.groups);
  const { user, token } = useSelector((state) => state.auth);
  const currentUserId = user?._id || user?.user?._id;

  const [group, setGroup] = useState(null);
  const [activeChannel, setActiveChannel] = useState("discussions");
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestStatus, setRequestStatus] = useState("none"); // none, pending, approved

  // Admin Mode state
  const [admissionMode, setAdmissionMode] = useState("open");
  const [showModeSelector, setShowModeSelector] = useState(false);
  
  const [isJoinedInCall, setIsJoinedInCall] = useState(activeRoomId === groupId);
  const [presenceCount, setPresenceCount] = useState(0);
  const socket = useSocket();


  useEffect(() => {
    if (activeRoomId === groupId) {
      setIsJoinedInCall(true);
    }
  }, [activeRoomId, groupId]);

  useEffect(() => {
    const found = groups.find(g => g._id === groupId);
    if (found) {
      setGroup(found);
      if (found.callAdmissionMode) {
        setAdmissionMode(found.callAdmissionMode);
      }
      
      // Auto-check request status if waiting
      if (found.callAdmissionMode === "request" && !isJoinedInCall) {
        const myRequest = found.callWaitingRoom?.find(r => String(r.user._id || r.user) === String(currentUserId));
        if (myRequest) {
          setRequestStatus(myRequest.status);
          if (myRequest.status === "approved") {
            setIsJoinedInCall(true);
          }
        }
      }
    } else {
      if (groupId) {
        dispatch(getGroupById(groupId)).then(res => {
          if (getGroupById.fulfilled.match(res)) {
            setGroup(res.payload);
            if (res.payload.callAdmissionMode) {
              setAdmissionMode(res.payload.callAdmissionMode);
            }
          }
        });
      }
    }
  }, [groupId, groups, currentUserId, isJoinedInCall]);


  // WebSocket: Real-time Synchronization
  useEffect(() => {
    if (socket && groupId) {
      socket.emit("join_group", groupId);

      socket.on("request_updated", (updatedGroup) => {
        if (updatedGroup._id === groupId) {
          dispatch(syncGroup(updatedGroup));
        }
      });

      socket.on("group_synced", (updatedGroup) => {
        if (updatedGroup._id === groupId) {
          dispatch(syncGroup(updatedGroup));
          // Update local request status if needed
          const myRequest = updatedGroup.callWaitingRoom?.find(r => String(r.user._id || r.user) === String(currentUserId));
          if (myRequest) {
            setRequestStatus(myRequest.status);
            if (myRequest.status === "approved") {
              setIsJoinedInCall(true);
            }
          }
        }
      });

      socket.on("presence_update", ({ count }) => {
        setPresenceCount(count);
      });

      return () => {
        socket.emit("leave_group", groupId);
        socket.off("request_updated");
        socket.off("group_synced");
        socket.off("presence_update");
      };
    }
  }, [socket, groupId, currentUserId, dispatch]);



  const handleChannelChange = (channel) => {
    setActiveChannel(channel);
    if (channel === "live-room") {
      syncColonyStatus();
    }
  };

  const syncColonyStatus = () => {
    setIsSyncing(true);
    dispatch(getGroupById(groupId)).then(res => {
      if (getGroupById.fulfilled.match(res)) {
        setGroup(res.payload);
      }
      setTimeout(() => setIsSyncing(false), 800);
    });
  };

  const handleRequestEntry = async () => {
    setIsRequesting(true);
    try {
      const res = await requestCallEntry(token, { roomName: groupId });
      setRequestStatus(res.status);
      if (res.status === "approved") {
        setIsJoinedInCall(true);
      }
      toast.success(res.message);
    } catch (err) {
      toast.error(err.message || "Admission request failed.");
    } finally {
      setIsRequesting(false);
    }
  };

  if (loading && !group) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="w-12 h-12 border-4 border-[#ff5e00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!group) return <div className="text-white text-center mt-20 text-[10px] uppercase font-black tracking-widest text-gray-700 font-quicksand">Missing Node Link</div>;

  const isAdmin = group.admins?.some(admin => String(admin._id || admin) === String(currentUserId));
  const isMember = group.members?.some(m => String(m._id || m) === String(currentUserId));

  if (!isMember && group.privacy === "private") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-[#0a0a0a] text-center p-10 font-quicksand">
        <div className="w-24 h-24 bg-[#161616] rounded-[2rem] border border-[#262626] flex items-center justify-center text-gray-700 mb-8">
           <Lock size={40} />
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Restricted Access</h2>
        <p className="text-gray-500 max-w-sm mb-10 text-[10px] font-black uppercase tracking-widest">
           This colony is locked. You must be synchronized with this node to access its collaborative data streams.
        </p>
        <Link to="/group-index-page" className="bg-[#ff5e00] text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">
           Return to Sector Map
        </Link>
      </div>
    );
  }

  const handleToggleLive = () => {
    dispatch(toggleLiveStatus({ token, groupId: group._id, admissionMode }))
      .then(res => {
        if (toggleLiveStatus.fulfilled.match(res)) {
          toast.success(res.payload.isLive ? `Broadcast Initialized 🔴 (${admissionMode})` : "Broadcast Terminated ⬛");
          setShowModeSelector(false);
        }
      });
  };

  const handleLeaveGroup = () => {
    if (window.confirm("Are you sure?")) {
      dispatch(leaveGroup({ token, groupId: group._id }))
        .then(res => {
          if (leaveGroup.fulfilled.match(res)) {
            navigate("/dashboard-index");
          }
        });
    }
  };

  const handleDeleteGroup = () => {
    if (window.confirm("CRITICAL WARNING: Initiate destruction sequence?")) {
      dispatch(deleteGroup({ token, groupId: group._id }))
        .then(res => {
          if (deleteGroup.fulfilled.match(res)) {
            navigate("/dashboard-index");
          }
        });
    }
  };

  const onHandleRemoveMember = (userId, name) => {
    if (!window.confirm(`Terminate synchronization for ${name}?`)) return;
    dispatch(removeMember({ token, groupId: group._id, userId }))
      .then((res) => {
        if (removeMember.fulfilled.match(res)) {
          toast.success(`${name} removed.`);
        } else {
          toast.error(res.payload || "Removal failed");
        }
      });
  };

  const onHandleUploadResource = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File exceeds 10MB limit.");
      return;
    }

    setIsSyncing(true);
    dispatch(uploadResource({ token, groupId: group._id, file }))
      .then(res => {
        if (uploadResource.fulfilled.match(res)) {
          toast.success("Data transmitted to repository.");
        } else {
          toast.error(res.payload || "Transmission failed");
        }
        setIsSyncing(false);
      });
  };

  const onHandleDeleteResource = (resourceId) => {
    if (!window.confirm("Purge this resource from the repository?")) return;
    dispatch(deleteResource({ token, groupId: group._id, resourceId }))
      .then(res => {
        if (deleteResource.fulfilled.match(res)) {
          toast.success("Resource purged.");
        } else {
          toast.error(res.payload || "Purge failed");
        }
      });
  };


  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[calc(100vh-80px)] bg-[#0a0a0a] font-quicksand transition-all duration-500">
      
      {/* ── Channel Sidebar ───────────────────────────────────── */}
      <aside className={`bg-[#0a0a0a] border-r border-[#262626] flex flex-col gap-8 transition-all duration-500 ${
        isInCall ? "w-full lg:w-20 p-4 items-center" : "w-full lg:w-72 p-6"
      }`}>
        <div className={isInCall ? "flex justify-center" : ""}>
           <div className="flex items-center gap-3 mb-2" title={group.name}>
             <div className="w-10 h-10 bg-[#161616] border border-[#262626] rounded-xl flex items-center justify-center text-[#ff5e00] flex-shrink-0">
               <Shield size={20} />
             </div>
             {!isInCall && (
               <div className="min-w-0 flex-1">
                 <h3 className="font-black text-white uppercase tracking-tighter text-sm truncate">{group.name}</h3>
                 <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{group.privacy} node</p>
               </div>
             )}
           </div>
        </div>

        <nav className="flex flex-col gap-2 w-full">
           {!isInCall && <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-4 ml-2 text-center lg:text-left">Channels</div>}
           <ChannelLink 
             icon={<MessageSquare size={16} />} 
             label="discussions" 
             active={activeChannel === "discussions"} 
             onClick={() => handleChannelChange("discussions")} 
             collapsed={isInCall}
           />
           <ChannelLink 
             icon={<BookOpen size={16} />} 
             label="resources" 
             active={activeChannel === "resources"} 
             onClick={() => handleChannelChange("resources")} 
             collapsed={isInCall}
           />
           <ChannelLink 
             icon={<Video size={16} />} 
             label="live-room" 
             active={activeChannel === "live-room"} 
             onClick={() => handleChannelChange("live-room")} 
             isLive={group.isLive}
             collapsed={isInCall}
           />
           <ChannelLink 
             icon={<Users size={16} />} 
             label="members" 
             active={activeChannel === "members"} 
             onClick={() => handleChannelChange("members")} 
             collapsed={isInCall}
           />
        </nav>

        <div className={`mt-auto space-y-3 pt-6 border-t border-[#262626] w-full ${isInCall ? "flex flex-col items-center" : ""}`}>
          {isAdmin && (
             <div className="relative w-full">
               {/* Mode Selection Dropdown (Only when not live) */}
               {!group.isLive && showModeSelector && !isInCall && (
                 <div className="absolute bottom-full left-0 w-full mb-2 p-2 bg-[#161616] border border-[#262626] rounded-2xl shadow-2xl z-50 animate-in slide-in-from-bottom-2 duration-300">
                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-2 px-2 text-center">Admission_Protocol</p>
                    <button 
                      onClick={() => setAdmissionMode("open")}
                      className={`w-full p-3 rounded-xl flex items-center justify-between text-[9px] font-black uppercase tracking-widest mb-1 ${
                        admissionMode === "open" ? "bg-[#ff5e00] text-white" : "text-gray-400 hover:bg-[#262626]"
                      }`}
                    >
                      Open Collective <Globe size={12} />
                    </button>
                    <button 
                      onClick={() => setAdmissionMode("request")}
                      className={`w-full p-3 rounded-xl flex items-center justify-between text-[9px] font-black uppercase tracking-widest ${
                        admissionMode === "request" ? "bg-[#ff5e00] text-white" : "text-gray-400 hover:bg-[#262626]"
                      }`}
                    >
                      Gated Access <Lock size={12} />
                    </button>
                 </div>
               )}

               <div className="flex gap-1 w-full">
                 <button 
                   onClick={handleToggleLive}
                   title={group.isLive ? "Stop Session" : "Start Session"}
                   className={`flex items-center transition-all ${
                     isInCall ? "w-12 h-12 justify-center rounded-xl" : "flex-1 gap-3 p-4 rounded-l-2xl"
                   } border text-[9px] lg:text-xs font-black uppercase tracking-widest ${
                     group.isLive 
                       ? "bg-rose-900/10 text-rose-500 border-rose-900/30 hover:bg-rose-500 hover:text-white" 
                       : "bg-emerald-900/10 text-emerald-500 border-emerald-900/30 hover:bg-emerald-500 hover:text-white"
                   }`}
                 >
                   <Radio size={16} className={group.isLive ? "animate-pulse" : ""} />
                   {!isInCall && (group.isLive ? "Stop" : "Start Sync")}
                 </button>
                 
                 {!group.isLive && !isInCall && (
                    <button 
                      onClick={() => setShowModeSelector(!showModeSelector)}
                      className="p-4 bg-[#161616] border border-[#262626] rounded-r-2xl text-[#ff5e00] hover:bg-[#262626] transition-all"
                    >
                      <ChevronDown size={16} className={showModeSelector ? "rotate-180 transition-transform" : "transition-transform"} />
                    </button>
                 )}
               </div>
             </div>
          )}

          {isAdmin && !isInCall && (
             <button 
               onClick={() => setShowAdminPanel(true)}
               title="Moderation"
               className="flex items-center gap-3 p-4 bg-[#161616] hover:bg-[#262626] border border-[#262626] rounded-2xl text-[#ff5e00] font-black uppercase tracking-widest group w-full text-xs"
             >
               <Settings size={16} className="group-hover:rotate-45 transition-transform" />
               Moderation
               {group.pendingRequests?.length > 0 && (
                 <span className="ml-auto w-5 h-5 bg-[#ff5e00] text-white text-[10px] rounded-full flex items-center justify-center animate-pulse">
                   {group.pendingRequests.length}
                 </span>
               )}
             </button>
          )}

          {!isInCall && (
            isAdmin ? (
              <button 
                onClick={handleDeleteGroup}
                className="flex items-center gap-3 p-4 w-full bg-rose-900/10 hover:bg-rose-600 border border-rose-900/30 text-rose-500 hover:text-white rounded-2xl font-black uppercase tracking-widest text-xs group"
              >
                <Trash2 size={16} />
                Destruct
              </button>
            ) : (
              <button 
                onClick={handleLeaveGroup}
                className="flex items-center gap-3 p-4 w-full border border-[#262626] text-gray-600 hover:text-rose-500 rounded-2xl font-black uppercase tracking-widest text-xs"
              >
                <LogOut size={16} />
                Disconnect
              </button>
            )
          )}
        </div>
      </aside>

      {/* ── Workspace Area ───────────────────────────────────── */}
      <main className="flex-1 flex flex-col bg-[#0a0a0a] relative overflow-hidden">
        {/* Header Indicator */}
        <header className="p-8 border-b border-[#262626] flex justify-between items-center bg-[#161616]/30 backdrop-blur-md sticky top-0 z-10">
           <div className="flex items-center gap-4">
             <div className="text-[10px] font-black text-[#ff5e00] bg-[#ff5e00]/10 px-3 py-1 rounded-lg uppercase tracking-widest">
               #{activeChannel}
             </div>
             {group.isLive && (
               <div className="flex items-center gap-2 text-rose-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                 <Radio size={14} />
                 Live {group.callAdmissionMode === "request" ? ":: Gated" : ":: Open"}
               </div>
             )}
             {presenceCount > 0 && (
               <div className="flex items-center gap-2 text-[#ff5e00] text-[9px] font-black border border-[#ff5e00]/20 px-3 py-1 rounded-lg uppercase tracking-tighter shadow-[0_0_10px_rgba(255,94,0,0.1)]">
                 <Activity size={10} />
                 {presenceCount} Nodes Online
               </div>
             )}
           </div>

        </header>

        {/* Dynamic Channel View */}
        <div className="flex-1 p-6 lg:p-10 overflow-y-auto no-scrollbar">
           {activeChannel === "discussions" && (
             <div className="space-y-8 animate-in fade-in duration-500 translate-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Academic <span className="text-[#ff5e00]">Discourse</span></h2>
                  <button className="bg-[#ff5e00] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-900/20">Init Thread</button>
                </div>
                {[1, 2].map(i => (
                  <div key={i} className="p-8 bg-[#161616] border border-[#262626] rounded-3xl hover:border-[#ff5e00]/50 transition-all group">
                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 bg-[#0a0a0a] rounded-xl flex items-center justify-center text-gray-600">
                          <Activity size={20} />
                       </div>
                       <div className="flex-1">
                          <h4 className="text-white font-black uppercase tracking-tight text-sm mb-2 group-hover:text-[#ff5e00] transition-colors">{i === 1 ? "QUANTUM_STABILITY_V4 :: RESULTS" : "NEURAL_LINK_CONSTRUCTION_DRAFT"}</h4>
                          <p className="text-gray-500 text-xs font-bold mb-4 italic">"Analysis of data synchronization speed across decentralized colonial nodes..."</p>
                          <div className="flex gap-4 text-[9px] font-black text-gray-700 uppercase tracking-widest">
                             <span>3 REPLIES</span>
                             <span>12h AGO</span>
                          </div>
                       </div>
                    </div>
                  </div>
                ))}
             </div>
           )}

           {activeChannel === "resources" && (
             <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-500">
                <div className="flex justify-between items-end border-b border-[#262626] pb-6">
                   <div>
                     <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Data <span className="text-[#ff5e00]">Repository</span></h2>
                     <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-1">Colony Knowledge Base</p>
                   </div>
                   <div className="flex items-center gap-4">
                     <input 
                       type="file" 
                       id="node-upload" 
                       className="hidden" 
                       onChange={onHandleUploadResource}
                     />
                     <button 
                       onClick={() => document.getElementById("node-upload").click()}
                       disabled={isSyncing}
                       className="bg-[#161616] border border-[#262626] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-[#ff5e00] transition-all flex items-center gap-2"
                     >
                       {isSyncing ? <Activity size={14} className="animate-spin text-[#ff5e00]" /> : <Zap size={14} className="text-[#ff5e00]" />}
                       {isSyncing ? "Transmitting..." : "Init Upload"}
                     </button>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   {group.resources?.length > 0 ? (
                     group.resources.map((res) => (
                       <div key={res._id} className="p-6 bg-[#161616] border border-[#262626] rounded-2xl flex items-center justify-between group/res hover:border-[#ff5e00]/30 transition-all">
                         <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-[#0a0a0a] rounded-xl flex items-center justify-center text-gray-700 group-hover/res:text-[#ff5e00] transition-colors shadow-inner">
                               <BookOpen size={20} />
                            </div>
                            <div className="min-w-0">
                               <h4 className="text-white text-xs font-black uppercase tracking-widest truncate max-w-[200px] mb-1">{res.name}</h4>
                               <div className="flex items-center gap-3">
                                  <span className="text-[9px] font-black text-gray-600 uppercase">{(res.size / 1024 / 1024).toFixed(2)} MB</span>
                                  <span className="text-[8px] font-black text-[#ff5e00]/70 uppercase tracking-tighter">by {res.uploader?.name || "Member"}</span>
                               </div>
                            </div>
                         </div>
                         <div className="flex items-center gap-2">
                           {/* Preview Button */}
                           <button 
                             onClick={() => window.open(res.url, "_blank")} 
                             className="w-10 h-10 bg-[#0a0a0a] border border-[#262626] rounded-xl flex items-center justify-center text-gray-500 hover:text-[#ff5e00] hover:border-[#ff5e00] transition-all"
                             title="Preview"
                           >
                             <Eye size={16} />
                           </button>

                           {/* Download/Access Button */}
                           <button 
                             onClick={() => window.open(res.url, "_blank")} 
                             className="w-10 h-10 bg-[#0a0a0a] border border-[#262626] rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:border-[#ff5e00] transition-all"
                             title="Open in New Tab"
                           >
                             <Download size={16} />
                           </button>
                           {(isAdmin || String(res.uploader?._id || res.uploader) === String(currentUserId)) && (
                             <button 
                               onClick={() => onHandleDeleteResource(res._id)}
                               className="w-10 h-10 bg-rose-900/10 text-rose-500 border border-rose-900/20 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white opacity-0 group-hover/res:opacity-100 transition-all"
                             >
                               <Trash2 size={16} />
                             </button>
                           )}
                         </div>
                       </div>
                     ))
                   ) : (
                     <div className="lg:col-span-2 py-20 text-center border-2 border-dashed border-[#262626] rounded-[3rem]">
                        <Info className="w-12 h-12 text-gray-800 mx-auto mb-4" />
                        <h3 className="text-gray-600 text-sm font-black uppercase tracking-widest">Repository Empty</h3>
                        <p className="text-[9px] font-black text-gray-800 uppercase tracking-tighter mt-1">Switch to online nodes to transmit data</p>
                     </div>
                   )}
                </div>
             </div>
           )}

           {activeChannel === "live-room" && (
             <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500 w-full min-h-[500px]">
                {isJoinedInCall ? (
                  <QuantumMeeting 
                    groupId={group._id}
                    userName={user?.name || "Anonymous-Node"}
                    authToken={token}
                    isAdmin={isAdmin}
                    onDisconnect={() => setIsJoinedInCall(false)}
                  />
                ) : (
                  <div className="bg-[#161616] p-12 lg:p-20 rounded-[4rem] border border-[#262626] shadow-2xl max-w-2xl relative overflow-hidden w-full">
                     <Radio className={`w-16 h-16 mx-auto mb-8 ${group.isLive ? "text-rose-500 animate-pulse" : "text-[#ff5e00]"}`} />
                     <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Neural <span className="text-[#ff5e00]">Broadcast</span></h2>
                     
                     <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-12 max-w-sm mx-auto leading-relaxed">
                        {group.isLive 
                          ? (group.callAdmissionMode === "request" && !isAdmin)
                            ? requestStatus === "pending" 
                              ? "Neural link request transmitted. Awaiting administrative authorization..."
                              : "This broadcast is gated. Please transmit a synchronization request to join."
                            : "Active synchronization detected. Establish connection to join the collective feed."
                          : isAdmin 
                            ? "Initialize real-time audio and video synchronization with colony members."
                            : "Waiting for host to initialize the neural link. Stand by..."
                        }
                     </p>

                     {group.isLive ? (
                       (group.callAdmissionMode === "request" && !isAdmin) ? (
                         requestStatus === "pending" ? (
                           <div className="flex flex-col items-center gap-6">
                              <div className="px-10 py-5 bg-[#0a0a0a] border border-[#ff5e00]/20 rounded-[2rem] text-[#ff5e00] text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                                 <Activity size={14} className="animate-spin" />
                                 Approval Pending
                              </div>
                              <button onClick={() => dispatch(getGroupById(groupId))} className="text-[9px] font-black text-gray-600 uppercase hover:text-white transition-colors">Force Handshake</button>
                           </div>
                         ) : (
                           <button 
                             onClick={handleRequestEntry}
                             disabled={isRequesting}
                             className="bg-white text-black px-16 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
                           >
                             {isRequesting ? "Transmitting..." : "Request Entry"}
                           </button>
                         )
                       ) : (
                         <button 
                           onClick={() => setIsJoinedInCall(true)}
                           className="bg-[#ff5e00] text-white px-16 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-900/40 hover:scale-105 active:scale-95 transition-all"
                         >
                           Establish Connection
                         </button>
                       )
                     ) : (
                       isAdmin ? (
                         <button 
                           onClick={handleToggleLive}
                           className="bg-[#ff5e00] text-white px-16 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-900/40 hover:scale-105 active:scale-95 transition-all"
                         >
                           Initialize protocol
                         </button>
                       ) : (
                         <div className="flex flex-col items-center gap-6">
                            <div className="px-10 py-4 bg-[#0a0a0a] border border-[#262626] rounded-2xl text-gray-700 text-[10px] font-black uppercase tracking-[0.2em]">
                               Link_Offline
                            </div>
                            <button 
                              onClick={syncColonyStatus}
                              disabled={isSyncing}
                              className="flex items-center gap-2 text-[#ff5e00] text-[9px] font-black uppercase tracking-[0.2em] group"
                            >
                               <Activity size={12} className={isSyncing ? "animate-spin" : "group-hover:animate-pulse"} />
                               {isSyncing ? "Scanning Nodes..." : "Request Neural Sync"}
                            </button>
                         </div>
                       )
                     )}
                  </div>
                )}
             </div>
           )}

           {activeChannel === "members" && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-600">
                <div className="flex justify-between items-end pb-4 border-b border-[#262626]">
                   <div>
                     <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Collective <span className="text-[#ff5e00]">Nodes</span></h2>
                     <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-1">Authorized Synchronization Cluster</p>
                   </div>
                   <div className="text-right">
                     <span className="text-3xl font-black text-[#ff5e00] leading-none">{group.members?.length}</span>
                     <p className="text-[8px] font-black text-gray-700 uppercase tracking-tighter">Verified Units</p>
                   </div>
                </div>

                <div className="flex flex-col gap-4">
                   {group.members?.map((member) => {
                     const isMemberAdmin = group.admins?.some(a => String(a._id || a) === String(member._id));
                     return (
                       <div key={member._id} className="bg-[#161616] border border-[#262626] rounded-3xl p-5 flex items-center justify-between group/unit hover:border-[#ff5e00]/20 transition-all hover:bg-[#1a1a1a] shadow-lg">
                         <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-[#0a0a0a] rounded-2xl flex items-center justify-center text-[#ff5e00] border border-[#262626] text-lg font-black shadow-inner">
                               {member.name?.[0]}
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-8">
                               <div className="flex items-center gap-2 min-w-[200px]">
                                 <h4 className="text-white text-sm font-black uppercase tracking-tight">{member.name}</h4>
                                 {isMemberAdmin && (
                                   <div className="flex items-center gap-1 bg-[#ff5e00]/10 px-2 py-0.5 rounded border border-[#ff5e00]/30">
                                      <Shield className="w-3 h-3 text-[#ff5e00]" />
                                      <span className="text-[7px] font-black text-[#ff5e00] uppercase tracking-tighter">Admin</span>
                                   </div>
                                 )}
                               </div>
                               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest min-w-[250px]">{member.email}</p>
                               <div className="hidden lg:flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                  <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Synchronized Node</span>
                               </div>
                            </div>
                         </div>
                         
                         {isAdmin && String(member._id) !== String(currentUserId) && (
                           <button 
                             onClick={() => onHandleRemoveMember(member._id, member.name)}
                             title="Terminate Connection"
                             className="w-10 h-10 bg-rose-900/10 text-rose-500 border border-rose-900/20 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover/unit:opacity-100 shadow-xl"
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
      </main>

      {/* ── Helpers ───────────────────────────────────── */}
      {showAdminPanel && <GroupAdminPanel group={group} onClose={() => setShowAdminPanel(false)} />}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

const ChannelLink = ({ icon, label, active, onClick, isLive, collapsed }) => (
  <button 
    onClick={onClick}
    className={`flex items-center transition-all relative ${
      collapsed ? "justify-center w-12 h-12 rounded-xl" : "gap-4 p-4 rounded-2xl w-full"
    } ${active ? "bg-[#161616] text-white border border-[#262626]" : "text-gray-500 hover:text-gray-300"}`}
  >
    <span className={active ? "text-[#ff5e00]" : "text-gray-700"}>{icon}</span>
    {!collapsed && <span className="text-xs font-black uppercase tracking-widest">{label}</span>}
    {isLive && !active && <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>}
  </button>
);

export default GroupDetails;
