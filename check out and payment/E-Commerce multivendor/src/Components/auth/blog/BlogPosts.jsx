import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';

const BlogPosts = () => {
  useLanguage();

  const blogPosts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?q=80&w=1470&auto=format&fit=crop",
      category: "Gadget",
      title: "Legal structure, can make profit business",
      excerpt: "Re-engagement — objectives. As developers, we rightfully obsess about the customer experience...",
      date: "July 12, 2025",
      comments: "0 Comments"
    },
    {
      id: 2,
      image:  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1470&auto=format&fit=crop",
      category: "Gadget",
      title: "Legal structure, can make profit business",
      excerpt: "Re-engagement — objectives. As developers, we rightfully obsess about the customer experience...",
      date: "July 12, 2025",
      comments: "0 Comments"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1470&auto=format&fit=crop",
      category: "Gadget",
      title: "Legal structure, can make profit business",
      excerpt: "Re-engagement — objectives. As developers, we rightfully obsess about the customer experience...",
      date: "July 12, 2025",
      comments: "0 Comments"
    }
  ];

  return (
    <div className="main-column-spec">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="page-title-spec mb-4">Blog</h1>
        <div className="w-24 h-1 bg-gradient-to-r from-bright-blue to-light-purple rounded-full"></div>
      </div>

      {/* Blog Posts */}
      <div className="space-y-10">
        {blogPosts.map((post) => (
          <article key={post.id} className="blog-card-spec relative">
            {/* Post Image - 380px height */}
            <div className="relative">
              <img 
                src={post.image} 
                alt={post.title}
                className="blog-image-spec"
              />
              {/* Category Tag - absolute positioned */}
              <div className="category-tag-spec">
                {post.category}
              </div>
            </div>

            {/* Post Content */}
            <div>
              {/* Post Title - Poppins Bold 22px */}
              <h2 className="blog-title-spec">
                {post.title}
              </h2>

              {/* Meta Info - 13px, gap 20px */}
              <div className="blog-meta-spec">
                <span>
                  <i className="fa-regular fa-calendar"></i>
                  {post.date}
                </span>
                <span>
                  <i className="fa-regular fa-comments"></i>
                  {post.comments}
                </span>
              </div>

              {/* Post Excerpt - Inter Regular 15px */}
              <p className="blog-excerpt-spec">
                {post.excerpt}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BlogPosts;