import { Link as LinkIcon, Loader } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RouteIndex } from "../../components/RouteNames/RouteName";
import { useDispatch, useSelector } from "react-redux";
import { createCommunityPost } from "../../features/communityPostSlice";

const CreateCommunityPost = () => {
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    longDescription: "",
    url: "",
  });

  const token = useSelector((state) => state.auth.user?.token);

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.communityPost);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Form submitted:", formData);
      const body = { token, postData: formData };
      // You can send `formData` to your API here
      try {
        const result = dispatch(createCommunityPost(body));
        console.log("Post created successfully:", result);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
      setFormData({
        title: "",
        shortDescription: "",
        longDescription: "",
        url: "",
      });
      navigate(RouteIndex);
    } else {
      console.log("Form has errors");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Create a Post</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Title */}
        <div>
          <label htmlFor="title" className="block font-medium mb-1">
            Title<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full border rounded-lg p-2 ${
              errors.title ? "border-red-500" : ""
            }`}
            placeholder="Enter the title of your post"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}
        </div>

        {/* Short Description */}
        <div>
          <label htmlFor="shortDescription" className="block font-medium mb-1">
            Short Description<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="shortDescription"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            className={`w-full border rounded-lg p-2 ${
              errors.shortDescription ? "border-red-500" : ""
            }`}
            placeholder="Enter a short description"
          />
          {errors.shortDescription && (
            <p className="text-red-500 text-sm">{errors.shortDescription}</p>
          )}
        </div>

        {/* Full Description */}
        <div>
          <label htmlFor="longDescription" className="block font-medium mb-1">
            Full Description
          </label>
          <textarea
            id="longDescription"
            name="longDescription"
            rows="4"
            value={formData.longDescription}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="Enter the full description"
          ></textarea>
        </div>

        {/* URL */}
        <div>
          <label
            htmlFor="url"
            className="font-medium mb-1 flex items-center gap-1"
          >
            <LinkIcon className="w-4 h-4" /> URL
          </label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            className={`w-full border rounded-lg p-2 ${
              errors.url ? "border-red-500" : ""
            }`}
            placeholder="Enter a URL (optional)"
          />
          {errors.url && <p className="text-red-500 text-sm">{errors.url}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          disabled={loading}
        >
          {loading ? (
            <Loader className="w-6 h-6 animate-spin mx-auto" />
          ) : (
            "Create"
          )}{" "}
          Create
        </button>
      </form>
      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
    </div>
  );
};

export default CreateCommunityPost;
