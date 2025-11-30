import React, { useState } from 'react';
import { LanguageProvider } from "../context/LanguageContext";
import { useLanguage } from "../context/LanguageContext";
import "../styles/blog.css";


import BlogPosts from '../Components/auth/blog/BlogPosts';
import Sidebar from '../Components/auth/blog/Sidebar';
import Pagination from '../Components/auth/blog/Pagination';
import Features from '../Components/auth/blog/Features';
import Footer from '../Components/auth/common/Footer';

const BlogPage = () => {
  const { language } = useLanguage();
  const [search, setSearch] = useState('');

  return (
    <div className={`min-h-screen bg-gradient-to-br from-dark-purple to-dark-blue text-light-blue ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <main className="blog-container-spec">
        <BlogPosts />
        <Sidebar search={search} setSearch={setSearch} />
      </main>

      <Pagination />
      <Features />
      <Footer />
    </div>
  );
};

export default BlogPage;
