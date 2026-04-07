const ContactUs = () => {
  return (
    <div className="max-w-3xl mx-auto px-8 py-16 bg-[#0a0a0a] font-quicksand">
      <div className="text-center mb-16 relative group">
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
          Contact <span className="text-[#ff5e00]">Support</span>
        </h2>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-2">Direct Linkage // Telemetry sync initiated</p>
      </div>

      <form className="flex flex-col gap-6 bg-[#161616] p-10 rounded-[3rem] border border-[#262626] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff5e00] to-transparent opacity-50"></div>
        
        {/* Name */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
            Identity Descriptor
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="SYSTEM NAME ID"
            className="w-full bg-[#0a0a0a] border border-[#262626] rounded-2xl p-4 text-white text-sm font-bold focus:ring-2 focus:ring-[#ff5e00]/30 focus:border-[#ff5e00] outline-none transition-all placeholder-gray-800"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
            Digital Signature (Email)
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="USER@NETWORK.COM"
            className="w-full bg-[#0a0a0a] border border-[#262626] rounded-2xl p-4 text-white text-sm font-bold focus:ring-2 focus:ring-[#ff5e00]/30 focus:border-[#ff5e00] outline-none transition-all placeholder-gray-800"
          />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label htmlFor="message" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
            Data Payload
          </label>
          <textarea
            id="message"
            name="message"
            rows="5"
            required
            placeholder="ENTER TRANSMISSION CONTENT..."
            className="w-full bg-[#0a0a0a] border border-[#262626] rounded-2xl p-4 text-white text-sm font-bold focus:ring-2 focus:ring-[#ff5e00]/30 focus:border-[#ff5e00] outline-none transition-all placeholder-gray-800 resize-none"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 bg-[#ff5e00] text-white py-5 px-10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#e65100] transition-all shadow-xl shadow-orange-900/30 active:scale-95 flex items-center justify-center gap-3"
        >
          Execute Transmission
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
