import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient, { API_ENDPOINTS } from '@/config/api';

const Sidebar = ({ searchInput, setSearchInput, onSearch, selectedCategory, setSelectedCategory }) => {
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [popularTags, setPopularTags] = useState([]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setLoading(true);
        // Fetch only the 4 most recent published articles
        const response = await apiClient.get(
          `${API_ENDPOINTS.SHOP.BLOG.GET}?limit=4&published=true`
        );
        
        if (response.data.success) {
          setRecentPosts(response.data.articles || []);
        }
      } catch (err) {
        console.error("Error fetching recent posts:", err);
        // Keep empty array on error
        setRecentPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  // Fetch all posts to extract unique categories and tags
  useEffect(() => {
    const fetchCategoriesAndTags = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.SHOP.BLOG.GET, {
          params: {
            limit: 1000, // High limit to get all posts
            published: true
          }
        });
        
        if (response.data.success) {
          const articles = response.data.articles || [];
          
          // Extract unique categories from articles
          const uniqueCategories = [...new Set(
            articles
              .map(article => article.category)
              .filter(category => category && category.trim() !== '')
          )];
          
          // Create categories with counts
          const categoriesWithCounts = uniqueCategories.map(category => {
            const count = articles.filter(article => article.category === category).length;
            return { name: category, count };
          }).sort((a, b) => b.count - a.count); // Sort by count descending
          
          setCategories(categoriesWithCounts);

          // Extract and count tags from articles
          const tagCounts = {};
          articles.forEach(article => {
            if (article.tags && Array.isArray(article.tags)) {
              article.tags.forEach(tag => {
                const normalizedTag = tag.trim();
                if (normalizedTag) {
                  tagCounts[normalizedTag] = (tagCounts[normalizedTag] || 0) + 1;
                }
              });
            }
          });

          // Convert to array and sort by count (most popular first)
          const tagsArray = Object.entries(tagCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10); // Get top 10 most popular tags

          setPopularTags(tagsArray);
        }
      } catch (err) {
        console.error("Error fetching categories and tags:", err);
        setCategories([]);
        setPopularTags([]);
      }
    };

    fetchCategoriesAndTags();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };



  return (
    <aside className="blog-sidebar">
      <div>
        <form 
          className="search-container"
          onSubmit={(e) => {
            e.preventDefault();
            onSearch();
          }}
        >
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onSearch();
              }
            }}
            placeholder="Search articles..."
            className="search-input"
          />
          <button 
            type="submit" 
            className="search-button"
            onClick={(e) => {
              e.preventDefault();
              onSearch();
            }}
          >
            <i className="fa-solid fa-search"></i>
          </button>
        </form>
      </div>

      <div className="sidebar-widget recent-posts-widget">
        <h3 className="widget-title">Recent Posts</h3>
        <div className="recent-posts-list">
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-2"></div>
              <p className="text-sm text-white/60">Loading...</p>
            </div>
          ) : recentPosts.length === 0 ? (
            <p className="text-sm text-white/60 text-center py-4">No recent posts</p>
          ) : (
            recentPosts.map((post) => (
              <Link 
                key={post._id} 
                to={`/shop/article/${post._id}`}
                className="recent-post-item"
              >
                <div className="post-thumbnail">
                  <img 
                    src={post.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=160&h=120&fit=crop"} 
                    alt={post.title}
                    loading="lazy"
                  />
                  <div className="thumbnail-overlay"></div>
                </div>
                <div className="post-content">
                  <h4 className="post-title">{post.title}</h4>
                  <div className="post-meta">
                    <i className="fa-regular fa-calendar"></i>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      <div className="sidebar-widget categories-widget">
        <h3 className="widget-title">Categories</h3>
        <div className="categories-list">
          {/* All category option */}
          <a 
            href="#"
            className={`category-pill ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setSelectedCategory('All');
            }}
          >
            <span className="category-name">All</span>
            <i className="fa-solid fa-angle-right"></i>
          </a>
          {/* Dynamic categories from blogs */}
          {categories.slice(0, 4).map((category, index) => (
            <a 
              key={index} 
              href="#"
              className={`category-pill ${selectedCategory === category.name ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setSelectedCategory(category.name);
              }}
            >
              <span className="category-name">{category.name}</span>
              <i className="fa-solid fa-angle-right"></i>
            </a>
          ))}
        </div>
      </div>

      <div className="sidebar-widget categories-count-widget">
        <h3 className="widget-title">Popular Categories</h3>
        <div className="categories-count-list">
          {/* All category with total count */}
          <div 
            className={`category-row ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('All')}
            style={{ cursor: 'pointer' }}
          >
            <span className="category-label">All</span>
            <span className="category-count">{categories.reduce((sum, cat) => sum + cat.count, 0)}</span>
          </div>
          {/* Dynamic categories with counts */}
          {categories.map((category, index) => (
            <div 
              key={index} 
              className={`category-row ${selectedCategory === category.name ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.name)}
              style={{ cursor: 'pointer' }}
            >
              <span className="category-label">{category.name}</span>
              <span className="category-count">{category.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-widget tags-widget">
        <h3 className="widget-title">Popular Tags</h3>
        <div className="tags-container">
          {popularTags.length > 0 ? (
            popularTags.map((tag, index) => (
              <a 
                key={index} 
                href="#" 
                className="tag-pill"
                onClick={(e) => {
                  e.preventDefault();
                  // You can add tag filtering functionality here if needed
                }}
              >
                {tag.name}
              </a>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-2">No tags available</p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

