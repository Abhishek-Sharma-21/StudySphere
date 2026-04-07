const AiSupport = () => {
  return (
    <div className="h-[60vh] w-full font-quicksand bg-[#0a0a0a] flex flex-col justify-center items-center p-8">
      <div className="relative group mb-8">
        <div className="absolute -inset-4 bg-[#ff5e00]/20 rounded-full blur-2xl group-hover:bg-[#ff5e00]/40 transition-all duration-700 animate-pulse"></div>
        <div className="relative w-24 h-24 bg-[#161616] rounded-3xl border border-[#ff5e00]/30 flex items-center justify-center shadow-2xl">
           <div className="w-12 h-12 border-4 border-[#ff5e00] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
      <h2 className="text-3xl font-black text-white uppercase tracking-tighter text-center">
        Neural <span className="text-[#ff5e00]">Support</span> Engine
      </h2>
      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mt-4 animate-pulse">
        Initializing AI Integration // 84% Synchronized
      </p>
    </div>
  );
};
export default AiSupport;
