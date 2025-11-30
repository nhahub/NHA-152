import React, { useState } from "react";
import apiClient, { API_ENDPOINTS } from "@/config/api";
import { useToast } from "@/components/ui/use-toast";
import { useSelector } from "react-redux";

const BecomeSellerForm = () => {
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    storeName: "",
    phone: "",
    businessType: "",
    storeCategory: "",
    description: "",
    userAgreement: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      toast({
        title: "Please login first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post(API_ENDPOINTS.SHOP.SELLER, {
        ...formData,
        userId: user.id,
      });
      toast({
        title: res.data.message || "Seller application submitted successfully!",
      });
      // Reset form
      setFormData({
        storeName: "",
        phone: "",
        businessType: "",
        storeCategory: "",
        description: "",
        userAgreement: false,
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Error submitting application";
      toast({
        title: errorMessage,
        variant: "destructive",
      });
      console.error("Error submitting seller application:", err);
    } finally {
      setLoading(false);
    }
  };

  const buttonStyle = {
    background: "linear-gradient(135deg,#1E0F75,#3785D8)",
  };

  return (
    <section
      id="register"
      className="flex flex-col justify-center items-center py-16 min-h-screen bg-[#ADC6E5]">
      <h2
        style={{ color: "#1E0F75" }}
        className="text-3xl font-bold text-center mb-10"
      >
        Create your seller account
      </h2>

      <div
        className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl bg-white rounded-2xl shadow-2xl p-5 sm:p-10 border-l-8 hover:-translate-y-2 transition-transform duration-300"
        style={{ borderColor: "#1C1DAB" }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Store Name + Phone */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label
                style={{ color: "#1E0F75" }}
                className="block text-sm font-semibold mb-1"
              >
                Store Name <span className="text-red-500">*</span>
              </label>
              <input
                onChange={handleChange}
                value={formData.storeName}
                name="storeName"
                type="text"
                placeholder="Enter your store name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                required
              />
            </div>
            <div>
              <label
                style={{ color: "#1E0F75" }}
                className="block text-sm font-semibold mb-1"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                onChange={handleChange}
                value={formData.phone}
                name="phone"
                type="text"
                placeholder="Enter your phone number"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                required
              />
            </div>
          </div>

          {/* Business Type + Store Category */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label
                style={{ color: "#1E0F75" }}
                className="block text-sm font-semibold mb-1"
              >
                Business Type <span className="text-red-500">*</span>
              </label>
              <select
                onChange={handleChange}
                value={formData.businessType}
                name="businessType"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                required
              >
                <option value="" disabled>
                  Select business type
                </option>
                <option value="individual">Individual</option>
                <option value="company">Company</option>
                <option value="partnership">Partnership</option>
              </select>
            </div>

            <div>
              <label
                style={{ color: "#1E0F75" }}
                className="block text-sm font-semibold mb-1"
              >
                Store Category <span className="text-red-500">*</span>
              </label>
              <select
                onChange={handleChange}
                value={formData.storeCategory}
                name="storeCategory"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                required
              >
                <option value="" disabled>
                  Select category
                </option>
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Beauty and Personal Care</option>
                <option>Sports and Outdoors</option>
                <option>Food and Beverage</option>
                <option>Books and Media</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              style={{ color: "#1E0F75" }}
              className="block text-sm font-semibold mb-1"
            >
              Store Description <span className="text-red-500">*</span>
            </label>
            <textarea
              onChange={handleChange}
              value={formData.description}
              name="description"
              rows="4"
              placeholder="Write a short description about your store..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              required
            ></textarea>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2">
            <input
              onChange={handleChange}
              checked={formData.userAgreement}
              name="userAgreement"
              type="checkbox"
              id="terms"
              className="mt-1"
              required
            />
            <label
              style={{ color: "#1E0F75" }}
              htmlFor="terms"
              className="text-sm text-gray-700"
            >
              I agree to the{" "}
              <a href="#" className="text-indigo-700 underline hover:text-indigo-900">
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a href="#" className="text-indigo-700 underline hover:text-indigo-900">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-3 rounded-lg shadow-md hover:opacity-90 transition-all duration-300 mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            style={buttonStyle}
          >
            {loading ? "Submitting..." : "Become a Seller"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default BecomeSellerForm;

