import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setIsInCall, setActiveRoomId, clearCall } from "../../features/liveSync/liveSyncSlice";
import { 
  LiveKitRoom, 
  GridLayout,
  ControlBar, 
  RoomAudioRenderer,
  ParticipantTile,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";

import "@livekit/components-styles";
import { fetchLiveSyncToken } from "../../features/liveSync/liveKitService";
import { SYNC_CONFIG } from "../../utils/liveSync/syncConstants";
import { Loader2, AlertCircle, MessageSquare, Users } from "lucide-react";
import QuantumChat from "./QuantumChat";
import QuantumParticipants from "./QuantumParticipants";

/**
 * MeetingWorkspace - Internal Layout Logic 
 * This component MUST be a child of LiveKitRoom to use hooks correctly.
 */
const MeetingWorkspace = ({ activePanel, setActivePanel, groupId, authToken, isAdmin }) => {
  const [waitingCount, setWaitingCount] = useState(0);

  // Tactical Awareness: Poll for waiting nodes if Admin
  useEffect(() => {
    if (!isAdmin) return;

    const checkWaitingRoom = async () => {
      try {
        const data = await import("../../features/liveSync/liveKitService").then(m => m.getCallWaitingRoom(authToken, groupId));
        setWaitingCount(data.length);
      } catch (err) {
        console.error("Critical: Awareness Handshake Failed", err);
      }
    };

    const interval = setInterval(checkWaitingRoom, 5000);
    checkWaitingRoom();

    return () => clearInterval(interval);
  }, [isAdmin, authToken, groupId]);

  // Explicitly fetch tracks for the grid
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  return (
    <div className="flex flex-1 relative overflow-hidden">
      {/* Left: Video Grid */}
      <div className="flex-1 flex flex-col relative bg-black/20 transition-all duration-500">
        <div className="flex-1 overflow-hidden p-6">
           <GridLayout tracks={tracks}>
             <ParticipantTile />
           </GridLayout>
        </div>
        
        {/* Tactical Control Bridge */}
        <div className="p-6 flex items-center justify-center gap-4 bg-[#0d0d0d]/90 backdrop-blur-2xl border-t border-[#262626]/50">
           <ControlBar variation="minimal" controls={{ chat: false }} />
           
           <div className="h-8 w-[1px] bg-[#262626] mx-2"></div>

           {/* Participants Toggle */}
           <div className="relative">
             <button 
               onClick={() => setActivePanel(activePanel === 'participants' ? null : 'participants')}
               className={`p-3 rounded-xl border transition-all duration-300 ${
                 activePanel === 'participants'
                  ? "bg-[#ff5e00] text-white border-[#ff5e00] shadow-lg shadow-orange-900/20" 
                  : "bg-[#161616] text-gray-500 border-[#262626] hover:text-[#ff5e00] hover:border-[#ff5e00]/50"
               }`}
               title="Colony Manifest"
             >
               <Users size={18} />
             </button>
             {isAdmin && waitingCount > 0 && activePanel !== 'participants' && (
               <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[8px] font-black rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-rose-900/40 border-2 border-[#0d0d0d]">
                 {waitingCount}
               </span>
             )}
           </div>

           {/* Chat Toggle */}
           <button 
             onClick={() => setActivePanel(activePanel === 'chat' ? null : 'chat')}
             className={`p-3 rounded-xl border transition-all duration-300 ${
               activePanel === 'chat' 
                ? "bg-[#ff5e00] text-white border-[#ff5e00] shadow-lg shadow-orange-900/20" 
                : "bg-[#161616] text-gray-500 border-[#262626] hover:text-[#ff5e00] hover:border-[#ff5e00]/50"
             }`}
             title="Neural Chat"
           >
             <MessageSquare size={18} />
           </button>
        </div>
      </div>


      {/* Right Sidebar: Dynamic Panel */}
      {activePanel === 'chat' && (
        <QuantumChat onClose={() => setActivePanel(null)} />
      )}
      
      {activePanel === 'participants' && (
        <QuantumParticipants 
          roomName={groupId}
          authToken={authToken}
          isAdmin={isAdmin}
          onClose={() => setActivePanel(null)} 
        />
      )}
    </div>
  );
};

/**
 * QuantumMeeting - The High-Scale Live Sync Interface
 */
const QuantumMeeting = ({ groupId, userName, authToken, isAdmin, onDisconnect }) => {
  const dispatch = useDispatch();
  const [token, setToken] = useState(null);
  const [serverUrl, setServerUrl] = useState(null);
  const [error, setError] = useState(null);
  const [activePanel, setActivePanel] = useState('chat');

  // Sync with global layout state - Persistent Session Protocol
  useEffect(() => {
    dispatch(setIsInCall(true));
    dispatch(setActiveRoomId(groupId));
    
    // NO CLEANUP: We purposefully do not reset state on unmount.
    // This allows the Ghost Mode sidebar to stay collapsed while the page refreshes.
    // Cleanup only happens via explicit "Leave" button or Admin Disconnect.
  }, [dispatch, groupId]);

  useEffect(() => {
    const initializeSync = async () => {
      try {
        const data = await fetchLiveSyncToken(authToken, {
          roomName: groupId,
          participantName: userName,
          isAdmin: isAdmin
        });
        setToken(data.token);
        setServerUrl(data.serverUrl);
      } catch (err) {
        setError(err.message || "Failed to initialize Neural Link.");
      }
    };

    if (groupId && userName && authToken) {
      initializeSync();
    }
  }, [groupId, userName, authToken, isAdmin]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-rose-900/10 border border-rose-900/30 rounded-[3rem] text-rose-500 max-w-lg mx-auto">
        <AlertCircle size={48} className="mb-4" />
        <h3 className="text-lg font-black uppercase tracking-tighter mb-2">Sync Error</h3>
        <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-6 text-center">{error}</p>
        <button 
          onClick={() => {
            dispatch(clearCall());
            onDisconnect();
          }}
          className="bg-rose-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-rose-900/40"
        >
          Terminate Connection
        </button>
      </div>
    );
  }

  if (!token || !serverUrl) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-[#ff5e00] animate-pulse">
        <Loader2 size={48} className="animate-spin mb-6" />
        <h3 className="text-xl font-black uppercase tracking-[0.3em]">Authenticating Node...</h3>
        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-2">Connecting to LiveKit Cloud</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[550px] bg-[#0a0a0a] rounded-[3rem] border-2 border-[#262626] relative overflow-hidden flex lk-theme-default transition-all duration-500 shadow-2xl">
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={serverUrl}
        onDisconnected={() => {
          dispatch(clearCall());
          onDisconnect();
        }}
        className="flex flex-1 relative"
        connectOptions={{
          autoSubscribe: true,
        }}
      >
        <MeetingWorkspace 
          activePanel={activePanel} 
          setActivePanel={setActivePanel} 
          groupId={groupId}
          authToken={authToken}
          isAdmin={isAdmin}
        />

        <RoomAudioRenderer />
      </LiveKitRoom>
      
      {/* Premium Visual Overrides */}
      <style>{`
        .lk-grid-layout {
          gap: 1.5rem !important;
        }
        .lk-participant-tile {
          border-radius: 2.5rem !important;
          border: 1.5px solid #262626 !important;
          overflow: hidden;
          background: #0d0d0d !important;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .lk-participant-tile:hover {
          border-color: #ff5e0060 !important;
          box-shadow: 0 0 30px rgba(255, 94, 0, 0.05);
        }
        .lk-control-bar {
          background: transparent !important;
          border: none !important;
          gap: 0.75rem !important;
        }
        .lk-button {
          background: #161616 !important;
          border: 1px solid #262626 !important;
          border-radius: 14px !important;
          color: white !important;
          padding: 0.8rem !important;
          transition: all 0.2s ease;
        }
        .lk-button:hover:not(:disabled) {
          background: #262626 !important;
          border-color: #ff5e00 !important;
          color: #ff5e00 !important;
        }
        .lk-button-primary {
          background: #ff5e00 !important;
          border-color: #ff5e00 !important;
        }
        .lk-focus-layout {
           border-radius: 2.5rem !important;
        }
        .lk-pagination-control {
           background: #16161670 !important;
           backdrop-filter: blur(10px);
           border-radius: 12px;
           margin-bottom: 5px;
        }
      `}</style>
    </div>
  );
};

export default QuantumMeeting;
