import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import apiClient, { API_ENDPOINTS } from "@/config/api";
import { Button } from "@/components/ui/button";
import '@/styles/blog.css';

const ArticleViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(
          API_ENDPOINTS.SHOP.BLOG.GET_BY_ID(id)
        );

        if (response.data.success) {
          setArticle(response.data.article);
        } else {
          setError("Article not found");
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        setError(err.response?.data?.message || "Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EAF2FB] dark:bg-slate-900 text-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3785D8] mx-auto mb-4"></div>
          <p className="text-gray-900 dark:text-white">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-[#EAF2FB] dark:bg-slate-900 text-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Article Not Found</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">{error || "The article you're looking for doesn't exist."}</p>
          <Button
            onClick={() => navigate("/shop/blog")}
            className="bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] hover:from-[#2a6bb8] hover:to-[#a875c9] text-white"
          >
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#EAF2FB] dark:bg-slate-900 text-gray-900 dark:text-white py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Article Content */}
        <article className="blog-card-spec">
          {/* Featured Image with Category Tag */}
          {article.image && (
            <div className="relative">
              <img
                src={article.image}
                alt={article.title}
                className="blog-image-spec"
              />
              <div className="category-tag-spec">
                {article.category || "General"}
              </div>
            </div>
          )}

          {/* Category (if no image) */}
          {!article.image && (
            <div className="mb-4 px-8 pt-8">
              <span className="category-tag-spec" style={{ position: 'static' }}>
                {article.category || "General"}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="blog-title-spec text-3xl md:text-4xl mb-6">{article.title}</h1>

          {/* Meta Information */}
          <div className="blog-meta-spec mb-6 px-8">
            <span>
              <i className="fa-regular fa-calendar"></i>
              {formatDate(article.createdAt)}
            </span>
            <span>
              <i className="fa-regular fa-user"></i>
              {article.author}
            </span>
            <span>
              <i className="fa-regular fa-eye"></i>
              {article.views} views
            </span>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2 px-8">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="tag-pill"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div
            className="blog-excerpt-spec px-8 pb-8"
            style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            {article.content.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Divider */}
          <div className="my-8 border-t border-slate-200 dark:border-slate-700 mx-8"></div>

          {/* Footer Actions */}
          <div className="flex justify-between items-center px-8 pb-8">
            <Button
              onClick={() => navigate("/shop/blog")}
              variant="outline"
              className="border-[#3785D8] text-[#3785D8] hover:bg-[#3785D8] hover:text-white dark:border-[#BF8CE1] dark:text-[#BF8CE1] dark:hover:bg-[#BF8CE1] dark:hover:text-white"
            >
              ← Back to Blog
            </Button>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              Last updated: {formatDate(article.updatedAt)}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ArticleViewPage;

