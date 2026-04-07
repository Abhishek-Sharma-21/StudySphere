const AboutUs = () => {
  return (
    <div className="max-w-5xl mx-auto font-quicksand px-8 py-16 bg-[#0a0a0a]">
      <div className="text-center mb-20 relative group">
        <h2 className="text-5xl font-black text-white uppercase tracking-tighter">
          About <span className="text-[#ff5e00]">StudySphere</span>
        </h2>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-3">Mission Protocol // Decentralized academic node</p>
      </div>

      <p className="text-gray-400 text-lg mb-20 text-center font-bold leading-relaxed max-w-3xl mx-auto italic">
        "StudySphere is a high-performance collaborative ecosystem engineered to unify academic assets, promote seamless knowledge synchronization, and establish a resilient scholarly network. We operate on the principle that multi-threaded learning thrives through open transmission and decentralized access."
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section className="bg-[#161616] p-10 rounded-[3rem] border border-[#262626] shadow-xl relative group/section hover:border-[#ff5e00]/30 transition-all">
          <div className="absolute top-8 left-0 w-1 h-8 bg-[#ff5e00]"></div>
          <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 border-b border-[#262626] pb-4">Vision Architecture</h3>
          <p className="text-gray-500 text-sm font-bold leading-relaxed">
            We envision a paradigm shift where learners assume total control of their educational trajectory through integrated collaboration. Legacy frameworks often throttle innovation; StudySphere eliminates these bottlenecks, providing a global medium for knowledge exchange without latency or restriction.
          </p>
        </section>

        <section className="bg-[#161616] p-10 rounded-[3rem] border border-[#262626] shadow-xl relative group/section hover:border-[#ff5e00]/30 transition-all">
          <div className="absolute top-8 left-0 w-1 h-8 bg-[#ff5e00]"></div>
          <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 border-b border-[#262626] pb-4">Operational Assets</h3>
          <ul className="space-y-4">
            {[
              { label: "Resource Sync", desc: "Global access to prioritized academic data files." },
              { label: "Cluster Nodes", desc: "Targeted collaboration hubs for specialized study." },
              { label: "Real-time Link", desc: "Zero-latency synchronization for group projects." },
              { label: "Discourse Feed", desc: "High-bandwidth exchange of scholarly insights." }
            ].map((item, idx) => (
              <li key={idx} className="flex gap-4 items-start">
                <span className="text-[#ff5e00] font-black">//</span>
                <div>
                   <div className="text-[10px] font-black text-white uppercase tracking-widest">{item.label}</div>
                   <div className="text-[10px] text-gray-500 font-bold uppercase mt-1">{item.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-[#161616] p-10 rounded-[3rem] border border-[#262626] shadow-xl relative group/section hover:border-[#ff5e00]/30 transition-all flex flex-col justify-center">
          <div className="absolute top-8 left-0 w-1 h-8 bg-[#ff5e00]"></div>
          <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 border-b border-[#262626] pb-4">The Origin Packet</h3>
          <p className="text-gray-500 text-sm font-bold leading-relaxed italic">
            StudySphere was initialized by a collective of learners who identified critical failures in existing educational infrastructure. Driven by the necessity for accessible high-quality resources, they engineered a student-centric platform that adapts to the real-world demands of modern scholarship.
          </p>
        </section>

        <section className="bg-[#161616] p-10 rounded-[3rem] border border-[#262626] shadow-xl relative group/section border-l-4 border-l-[#ff5e00] flex flex-col justify-center">
          <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 border-b border-[#262626] pb-4">Primary Directive</h3>
          <p className="text-gray-400 text-sm font-black leading-relaxed">
            Our directive: Democratize knowledge access through decentralized, collaborative, and empowering frameworks. We are committed to fostering an environment where scholarship is a collective evolution, powered by community intelligence and relentless curiosity.
          </p>
          <div className="mt-8 pt-8 border-t border-[#262626] flex items-center justify-between">
             <span className="text-[10px] font-black text-[#ff5e00] uppercase tracking-widest">Join the Network</span>
             <div className="w-12 h-1 bg-[#ff5e00]/20 rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-[#ff5e00] animate-pulse"></div>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
