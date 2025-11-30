import React from 'react';

const Pagination = ({ totalPosts = 0, currentPage = 1, onPageChange, postsPerPage = 6 }) => {
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  // Don't show pagination if there are no posts or only one page
  if (totalPages <= 1) {
    return null;
  }

  // Calculate which page numbers to show (max 7 pages visible)
  const getVisiblePages = () => {
    const maxVisible = 7;
    const pages = [];

    if (totalPages <= maxVisible) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      let startPage = Math.max(1, currentPage - 3);
      let endPage = Math.min(totalPages, startPage + maxVisible - 1);

      // Adjust if we're near the end
      if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="pagination-spec">
      <button 
        className="pagination-btn-spec"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
      >
        <i className="fa-solid fa-arrow-left"></i>
      </button>

      {visiblePages.map((page) => (
        <button
          key={page}
          className={`pagination-btn-spec ${
            page === currentPage ? 'pagination-btn-active-spec' : ''
          }`}
          onClick={() => handlePageClick(page)}
        >
          {page.toString().padStart(2, '0')}
        </button>
      ))}

      <button 
        className="pagination-btn-spec"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
      >
        <i className="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  );
};

export default Pagination;

