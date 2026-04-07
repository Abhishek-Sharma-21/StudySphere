import React, { useState, useEffect } from "react";
import { useParticipants, useParticipantInfo } from "@livekit/components-react";
import { X, Users, Mic, MicOff, Video, VideoOff, Trash2, ShieldCheck, Activity, UserPlus, UserMinus, Clock } from "lucide-react";
import { kickParticipantFromCall, getCallWaitingRoom, admitParticipantNode } from "../../features/liveSync/liveKitService";
import toast from "react-hot-toast";

/**
 * QuantumParticipants - Colony Manifest UI
 */
const QuantumParticipants = ({ roomName, authToken, isAdmin, onClose }) => {
  const participants = useParticipants();
  const [waitingRoom, setWaitingRoom] = useState([]);

  // Sync Waiting Room for Admins
  useEffect(() => {
    if (!isAdmin) return;

    const syncWaitingRoom = async () => {
      try {
        const data = await getCallWaitingRoom(authToken, roomName);
        setWaitingRoom(data);
      } catch (err) {
        console.error("Waiting Room Sync Error:", err);
      }
    };

    const interval = setInterval(syncWaitingRoom, 5000); // 5s neural pulse
    syncWaitingRoom();

    return () => clearInterval(interval);
  }, [isAdmin, authToken, roomName]);

  const handleKick = async (identity) => {
    if (window.confirm(`CRITICAL: Eject ${identity} from the neural session?`)) {
      try {
        await kickParticipantFromCall(authToken, { roomName, participantIdentity: identity });
        toast.success(`${identity} ejected.`);
      } catch (err) {
        toast.error("Ejection protocol failed.");
      }
    }
  };

  const handleAdmit = async (userId, action) => {
    try {
      await admitParticipantNode(authToken, { roomName, targetUserId: userId, action });
      toast.success(`Node ${action}.`);
      setWaitingRoom(prev => prev.filter(req => req.user._id !== userId));
    } catch (err) {
      toast.error("Admission handshake failed.");
    }
  };

  return (
    <div className="flex flex-col h-full w-[350px] bg-[#0d0d0d] border-l border-[#262626] shadow-2xl relative animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="p-6 border-b border-[#262626] flex items-center justify-between bg-[#161616]/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#ff5e00]/10 rounded-lg flex items-center justify-center text-[#ff5e00]">
            <Users size={16} />
          </div>
          <h3 className="text-xs font-black text-white uppercase tracking-widest italic">Colony_Manifest</h3>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-[#262626] rounded-xl text-gray-500 hover:text-white transition-all"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Waiting Room Section (Admin Only) */}
        {isAdmin && waitingRoom.length > 0 && (
          <div className="p-4 space-y-3 bg-orange-900/5 border-b border-orange-900/20">
             <div className="flex items-center justify-between mb-4 px-2">
               <span className="text-[10px] font-black text-[#ff5e00] uppercase tracking-widest flex items-center gap-2">
                 <Clock size={12} />
                 Admission_Queue
               </span>
               <span className="text-[10px] font-black py-0.5 px-2 bg-[#ff5e00] text-white rounded-full animate-pulse">
                 {waitingRoom.length}
               </span>
             </div>
             
             {waitingRoom.map((req) => (
               <div key={req.user._id} className="p-4 bg-[#161616] border border-[#262626] rounded-2xl flex items-center justify-between gap-3 shadow-lg group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-[#262626] flex items-center justify-center text-[10px] font-black text-white">
                      {req.user.name?.[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-white uppercase truncate">{req.user.name}</p>
                      <p className="text-[8px] font-bold text-gray-600 uppercase">Awaiting Handshake</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleAdmit(req.user._id, "approved")}
                      className="p-2 bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white rounded-xl transition-all"
                      title="Admit Node"
                    >
                      <UserPlus size={14} />
                    </button>
                    <button 
                      onClick={() => handleAdmit(req.user._id, "denied")}
                      className="p-2 bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white rounded-xl transition-all"
                      title="Deny Node"
                    >
                      <UserMinus size={14} />
                    </button>
                  </div>
               </div>
             ))}
          </div>
        )}

        {/* Stats Summary */}
        <div className="px-6 py-4 bg-[#161616]/30 border-b border-[#262626] flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
           <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">ACTIVE_NODES</span>
           <span className="flex items-center gap-2 text-[#ff5e00] text-[10px] font-black italic animate-pulse">
             <Activity size={12} />
             {participants.length} SYNCED
           </span>
        </div>

        {/* Participant List */}
        <div className="p-4 space-y-2">
          {participants.map((p) => (
            <ParticipantItem 
              key={p.sid} 
              participant={p} 
              isAdmin={isAdmin} 
              onKick={() => handleKick(p.identity)}
            />
          ))}
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

/**
 * Individual Participant Row
 */
const ParticipantItem = ({ participant, isAdmin, onKick }) => {
  const isLocal = participant.isLocal;
  const isSpeaking = participant.isSpeaking;
  const isVideoOn = participant.isCameraEnabled;
  const isMicOn = participant.isMicrophoneEnabled;

  return (
    <div className={`p-4 rounded-2xl border transition-all ${
      isSpeaking 
        ? "bg-[#ff5e00]/5 border-[#ff5e00]/30 shadow-lg shadow-orange-900/5 scale-[1.02]" 
        : "bg-[#161616] border-[#262626] hover:border-[#ff5e00]/20"
    }`}>
      <div className="flex items-center justify-between gap-3">
        {/* Name & Identity */}
        <div className="flex items-center gap-3 overflow-hidden">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${
            isLocal ? "bg-[#ff5e00] text-white" : "bg-[#262626] text-gray-400"
          }`}>
            {participant.identity?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0 overflow-hidden">
            <div className="flex items-center gap-1.5">
              <p className="text-[11px] font-black text-white uppercase tracking-tighter truncate">
                {participant.identity}
              </p>
              {isLocal && <span className="text-[8px] font-black text-[#ff5e00] italic">YOU</span>}
            </div>
            <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">
              {isLocal ? "Local Node" : "Remote Node"}
            </p>
          </div>
        </div>

        {/* Status Indicators & Controls */}
        <div className="flex items-center gap-2">
           <div className={`p-1.5 rounded-md ${isMicOn ? "text-emerald-500" : "text-gray-700"}`}>
             {isMicOn ? <Mic size={14} /> : <MicOff size={14} />}
           </div>
           <div className={`p-1.5 rounded-md ${isVideoOn ? "text-emerald-500" : "text-gray-700"}`}>
             {isVideoOn ? <Video size={14} /> : <VideoOff size={14} />}
           </div>
           
           {isAdmin && !isLocal && (
             <button 
               onClick={onKick}
               className="p-1.5 text-gray-800 hover:text-rose-500 hover:bg-rose-500/10 rounded-md transition-all ml-1"
               title="Eject Node"
             >
               <Trash2 size={14} />
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default QuantumParticipants;
