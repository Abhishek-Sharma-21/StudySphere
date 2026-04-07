import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { User, Mail, Shield, Save, Smartphone, Palette, Bell, Activity, UserCircle } from "lucide-react";
import { updateUserProfile } from "../../features/authSlice";
import toast from "react-hot-toast";

const Settings = () => {
  const dispatch = useDispatch();
  const { user, token, isLoading } = useSelector((state) => state.auth);
  const currentUser = user?.user || user;

  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    bio: currentUser?.bio || "",
  });

  const [activeTab, setActiveTab] = useState("profile");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    dispatch(updateUserProfile({ body: formData, token }))
      .then((res) => {
        if (updateUserProfile.fulfilled.match(res)) {
          toast.success("Neural Profile Synchronized");
        } else {
          toast.error(res.payload || "Synchronization Failed");
        }
      });
  };

  return (
    <div className="p-4 lg:p-8 animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">System Config</h1>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Node ID: {currentUser?._id}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="w-full lg:w-64 space-y-2">
            <TabButton 
              active={activeTab === "profile"} 
              icon={<UserCircle size={18} />} 
              label="Profile Integrity" 
              onClick={() => setActiveTab("profile")} 
            />
            <TabButton 
              active={activeTab === "preferences"} 
              icon={<Palette size={18} />} 
              label="Neural Sync" 
              onClick={() => setActiveTab("preferences")} 
            />
            <TabButton 
              active={activeTab === "notifications"} 
              icon={<Bell size={18} />} 
              label="Alert Protocols" 
              onClick={() => setActiveTab("notifications")} 
            />
            <TabButton 
              active={activeTab === "security"} 
              icon={<Shield size={18} />} 
              label="Security Core" 
              onClick={() => setActiveTab("security")} 
              disabled
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {activeTab === "profile" && (
              <div className="bg-[#111111]/50 backdrop-blur-xl border border-[#222222] rounded-[2.5rem] p-8 lg:p-12 shadow-2xl overflow-hidden relative">
                {/* Background Glow */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#ff5e00]/5 filter blur-[100px] rounded-full"></div>
                
                <h2 className="text-xl font-black text-white uppercase tracking-tight mb-8">Profile Integrity</h2>
                
                <form onSubmit={handleUpdateProfile} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ConfigInput 
                      label="Full Designation" 
                      icon={<User size={16} />} 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter legal name..."
                    />
                    <ConfigInput 
                      label="Neural Address (Email)" 
                      icon={<Mail size={16} />} 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="user@network.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Biosync signature</label>
                    <div className="relative group/field">
                       <textarea 
                         name="bio"
                         value={formData.bio}
                         onChange={handleChange}
                         rows="4"
                         className="w-full bg-[#0a0a0a] border border-[#222222] rounded-3xl p-6 text-white text-sm outline-none focus:border-[#ff5e00]/50 transition-all placeholder:text-gray-700 resize-none"
                         placeholder="Synthesize your mission statement..."
                       />
                       <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff5e00]/20 to-transparent scale-x-0 group-focus-within/field:scale-x-100 transition-transform duration-500"></div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="group flex items-center gap-3 bg-[#ff5e00] hover:bg-[#ff7a29] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-orange-900/20 disabled:opacity-50"
                    >
                      {isLoading ? (
                         <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <Save size={16} className="group-hover:scale-110 transition-transform" />
                      )}
                      Sync Protocol
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "preferences" && (
              <div className="bg-[#111111]/50 backdrop-blur-xl border border-[#222222] rounded-[2.5rem] p-12 text-center">
                 <div className="w-20 h-20 bg-[#161616] rounded-3xl flex items-center justify-center mx-auto mb-6 text-[#ff5e00] border border-[#222222]">
                    <Smartphone size={32} />
                 </div>
                 <h3 className="text-white font-black uppercase tracking-widest mb-2 text-sm">Neural Sync Level</h3>
                 <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em]">Currently locked at Level 1 (Default Aesthetic)</p>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-[#111111]/50 backdrop-blur-xl border border-[#222222] rounded-[2.5rem] p-12 text-center text-gray-700">
                 <Bell size={48} className="mx-auto mb-4 opacity-20" />
                 <p className="text-[10px] font-black uppercase tracking-widest">Alert protocols are standard. Custom routing coming in v2.0</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, icon, label, onClick, disabled }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
      disabled ? "opacity-30 cursor-not-allowed" : 
      active ? "bg-[#ff5e00] text-white shadow-lg shadow-orange-900/20" : "bg-transparent text-gray-500 hover:text-white hover:bg-[#161616]"
    }`}
  >
    {icon}
    {label}
  </button>
);

const ConfigInput = ({ label, icon, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group/field">
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/field:text-[#ff5e00] transition-colors">
        {icon}
      </div>
      <input 
        {...props}
        className="w-full bg-[#0a0a0a] border border-[#222222] rounded-2xl py-4 pl-14 pr-6 text-white text-sm outline-none focus:border-[#ff5e00]/50 transition-all placeholder:text-gray-700"
      />
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff5e00]/50 to-transparent scale-x-0 group-focus-within/field:scale-x-100 transition-transform duration-500"></div>
    </div>
  </div>
);

export default Settings;
