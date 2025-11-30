import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store, Star, MapPin, Package, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import apiClient, { API_ENDPOINTS } from "@/config/api";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

function VendorsPage() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [allVendors, setAllVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
      easing: "ease-out-cubic",
      offset: 120,
    });
    AOS.refresh();
  }, []);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch all approved vendors with a high limit
      const response = await apiClient.get(API_ENDPOINTS.SHOP.VENDOR.FEATURED, {
        params: { limit: 100 },
      });
      if (response.data.success) {
        const vendorsList = response.data.vendors || [];
        setAllVendors(vendorsList);
        setVendors(vendorsList);
      }
    } catch (err) {
      console.error("Error fetching vendors:", err);
      setError("Failed to load vendors. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleVendorClick = (sellerId) => {
    navigate(`/shop/vendor/${sellerId}`);
  };

  // Get unique categories from vendors
  const categories = ["All", ...new Set(allVendors.map((v) => v.storeCategory).filter(Boolean))];

  // Filter vendors based on search query and selected category
  useEffect(() => {
    let filtered = [...allVendors];

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (vendor) => vendor.storeCategory === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((vendor) => {
        const storeName = (vendor.storeName || "").toLowerCase();
        const category = (vendor.storeCategory || "").toLowerCase();
        const description = (vendor.description || "").toLowerCase();
        const businessType = (vendor.businessType || "").toLowerCase();

        return (
          storeName.includes(query) ||
          category.includes(query) ||
          description.includes(query) ||
          businessType.includes(query)
        );
      });
    }

    setVendors(filtered);
  }, [searchQuery, selectedCategory, allVendors]);

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchQuery(""); // Clear search when category is selected
  };

  const cardInView = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  const hoverScale = {
    scale: 1.05,
    transition: { duration: 0.3 },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EAF2FB] dark:bg-slate-900 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3785D8] mx-auto mb-4"></div>
            <p className="text-gray-700 dark:text-slate-300">Loading vendors...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#EAF2FB] dark:bg-slate-900 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</p>
            <button
              onClick={fetchVendors}
              className="px-6 py-2 rounded-lg text-white"
              style={{
                background: "linear-gradient(135deg,#1C1DAB,#3785D8)",
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EAF2FB] dark:bg-slate-900">
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-[#1E0F75] via-[#2f3fbd] to-[#3785D8] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center" data-aos="fade-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Vendors</h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Discover talented local artisans, creators, and entrepreneurs in your community
            </p>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-400" />
              <Input
                type="text"
                placeholder="Search vendors by name, category, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 h-14 text-base rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-[#3785D8] dark:focus:border-[#BF8CE1] text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Browse by Category
            </h2>
            <p className="text-gray-700 dark:text-slate-200">
              Find vendors in your preferred category
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                  selectedCategory === category
                    ? "text-white shadow-lg transform scale-105"
                    : "bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-[#3785D8] dark:hover:border-[#BF8CE1]"
                }`}
                style={
                  selectedCategory === category
                    ? {
                        background: "linear-gradient(135deg,#1C1DAB,#3785D8)",
                      }
                    : {}
                }
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Vendors Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">

          {vendors.length === 0 ? (
            <div className="text-center py-20">
              <Store className="w-24 h-24 mx-auto mb-6 text-gray-400 dark:text-slate-600" />
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                {searchQuery ? "No vendors found" : "No vendors found"}
              </h2>
              <p className="text-gray-600 dark:text-slate-400">
                {searchQuery
                  ? `No vendors match your search "${searchQuery}". Try a different search term.`
                  : "Check back soon for new vendors!"}
              </p>
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="mt-4 px-6 py-2 rounded-lg text-white font-semibold transition-all"
                  style={{
                    background: "linear-gradient(135deg,#1C1DAB,#3785D8)",
                  }}
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vendors.map((vendor, idx) => (
                <motion.div
                  key={vendor._id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={cardInView}
                  whileHover={hoverScale}
                  data-aos="zoom-in"
                  data-aos-delay={idx * 50}
                >
                  <Card
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-white dark:bg-slate-800 shadow-md rounded-2xl overflow-hidden group"
                    onClick={() => handleVendorClick(vendor._id)}
                  >
                    <CardContent className="p-0">
                      {/* Vendor Image/Background */}
                      <div className="relative h-48 overflow-hidden">
                        {vendor.backgroundImage ? (
                          <img
                            src={vendor.backgroundImage}
                            alt={vendor.storeName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#3785D8] to-[#BF8CE1] flex items-center justify-center">
                            <Store className="w-16 h-16 text-white/50" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        
                        {/* Profile Picture */}
                        <div className="absolute bottom-4 left-4 flex items-end gap-3">
                          <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                            {vendor.profilePic ? (
                              <img
                                src={vendor.profilePic}
                                alt={vendor.storeName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-[#3785D8] to-[#BF8CE1] flex items-center justify-center">
                                <Store className="w-10 h-10 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Vendor Info */}
                      <div className="p-6 pt-8 space-y-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
                            {vendor.storeName}
                          </h3>
                          {vendor.storeCategory && (
                            <Badge className="bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] text-white border-0 mt-2">
                              {vendor.storeCategory}
                            </Badge>
                          )}
                        </div>

                        {vendor.description && (
                          <p className="text-sm text-gray-600 dark:text-slate-300 line-clamp-2">
                            {vendor.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-slate-400 pt-2 border-t border-gray-200 dark:border-slate-700">
                          <div className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            <span>Products</span>
                          </div>
                          {vendor.businessType && (
                            <div className="flex items-center gap-1">
                              <Store className="w-4 h-4" />
                              <span className="capitalize">{vendor.businessType}</span>
                            </div>
                          )}
                        </div>

                        <button
                          className="w-full mt-4 py-2 rounded-lg text-white font-semibold transition-all"
                          style={{
                            background: "linear-gradient(135deg,#1C1DAB,#3785D8)",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVendorClick(vendor._id);
                          }}
                        >
                          View Store
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default VendorsPage;

