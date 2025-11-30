import React, { useState } from 'react';
import BlogPosts from '@/components/shopping-view/blog/BlogPosts';
import Sidebar from '@/components/shopping-view/blog/Sidebar';
import Pagination from '@/components/shopping-view/blog/Pagination';
import Features from '@/components/shopping-view/blog/Features';
import '@/styles/blog.css';

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState(''); // Actual search query used for filtering
  const [searchInput, setSearchInput] = useState(''); // Input value in the search bar
  const [selectedCategory, setSelectedCategory] = useState('All'); // Selected category filter
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [totalPosts, setTotalPosts] = useState(0); // Total number of filtered posts

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when changing category
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#EAF2FB] dark:bg-slate-900 text-gray-900 dark:text-white">
      <main className="blog-container-spec py-10">
        <BlogPosts 
          search={searchQuery} 
          selectedCategory={selectedCategory}
          currentPage={currentPage}
          onTotalPostsChange={setTotalPosts}
        />
        <Sidebar 
          searchInput={searchInput} 
          setSearchInput={setSearchInput} 
          onSearch={handleSearch}
          selectedCategory={selectedCategory}
          setSelectedCategory={handleCategoryChange}
        />
      </main>

      <Pagination 
        totalPosts={totalPosts}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        postsPerPage={6}
      />
      <Features />
    </div>
  );
};

export default BlogPage;

