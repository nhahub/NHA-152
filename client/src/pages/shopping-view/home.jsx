import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import headerpic1 from "../../assets/header1.png";
import headerpic2 from "../../assets/header3 (2).png";
import headerpic3 from "../../assets/header3 (1).png";
import accessories from "../../assets/accessories.jpg";
import catering from "../../assets/catering.jpg";
import Healthy from "../../assets/Healthy.jpg";
import tailor from "../../assets/tailor.jpg";
import pizza from "../../assets/pizza.jpg";
import food from "../../assets/Healthybreakfast.jpg";
import food2 from "../../assets/food.jpg";
import cloth1 from "../../assets/cloth (1).jpg";
import {
  MapPin,
  Star,
  Clock,
  Shield,
  Sparkles,
  Navigation,
  Award,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation as SwiperNavigation,
  Pagination,
  Autoplay,
  EffectFade,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate, Link } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import apiClient, { API_ENDPOINTS } from "@/config/api";
import WishlistButton from "@/components/common/wishlist-button";

const categoriesWithIcon = [
  {
    id: "tailors",
    label: "Tailors",
    img: tailor,
  },
  {
    id: "home-cooked-food",
    label: "Home Cooked Food",
    img: pizza,
  },
  {
    id: "handmade-health-products",
    label: "Handmade health products",
    img: Healthy,
  },
  {
    id: "handmade-accessories",
    label: "Handmade accessories",
    img: accessories,
  },
  {
    id: "catering",
    label: "Catering",
    img: catering,
  },
];

const platformFeatures = [
  {
    icon: Sparkles,
    title: "Custom Orders",
    description: "Request personalized products directly from local artisans",
  },
  {
    icon: Shield,
    title: "Transparency",
    description: "Full details about ingredients, materials, and processes",
  },
  {
    icon: MapPin,
    title: "Local Focus",
    description: "Support your community and discover nearby talent",
  },
  {
    icon: Award,
    title: "Quality Assured",
    description: "Verified vendors with excellent ratings and reviews",
  },
];

