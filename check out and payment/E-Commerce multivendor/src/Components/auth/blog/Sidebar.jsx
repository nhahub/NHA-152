// SideBar.jsx
import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';


const SideBar = ({ search, setSearch }) => {
  useLanguage();
  const [activeCategory, setActiveCategory] = useState('Gaming');

  // Recent posts data
  const recentPosts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=160&h=120&fit=crop",
      title: "Once determined you need to come up with a name",
      date: "July 12, 2025"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=160&h=120&fit=crop",
      title: "Legal structure can make profit business",
      date: "July 10, 2025"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=160&h=120&fit=crop",
      title: "Re-engagement objectives for developers",
      date: "July 8, 2025"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=160&h=120&fit=crop",
      title: "Customer experience optimization strategies",
      date: "July 5, 2025"
    }
  ];

  // Categories data
  const categories = [
    { name: "Gaming", count: 12 },
    { name: "Smart Gadget", count: 5 },
    { name: "Software", count: 29 },
    { name: "Electronics", count: 24 },
    { name: "Laptop", count: 8 },
    { name: "Mobile & Accessories", count: 16 },
    { name: "Appliance", count: 24 }
  ];

  // Popular tags
  const popularTags = [
    "Technology", "Gaming", "Reviews", "Tutorials", "News",
    "Hardware", "Software", "Mobile", "PC", "Accessories"
  ];

  return (
    <aside className="blog-sidebar">
      {/* Widget 1: Search Box */}
      <div>
        <div className="search-container">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Searching..."
            className="search-input"
          />
          <button className="search-button">
            <i className="fa-solid fa-search"></i>
          </button>
        </div>
      </div>

      {/* Widget 2: Recent Posts */}
      <div className="sidebar-widget recent-posts-widget">
        <h3 className="widget-title">Recent Posts</h3>
        <div className="recent-posts-list">
          {recentPosts.map((post) => (
            <a key={post.id} href="#" className="recent-post-item">
              <div className="post-thumbnail">
                <img 
                  src={post.image} 
                  alt={post.title}
                  loading="lazy"
                />
                <div className="thumbnail-overlay"></div>
              </div>
              <div className="post-content">
                <h4 className="post-title">{post.title}</h4>
                <div className="post-meta">
                  <i className="fa-regular fa-calendar"></i>
                  <span>{post.date}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Widget 3: Categories List */}
      <div className="sidebar-widget categories-widget">
        <h3 className="widget-title">Categories</h3>
        <div className="categories-list">
          {categories.slice(0, 5).map((category, index) => (
            <a 
              key={index} 
              href="#"
              className={`category-pill ${activeCategory === category.name ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveCategory(category.name);
              }}
            >
              <span className="category-name">{category.name}</span>
              <i className="fa-solid fa-angle-right"></i>
            </a>
          ))}
        </div>
      </div>

      {/* Widget 4: Categories with Counts */}
      <div className="sidebar-widget categories-count-widget">
        <h3 className="widget-title">Popular Categories</h3>
        <div className="categories-count-list">
          {categories.map((category, index) => (
            <div key={index} className="category-row">
              <span className="category-label">{category.name}</span>
              <span className="category-count">{category.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Widget 5: CTA Banner */}
      <div className="sidebar-widget cta-widget">
        <div className="cta-banner">
          <h4 className="cta-title">Premium Content</h4>
          <p className="cta-text">Access exclusive articles and tutorials</p>
          <button className="cta-button">
            Subscribe Now
          </button>
        </div>
      </div>

      {/* Widget 6: Popular Tags */}
      <div className="sidebar-widget tags-widget">
        <h3 className="widget-title">Popular Tags</h3>
        <div className="tags-container">
          {popularTags.map((tag, index) => (
            <a key={index} href="#" className="tag-pill">
              {tag}
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default SideBar;