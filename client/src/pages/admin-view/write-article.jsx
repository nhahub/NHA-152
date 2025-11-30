import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import apiClient, { API_ENDPOINTS } from "@/config/api";
import { useSelector } from "react-redux";

const WriteArticlePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    image: "",
    category: "General",
    published: false,
    tags: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const tagsArray = formData.tags
        ? formData.tags.split(",").map((tag) => tag.trim())
        : [];

      const articleData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        image: formData.image,
        category: formData.category,
        published: formData.published,
        tags: tagsArray,
        author: user?.userName || user?.username || "Admin",
        authorId: user?.id || null,
      };

      const response = await apiClient.post(
        API_ENDPOINTS.SHOP.BLOG.CREATE,
        articleData
      );

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Article created successfully!",
        });
        // Reset form
        setFormData({
          title: "",
          content: "",
          excerpt: "",
          image: "",
          category: "General",
          published: false,
          tags: "",
        });
        // Navigate to blog page
        navigate("/shop/blog");
      }
    } catch (error) {
      console.error("Error creating article:", error);
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.message || 
        "Failed to create article. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E0F75] to-[#1C1DAB] text-[#ADC6E5] py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 shadow-xl">
          <h1 className="text-3xl font-bold mb-6 text-white">Write New Article</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-white">
                Title *
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-2 bg-white/20 border-white/30 text-white placeholder:text-white/50"
                placeholder="Enter article title"
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category" className="text-white">
                Category
              </Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-2 w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="General">General</option>
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Gadget">Gadget</option>
                <option value="News">News</option>
              </select>
            </div>

            {/* Image URL */}
            <div>
              <Label htmlFor="image" className="text-white">
                Featured Image URL
              </Label>
              <Input
                id="image"
                name="image"
                type="url"
                value={formData.image}
                onChange={handleChange}
                className="mt-2 bg-white/20 border-white/30 text-white placeholder:text-white/50"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Excerpt */}
            <div>
              <Label htmlFor="excerpt" className="text-white">
                Excerpt (optional - will be auto-generated if empty)
              </Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                className="mt-2 bg-white/20 border-white/30 text-white placeholder:text-white/50"
                placeholder="Brief summary of the article"
              />
            </div>

            {/* Content */}
            <div>
              <Label htmlFor="content" className="text-white">
                Content *
              </Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={15}
                className="mt-2 bg-white/20 border-white/30 text-white placeholder:text-white/50"
                placeholder="Write your article content here..."
              />
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags" className="text-white">
                Tags (comma-separated)
              </Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="mt-2 bg-white/20 border-white/30 text-white placeholder:text-white/50"
                placeholder="tag1, tag2, tag3"
              />
            </div>

            {/* Published */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 bg-white/20 border-white/30 rounded focus:ring-blue-500"
              />
              <Label htmlFor="published" className="text-white cursor-pointer">
                Publish immediately
              </Label>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] hover:from-[#2a6bb8] hover:to-[#a875c9] text-white"
              >
                {loading ? "Publishing..." : "Publish Article"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/shop/blog")}
                className="border-white/30 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WriteArticlePage;