function ShoppingHome() {
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { user } = useSelector((state) => state.auth);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  
  // Dynamic data states
  const [specialOffers, setSpecialOffers] = useState([]);
  const [featuredVendors, setFeaturedVendors] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [loadingVendors, setLoadingVendors] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingBlog, setLoadingBlog] = useState(true);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
      easing: "ease-out-cubic",
      offset: 120,
    });
    AOS.refresh();
  }, []);

  // Fetch special offers (products with salePrice > 0)
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoadingOffers(true);
        const response = await apiClient.get(API_ENDPOINTS.SHOP.PRODUCTS.GET_OFFERS, {
          params: { limit: 6 },
        });
        if (response.data.success) {
          setSpecialOffers(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching offers:", error);
      } finally {
        setLoadingOffers(false);
      }
    };
    fetchOffers();
  }, []);

  // Fetch featured vendors
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoadingVendors(true);
        const response = await apiClient.get(API_ENDPOINTS.SHOP.VENDOR.FEATURED, {
          params: { limit: 6 },
        });
        if (response.data.success) {
          setFeaturedVendors(response.data.vendors || []);
        }
      } catch (error) {
        console.error("Error fetching vendors:", error);
      } finally {
        setLoadingVendors(false);
      }
    };
    fetchVendors();
  }, []);

  // Fetch featured products (latest products)
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoadingFeatured(true);
        const response = await apiClient.get(API_ENDPOINTS.SHOP.PRODUCTS.GET_LATEST, {
          params: { limit: 6 },
        });
        if (response.data.success) {
          setFeaturedProducts(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoadingFeatured(false);
      }
    };
    fetchFeatured();
  }, []);

  // Fetch blog posts
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoadingBlog(true);
        const response = await apiClient.get(API_ENDPOINTS.SHOP.BLOG.GET, {
          params: { limit: 6, published: true },
        });
        if (response.data.success) {
          setBlogPosts(response.data.articles || []);
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoadingBlog(false);
      }
    };
    fetchBlogs();
  }, []);

  // Fetch popular products (for Popular Marketplace Picks)
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        setLoadingPopular(true);
        const response = await apiClient.get(API_ENDPOINTS.SHOP.PRODUCTS.GET_LATEST, {
          params: { limit: 8 },
        });
        if (response.data.success) {
          setPopularProducts(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching popular products:", error);
      } finally {
        setLoadingPopular(false);
      }
    };
    fetchPopular();
  }, []);

  // Fetch recent testimonials/reviews
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoadingTestimonials(true);
        const response = await apiClient.get(
          API_ENDPOINTS.SHOP.REVIEW.RECENT,
          {
            params: { limit: 9 },
          }
        );
        if (response.data.success) {
          setTestimonials(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoadingTestimonials(false);
      }
    };

    fetchTestimonials();
  }, []);

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    if (!user?.id) {
      toast({
        title: "Please login to add items to cart",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }

    dispatch(
      addToCart({
        userId: user.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  function handleCustomOrder(vendorId) {
    if (vendorId) {
      navigate(`/shop/vendor/${vendorId}`);
    } else {
      toast({
        title: "Custom order flow coming soon",
      });
    }
  }

  function handleViewStore(vendorId) {
    if (vendorId) {
      navigate(`/shop/vendor/${vendorId}`);
    } else {
      navigate("/shop/listing");
    }
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  const cardInView = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };
  const hoverScale = { scale: 1.02, transition: { duration: 0.18 } };
  const btnTextClass = "text-white";
  const tickerMessages = [
    "Welcome to LuxMart — where style meets comfort",
    "Exclusive deals — up to 50% off this week!",
    "Discover premium marketplace essentials today",
    "Shop smart. Live beautifully.",
  ];

  return (
    <div className="flex flex-col min-h-screen bg-bg-100 dark:bg-slate-900">
      <section className="relative min-h-[80vh] overflow-hidden">
        <Swiper
          modules={[SwiperNavigation, Autoplay, EffectFade]}
          navigation={true}
          pagination={{ clickable: true }}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop={true}
          speed={800}
          grabCursor={true}
          className="h-full"
        >
          <SwiperSlide>
            <div className="relative bg-gradient-hero min-h-[80vh] flex items-center">
              <div className="absolute inset-0 bg-black/12"></div>
              <div className="container mx-auto px-6 lg:px-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <motion.div
                    className="text-white"
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    data-aos="fade-right"
                  >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                      Discover Local
                      <span className="block text-accent-500">
                        Artisans & Creators
                      </span>
                    </h1>
                    <p className="text-lg text-white/90 mb-6 max-w-lg">
                      Connect with talented local businesses — from custom
                      tailors to home-cooked meals. Support small entrepreneurs
                      and get unique, personalized products.
                    </p>
                    <div className="flex gap-3">
                      <Button className="bg-gradient-primary hover:opacity-90 px-6 py-3 rounded-xl text-white">
                        Explore
                      </Button>
                      <Button className="bg-white/10 border border-white/20 hover:bg-white/12 px-6 py-3 rounded-xl text-white">
                        How it works
                      </Button>
                    </div>
                  </motion.div>

                  <motion.div
                    className="relative w-full lg:h-[400px] md:h-80 overflow-hidden"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    data-aos="fade-left"
                  >
                    <img
                      src={headerpic1}
                      alt="Artisan showcase"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="relative bg-gradient-to-br from-primary-600 to-accent-500 min-h-[80vh] flex items-center">
              <div className="absolute inset-0 bg-black/12"></div>
              <div className="container mx-auto px-6 lg:px-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <motion.div
                    className="text-white"
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.05 }}
                    data-aos="fade-right"
                  >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                      Custom Orders
                      <span className="block text-yellow-300">
                        Made Just for You
                      </span>
                    </h1>
                    <p className="text-lg text-white/90 mb-6 max-w-lg">
                      Request personalized products from local artisans. Get
                      exactly what you want, made with care and attention to
                      detail.
                    </p>
                    <div className="flex gap-3">
                      <Button className="bg-white text-primary-600 hover:bg-white/90 px-6 py-3 rounded-xl">
                        Start Custom Order
                      </Button>
                    </div>
                  </motion.div>

                  <motion.div
                    className="relative w-full lg:w-[70%]"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.05 }}
                    data-aos="fade-left"
                  >
                    <img
                      src={headerpic2}
                      alt="Custom orders"
                      className="w-full object-cover"
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="relative bg-gradient-to-br from-secondary-500 to-primary-500 min-h-[80vh] flex items-center">
              <div className="absolute inset-0 bg-black/12"></div>
              <div className="container mx-auto px-6 lg:px-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <motion.div
                    className="text-white"
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    data-aos="fade-right"
                  >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                      Support Local
                      <span className="block text-green-300">Communities</span>
                    </h1>
                    <p className="text-lg text-white/90 mb-6 max-w-lg">
                      Every purchase supports local entrepreneurs and helps
                      build stronger communities. Discover the talent in your
                      neighborhood.
                    </p>
                    <div className="flex gap-3">
                      <Button className="bg-white text-secondary-600 hover:bg-white/90 px-6 py-3 rounded-xl">
                        Explore Vendors
                      </Button>
                    </div>
                  </motion.div>

                  <motion.div
                    className="relative w-full lg:w-[60%]"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    data-aos="fade-left"
                  >
                    <img
                      src={headerpic3}
                      alt="Support local"
                      className="w-full object-cover"
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      <div className="relative overflow-hidden h-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-900 dark:via-purple-800 dark:to-pink-900 flex items-center justify-center text-white text-sm sm:text-base font-medium">
        <motion.div
          className="flex gap-5 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "linear",
          }}
        >
          {[...tickerMessages, ...tickerMessages].map((msg, i) => (
            <span key={i} className="mx-6">
              {msg}
            </span>
          ))}
        </motion.div>
      </div>

      <section className="py-12 bg-[#EAF2FB] dark:bg-slate-900" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-text-900 dark:text-slate-100 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-900 dark:text-slate-100 max-w-2xl mx-auto">
              Find exactly what you're looking for from our diverse range of
              local businesses
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categoriesWithIcon.map((category, idx) => (
              <motion.div
                key={category.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={cardInView}
                whileHover={hoverScale}
                className="group"
                data-aos="zoom-in"
                data-aos-delay={idx * 60}
              >
                <Card
                  onClick={() =>
                    handleNavigateToListingPage(category, "category")
                  }
                  className="cursor-pointer hover:shadow-custom-2 transition-all duration-300 hover:-translate-y-2 border-0 bg-card-bg dark:bg-slate-800"
                >
                  <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-24 h-24 overflow-hidden rounded-full bg-gradient-to-br from-primary-100 to-primary-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <img
                        src={category.img}
                        alt={category.label}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-text-900 dark:text-slate-100 mb-2">
                      {category.label}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-slate-200">
                      Explore local options
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-bg-200 dark:bg-slate-800/60" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-text-900 dark:text-slate-100 mb-4">
              Special Offers
            </h2>
            <p className="text-lg text-gray-700 dark:text-slate-200">
              Don't miss out on these amazing deals
            </p>
          </div>

          {loadingOffers ? (
            <div className="text-center py-12">
              <p className="text-muted dark:text-slate-300">Loading offers...</p>
            </div>
          ) : specialOffers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted dark:text-slate-300">No special offers available at the moment.</p>
            </div>
          ) : (
            <Swiper
              modules={[SwiperNavigation, Pagination, Autoplay]}
              navigation={true}
              pagination={{ clickable: true }}
              autoplay={{ delay: 5500, disableOnInteraction: false }}
              spaceBetween={30}
              slidesPerView={1}
              loop={specialOffers.length > 3}
              speed={700}
              grabCursor={true}
              breakpoints={{
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              className="pb-12"
            >
              {specialOffers.map((offer) => {
                const discountPercent = offer.salePrice && offer.price
                  ? Math.round(((offer.price - offer.salePrice) / offer.price) * 100)
                  : 0;
                return (
                  <SwiperSlide key={offer._id}>
                    <Card 
                      className="relative border-0 shadow-custom-2 h-full rounded-2xl overflow-hidden group cursor-pointer"
                      onClick={() => handleGetProductDetails(offer._id)}
                    >
                      <img
                        src={offer.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920&auto=format&fit=crop"}
                        alt={offer.title}
                        className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

                      <CardContent className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                        <Badge className="bg-white/20 text-white mb-3 w-fit">
                          {discountPercent}% OFF
                        </Badge>
                        <h3 className="text-2xl font-bold mb-2">{offer.title}</h3>
                        <p className="text-white/90 mb-4 line-clamp-2">{offer.description}</p>
                        <div className="flex items-center justify-between">
                          <Button 
                            className="bg-white text-primary-600 font-semibold hover:bg-white/90"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGetProductDetails(offer._id);
                            }}
                          >
                            View Product
                          </Button>
                          <div className="text-sm text-white/70">
                            ${offer.salePrice || offer.price}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          )}
        </div>
      </section>

      <section className="py-12 bg-[#EAF2FB] dark:bg-slate-900" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-text-900 dark:text-slate-100 mb-4">
              Featured Local Vendors
            </h2>
            <p className="text-lg text-gray-700 dark:text-slate-200">
              Discover top-rated local businesses near you
            </p>
          </div>

          {loadingVendors ? (
            <div className="text-center py-12">
              <p className="text-muted dark:text-slate-300">Loading vendors...</p>
            </div>
          ) : featuredVendors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted dark:text-slate-300">No featured vendors available at the moment.</p>
            </div>
          ) : (
            <Swiper
              modules={[SwiperNavigation, Pagination, Autoplay]}
              navigation={true}
              pagination={{ clickable: true }}
              autoplay={{ delay: 6000, disableOnInteraction: false }}
              spaceBetween={30}
              slidesPerView={1}
              loop={featuredVendors.length > 3}
              speed={700}
              grabCursor={true}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              className="pb-12"
            >
              {featuredVendors.map((vendor) => (
                <SwiperSlide key={vendor._id}>
                  <Card className="group hover:shadow-custom-2 transition-all duration-300 hover:-translate-y-1 border-0 bg-white dark:bg-slate-900 h-full rounded-2xl overflow-hidden">
                    <div className="relative w-full h-48">
                      <img
                        src={vendor.backgroundImage || vendor.profilePic || "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1920&auto=format&fit=crop"}
                        alt={vendor.storeName}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                      {vendor.status === "approved" && (
                        <Badge className="absolute top-4 right-4 bg-success-500 text-white flex items-center gap-1 shadow-md">
                          <Shield className="w-3 h-3" />
                          Verified
                        </Badge>
                      )}
                    </div>

                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                            {vendor.storeName}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {vendor.storeCategory}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4 flex-grow">
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                          {vendor.description}
                        </p>
                      </div>
                      <div className="flex gap-2 mt-auto">
                        <Button
                          className="flex-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:opacity-90"
                          onClick={() => handleViewStore(vendor._id)}
                        >
                          View Store
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleCustomOrder(vendor._id)}
                          className="border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-400 dark:hover:text-black"
                        >
                          <Sparkles className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>

      <section className="py-12 bg-[#EAF2FB] dark:bg-slate-900" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-text-900 dark:text-slate-100 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-700 dark:text-slate-200">
              Curated items from our artisan community
            </p>
          </div>

          {loadingFeatured ? (
            <div className="text-center py-12">
              <p className="text-muted dark:text-slate-300">Loading featured products...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted dark:text-slate-300">No featured products available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, idx) => {
                const displayPrice = product.salePrice > 0 ? product.salePrice : product.price;
                const originalPrice = product.salePrice > 0 ? product.price : null;
                const rating = product.averageReview || 0;
                
                return (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <Card className="border-0 shadow-md hover:shadow-lg transition-all bg-white dark:bg-slate-800 dark:text-white rounded-2xl overflow-hidden">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden">
                          <img
                            src={product.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920&auto=format&fit=crop"}
                            alt={product.title}
                            className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                            onClick={() => handleGetProductDetails(product._id)}
                          />
                          <div className="absolute top-2 right-2">
                            <WishlistButton productId={product._id} />
                          </div>
                        </div>

                        <div className="p-6 flex flex-col items-center text-center space-y-3">
                          <h3 className="text-lg font-semibold">{product.title}</h3>
                          <div className="flex items-center gap-2">
                            <p className="text-primary-600 dark:text-primary-400 font-bold">
                              ${displayPrice}
                            </p>
                            {originalPrice && (
                              <p className="text-gray-400 line-through text-sm">
                                ${originalPrice}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-1 text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.round(rating)
                                    ? "fill-yellow-500"
                                    : "opacity-30"
                                }`}
                              />
                            ))}
                            <span className="text-sm text-gray-500 dark:text-gray-300 ml-1">
                              {rating.toFixed(1)}
                            </span>
                          </div>

                          <Button
                            className="w-full mt-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:opacity-90 transition-all duration-300"
                            onClick={() => handleGetProductDetails(product._id)}
                          >
                            Buy Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-[#EAF2FB] dark:bg-slate-900" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-text-900 dark:text-slate-100 mb-4">
              Marketplace Highlights
            </h2>
            <p className="text-lg text-gray-700 dark:text-slate-200">
              Simple steps to connect with local artisans
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {["Browse & Discover", "Connect & Order", "Enjoy & Support"].map(
              (title, idx) => (
                <div
                  key={title}
                  className="text-center bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md"
                  data-aos="zoom-in"
                  data-aos-delay={idx * 80}
                >
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                    {idx + 1}
                  </div>
                  <h3 className="font-bold text-xl text-text-900 dark:text-slate-100 mb-3">
                    {title}
                  </h3>
                  <p className="text-gray-700 dark:text-slate-200">
                    {idx === 0 &&
                      "Explore local vendors in your area and find unique services."}
                    {idx === 1 &&
                      "Browse products, request custom orders, or book services directly."}
                    {idx === 2 &&
                      "Receive your personalized products and support local entrepreneurs."}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="py-12 bg-bg-200 dark:bg-slate-800/60" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-text-900 dark:text-slate-100 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-gray-700 dark:text-slate-200">
              Empowering local businesses and connecting communities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {platformFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className="text-center bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md"
                data-aos="fade-up"
                data-aos-delay={index * 60}
              >
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg text-text-900 dark:text-slate-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-700 dark:text-slate-200">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#EAF2FB] dark:bg-slate-900" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-text-900 dark:text-slate-100 mb-4">
              Popular Marketplace Picks
            </h2>
            <p className="text-lg text-gray-700 dark:text-slate-200">
              Browse fresh listings from verified sellers
            </p>
          </div>

          {loadingPopular ? (
            <div className="text-center py-12">
              <p className="text-muted dark:text-slate-300">Loading products...</p>
            </div>
          ) : popularProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted dark:text-slate-300">No products available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {popularProducts.map((product, idx) => {
                const displayPrice = product.salePrice > 0 ? product.salePrice : product.price;
                const originalPrice = product.salePrice > 0 ? product.price : null;
                const rating = product.averageReview || 0;
                
                return (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <Card className="border-0 shadow-md hover:shadow-lg transition-all bg-white dark:bg-slate-800 dark:text-white rounded-2xl overflow-hidden">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden">
                          <img
                            src={product.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920&auto=format&fit=crop"}
                            alt={product.title}
                            className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                            onClick={() => handleGetProductDetails(product._id)}
                          />
                          <div className="absolute top-2 right-2">
                            <WishlistButton productId={product._id} />
                          </div>
                        </div>

                        <div className="p-6 flex flex-col items-center text-center space-y-3">
                          <h3 className="text-lg font-semibold">{product.title}</h3>
                          <div className="flex items-center gap-2">
                            <p className="text-primary-600 dark:text-primary-400 font-bold">
                              ${displayPrice}
                            </p>
                            {originalPrice && (
                              <p className="text-gray-400 line-through text-sm">
                                ${originalPrice}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-1 text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.round(rating)
                                    ? "fill-yellow-500"
                                    : "opacity-30"
                                }`}
                              />
                            ))}
                            <span className="text-sm text-gray-500 dark:text-gray-300 ml-1">
                              {rating.toFixed(1)}
                            </span>
                          </div>

                          <Button
                            className="w-full mt-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:opacity-90 transition-all duration-300"
                            onClick={() => handleGetProductDetails(product._id)}
                          >
                            Buy Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-[#EAF2FB] dark:bg-slate-900" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-text-900 dark:text-slate-100 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-700 dark:text-slate-200">
              Real stories from our community
            </p>
          </div>

          {loadingTestimonials ? (
            <div className="text-center py-12">
              <p className="text-muted dark:text-slate-300">
                Loading community stories...
              </p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted dark:text-slate-300">
                No testimonials available yet.
              </p>
            </div>
          ) : (
          <Swiper
            modules={[SwiperNavigation, Pagination, Autoplay]}
            navigation={true}
            pagination={{ clickable: true }}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            spaceBetween={30}
            slidesPerView={1}
              loop={testimonials.length > 3}
            speed={700}
            grabCursor={true}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="pb-12"
          >
              {testimonials.map((testimonial) => {
                const rating = testimonial.reviewValue || 0;
                return (
                  <SwiperSlide key={testimonial._id}>
                <Card className="border-0 bg-card-bg dark:bg-slate-800 shadow-custom-1 h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mr-4 text-white font-bold text-lg">
                            {(testimonial.userName || "U").charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-text-900 dark:text-slate-100">
                              {testimonial.userName || "Marketplace Shopper"}
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-slate-200">
                              {testimonial.productTitle || "Community Purchase"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center mb-3">
                          {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                              className={`w-4 h-4 ${
                                i < Math.round(rating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-yellow-400/30"
                              }`}
                        />
                      ))}
                    </div>

                    <p className="text-gray-700 dark:text-slate-200 mb-4 italic flex-grow">
                          "{testimonial.reviewMessage}"
                    </p>

                    <div className="text-sm text-primary-500 font-medium mt-auto dark:text-primary-300">
                          - {testimonial.vendorName || testimonial.productTitle}
                    </div>
                  </CardContent>
                </Card>
              </SwiperSlide>
                );
              })}
          </Swiper>
          )}
        </div>
      </section>

      <section className="py-12 bg-bg-200 dark:bg-slate-800/60" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-text-900 dark:text-slate-100 mb-4">
              Latest from Our Blog
            </h2>
            <p className="text-lg text-gray-700 dark:text-slate-200">
              Tips, stories, and insights from our community
            </p>
          </div>

          <Swiper
            modules={[SwiperNavigation, Pagination, Autoplay]}
            navigation={true}
            pagination={{ clickable: true }}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            speed={700}
            grabCursor={true}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="pb-12"
          >
            {loadingBlog ? (
              <div className="text-center py-12">
                <p className="text-muted dark:text-slate-300">Loading blog posts...</p>
              </div>
            ) : blogPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted dark:text-slate-300">No blog posts available at the moment.</p>
              </div>
            ) : (
              blogPosts.map((post) => (
                <SwiperSlide key={post._id}>
                  <Link to={`/shop/article/${post._id}`}>
                    <Card className="group hover:shadow-custom-2 transition-all duration-300 hover:-translate-y-1 border-0 bg-white dark:bg-slate-900 overflow-hidden h-full rounded-2xl cursor-pointer">
                      <div className="relative w-full h-48 overflow-hidden">
                        <img
                          src={post.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1470&auto=format&fit=crop"}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>

                        <Badge className="absolute top-4 left-4 bg-primary-500 text-white shadow-md">
                          {post.category || "General"}
                        </Badge>
                      </div>

                      <CardContent className="p-6 flex flex-col h-full">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-3">
                          {post.excerpt || post.content?.substring(0, 150) + "..."}
                        </p>

                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-auto">
                          <div className="flex items-center gap-2">
                            <span>{post.author || "Admin"}</span>
                            <span>•</span>
                            <span>{post.views || 0} views</span>
                          </div>
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </SwiperSlide>
              ))
            )}
          </Swiper>

          <div className="text-center mt-12">
            <Button 
              className="bg-gradient-primary hover:opacity-90 text-white px-8 py-3 rounded-xl"
              onClick={() => navigate("/shop/blog")}
            >
              View All Posts
            </Button>
          </div>
        </div>
      </section>


      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
