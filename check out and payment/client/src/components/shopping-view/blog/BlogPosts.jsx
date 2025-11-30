import React from 'react';

const BlogPosts = () => {
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
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1470&auto=format&fit=crop",
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
      <div className="mb-8">
        <h1 className="page-title-spec mb-4">Blog</h1>
        <div className="w-24 h-1 bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] rounded-full"></div>
      </div>

      <div className="space-y-10">
        {blogPosts.map((post) => (
          <article key={post.id} className="blog-card-spec relative">
            <div className="relative">
              <img 
                src={post.image} 
                alt={post.title}
                className="blog-image-spec"
              />
              <div className="category-tag-spec">
                {post.category}
              </div>
            </div>

            <div>
              <h2 className="blog-title-spec">
                {post.title}
              </h2>

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

