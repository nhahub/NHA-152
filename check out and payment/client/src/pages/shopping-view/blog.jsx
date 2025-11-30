import React, { useState } from 'react';
import BlogPosts from '@/components/shopping-view/blog/BlogPosts';
import Sidebar from '@/components/shopping-view/blog/Sidebar';
import Pagination from '@/components/shopping-view/blog/Pagination';
import Features from '@/components/shopping-view/blog/Features';
import '@/styles/blog.css';

const BlogPage = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E0F75] to-[#1C1DAB] text-[#ADC6E5]">
      <main className="blog-container-spec py-10">
        <BlogPosts />
        <Sidebar search={search} setSearch={setSearch} />
      </main>

      <Pagination />
      <Features />
    </div>
  );
};

export default BlogPage;

