import React from "react";

const CollaborationDashboard = () => {
  return (
    <div className="text-center mt-12 py-10 bg-[#161616] border border-[#262626] rounded-3xl shadow-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-[#ff5e00]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      <div className="relative z-10">
        <h3 className="text-xl font-black text-white uppercase tracking-[0.3em] mb-6">Quantum Collaboration</h3>
        <button className="bg-[#ff5e00] hover:bg-[#e65100] text-white font-black py-4 px-12 rounded-2xl text-xs uppercase tracking-[0.2em] shadow-[0_10px_40px_-10px_rgba(255,94,0,0.5)] active:scale-95 transition-all">
          Start Live Synchronization
        </button>
        <p className="mt-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">
           Zero-latency collaborative study environment
        </p>
      </div>
    </div>
  );
};

export default CollaborationDashboard;
