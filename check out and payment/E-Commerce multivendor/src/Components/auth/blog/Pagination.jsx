import React from 'react';

const Pagination = () => {
  const pages = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="pagination-spec">
      {/* Previous Arrow */}
      <button className="pagination-btn-spec">
        <i className="fa-solid fa-arrow-left"></i>
      </button>

      {/* Page Numbers - 40x40px, 12px gap */}
      {pages.map((page) => (
        <button
          key={page}
          className={`pagination-btn-spec ${
            page === 1 ? 'pagination-btn-active-spec' : ''
          }`}
        >
          {page.toString().padStart(2, '0')}
        </button>
      ))}

      {/* Next Arrow */}
      <button className="pagination-btn-spec">
        <i className="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  );
};

export default Pagination;