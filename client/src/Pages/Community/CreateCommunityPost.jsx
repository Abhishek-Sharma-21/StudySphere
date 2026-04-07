import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RouteIndex } from "../../components/RouteNames/RouteName";
import { useDispatch, useSelector } from "react-redux";
import { createCommunityPost, getPostById, updateCommunityPost } from "../../features/communityPostSlice";
import toast from "react-hot-toast";
import { LinkIcon } from "lucide-react";

const CreateCommunityPost = () => {
  const { postId } = useParams();
  const isEditMode = !!postId;
  
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    longDescription: "",
    url: "",
  });

  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.communityPost);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Load existing post data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      dispatch(getPostById(postId)).then((res) => {
        if (getPostById.fulfilled.match(res)) {
          const p = res.payload;
          setFormData({
            title: p.title || "",
            shortDescription: p.shortDescription || "",
            longDescription: p.longDescription || "",
            url: p.url || "",
          });
        }
      });
    }
  }, [dispatch, isEditMode, postId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = "Short description is required";
    }
    if (formData.url && !/^https?:\/\/\S+$/.test(formData.url)) {
      newErrors.url = "Enter a valid URL";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // valid if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate("/login");
      return;
    }
    if (validateForm()) {
      if (isEditMode) {
        const result = await dispatch(updateCommunityPost({ postId, token, postData: formData }));
        if (updateCommunityPost.fulfilled.match(result)) {
           toast.success("Transmission Updated");
           navigate(-1);
        } else {
           toast.error(result.payload || "Update Failed");
        }
      } else {
        const result = await dispatch(createCommunityPost({ token, postData: formData, category: "community" }));
        if (createCommunityPost.fulfilled.match(result)) {
          toast.success("Transmission Initialized");
          setFormData({ title: "", shortDescription: "", longDescription: "", url: "" });
          navigate(RouteIndex);
        } else {
          toast.error(result.payload || "Transmission Failed");
        }
      }
    }
  };


  return (
    <div className="max-w-3xl mx-auto p-8 font-quicksand">
      <div className="mb-10 relative group">
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-1 h-12 bg-[#ff5e00] rounded-full group-hover:h-16 transition-all duration-300"></div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
          {isEditMode ? "Update" : "Initiate"} <span className="text-[#ff5e00]">Transmission</span>
        </h2>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">
          {isEditMode ? "Data Sync Mode // Re-authorization Verified" : "New Data Packet // Authorization Verified"}
        </p>
      </div>

      <form className="flex flex-col gap-6 bg-[#161616] p-8 rounded-3xl border border-[#262626] shadow-2xl relative overflow-hidden" onSubmit={handleSubmit}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff5e00] to-transparent opacity-30"></div>
        
        {/* Title */}
        <div className="space-y-2">
          <label htmlFor="title" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
            Designation <small className="text-[#ff5e00] ml-1">*</small>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className={`w-full bg-[#0a0a0a] border border-[#262626] rounded-xl p-4 text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#ff5e00]/30 focus:border-[#ff5e00] transition-all placeholder-gray-700 ${
              errors.title ? "border-rose-500/50 ring-1 ring-rose-500/20" : ""
            }`}
            placeholder="SYSTEM TITLE IDENTIFIER"
          />
          {errors.title && (
            <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest ml-1">{errors.title}</p>
          )}
        </div>

        {/* Short Description */}
        <div className="space-y-2">
          <label htmlFor="shortDescription" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
            Summary Core <small className="text-[#ff5e00] ml-1">*</small>
          </label>
          <textarea
            id="shortDescription"
            name="shortDescription"
            rows="2"
            value={formData.shortDescription}
            onChange={handleChange}
            className={`w-full bg-[#0a0a0a] border border-[#262626] rounded-xl p-4 text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#ff5e00]/30 focus:border-[#ff5e00] transition-all placeholder-gray-700 resize-none ${
              errors.shortDescription ? "border-rose-500/50 ring-1 ring-rose-500/20" : ""
            }`}
            placeholder="BRIEF DATA OVERVIEW"
          />
          {errors.shortDescription && (
            <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest ml-1">{errors.shortDescription}</p>
          )}
        </div>

        {/* Full Description */}
        <div className="space-y-2">
          <label htmlFor="longDescription" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
            Extended Logs
          </label>
          <textarea
            id="longDescription"
            name="longDescription"
            rows="6"
            value={formData.longDescription}
            onChange={handleChange}
            className="w-full bg-[#0a0a0a] border border-[#262626] rounded-xl p-4 text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#ff5e00]/30 focus:border-[#ff5e00] transition-all placeholder-gray-700"
            placeholder="DETAILED TELEMETRY DATA"
          ></textarea>
        </div>

        {/* URL */}
        <div className="space-y-2">
          <label
            htmlFor="url"
            className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2"
          >
            <LinkIcon className="w-3 h-3 text-[#ff5e00]" /> External Linkage
          </label>
          <div className="relative group/link">
             <input
               type="url"
               id="url"
               name="url"
               value={formData.url}
               onChange={handleChange}
               className={`w-full bg-[#0a0a0a] border border-[#262626] rounded-xl p-4 pl-12 text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#ff5e00]/30 focus:border-[#ff5e00] transition-all placeholder-gray-700 ${
                 errors.url ? "border-rose-500/50 ring-1 ring-rose-500/20" : ""
               }`}
               placeholder="https://external-resource-node.io"
             />
             <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-[#161616] rounded-lg border border-[#262626] group-hover/link:border-[#ff5e00]/30 transition-colors">
                <LinkIcon size={12} className="text-gray-500 group-hover/link:text-[#ff5e00]" />
             </div>
          </div>
          {errors.url && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest ml-1">{errors.url}</p>}
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-[#262626] mt-4 flex flex-col sm:flex-row gap-4">
           <button
             type="button"
             onClick={() => navigate(-1)}
             className="px-8 py-4 bg-[#262626] text-gray-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#333] hover:text-white transition-all order-2 sm:order-1"
           >
             Abort
           </button>
           <button
             type="submit"
             disabled={loading}
             className="flex-1 bg-[#ff5e00] hover:bg-[#e65100] text-white font-black py-4 px-8 rounded-xl text-xs uppercase tracking-widest shadow-xl shadow-orange-900/20 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-3 order-1 sm:order-2"
           >
             {loading ? (
               <>
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 <span>Transmitting...</span>
               </>
             ) : (
               <>
                 <span>{isEditMode ? "Sync Transmission" : "Execute Transmission"}</span>
               </>
             )}
           </button>
        </div>
      </form>
      {error && <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl">
         <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest text-center">{error}</p>
      </div>}
    </div>
  );
};

export default CreateCommunityPost;
