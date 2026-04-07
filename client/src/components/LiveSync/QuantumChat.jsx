import React, { useState, useEffect, useRef } from "react";
import { useChat } from "@livekit/components-react";
import EmojiPicker, { Theme as EmojiTheme } from "emoji-picker-react";
import { Send, Smile, X, MessageSquare, ChevronRight } from "lucide-react";

/**
 * QuantumChat - High-Scale Tactical Messenger
 */
const QuantumChat = ({ onClose }) => {
  const { send, chatMessages } = useChat();
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (message.trim()) {
      send(message);
      setMessage("");
      setShowEmojiPicker(false);
    }
  };

  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="flex flex-col h-full w-[350px] bg-[#0d0d0d] border-l border-[#262626] shadow-2xl relative animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="p-6 border-b border-[#262626] flex items-center justify-between bg-[#161616]/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#ff5e00]/10 rounded-lg flex items-center justify-center text-[#ff5e00]">
            <MessageSquare size={16} />
          </div>
          <h3 className="text-xs font-black text-white uppercase tracking-widest italic">Neural_Chat</h3>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-[#262626] rounded-xl text-gray-500 hover:text-white transition-all"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar"
      >
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
             <div className="w-12 h-12 border border-gray-600 rounded-full flex items-center justify-center mb-4">
                <ChevronRight size={24} className="text-gray-400 rotate-90" />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Initialize Uplink...</p>
          </div>
        ) : (
          chatMessages.map((msg, i) => {
            const isMe = msg.from?.isLocal;
            return (
              <div 
                key={i} 
                className={`flex flex-col ${isMe ? "items-end" : "items-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">
                    {isMe ? "YOU" : (msg.from?.name || "Anonymous")}
                  </span>
                  <span className="text-[7px] text-gray-800 font-bold">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs font-medium leading-relaxed shadow-lg ${
                  isMe 
                    ? "bg-[#ff5e00] text-white rounded-tr-none shadow-orange-900/10" 
                    : "bg-[#161616] text-gray-300 border border-[#262626] rounded-tl-none shadow-black/40"
                }`}>
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Emoji Picker Portal */}
      {showEmojiPicker && (
        <div className="absolute bottom-28 right-6 z-50 shadow-2xl animate-in zoom-in-95 fade-in duration-200">
           <EmojiPicker 
             theme={EmojiTheme.DARK}
             onEmojiClick={onEmojiClick}
             width={300}
             height={400}
             skinTonesDisabled
             searchDisabled
           />
        </div>
      )}

      {/* Input Field */}
      <div className="p-6 border-t border-[#262626] bg-[#0d0d0d]">
        <form onSubmit={handleSend} className="relative flex items-center gap-3">
          <button 
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`p-3 rounded-xl transition-all ${showEmojiPicker ? "bg-[#ff5e00] text-white" : "bg-[#161616] text-gray-500 hover:text-[#ff5e00] border border-[#262626]"}`}
          >
            <Smile size={18} />
          </button>
          
          <div className="flex-1 relative">
            <input 
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Inject message..."
              className="w-full bg-[#161616] border border-[#262626] rounded-xl px-4 py-3 text-xs font-bold text-white placeholder-gray-700 focus:border-[#ff5e00]/50 outline-none transition-all pr-12"
            />
            <button 
              type="submit"
              disabled={!message.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#ff5e00] hover:text-[#e65100] disabled:opacity-30 disabled:grayscale transition-all"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        /* Override Emoji Picker Styles to match StudySphere */
        .EmojiPickerReact {
          --epr-bg-color: #161616 !important;
          --epr-category-label-bg-color: #161616 !important;
          --epr-hover-bg-color: #262626 !important;
          --epr-focus-bg-color: #262626 !important;
          --epr-highlight-color: #ff5e00 !important;
          --epr-search-input-bg-color: #0d0d0d !important;
          border: 1px solid #262626 !important;
          border-radius: 24px !important;
        }
      `}</style>
    </div>
  );
};

export default QuantumChat;
