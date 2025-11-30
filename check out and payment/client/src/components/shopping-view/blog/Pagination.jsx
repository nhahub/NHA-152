import React from 'react';

const Pagination = () => {
  const pages = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="pagination-spec">
      <button className="pagination-btn-spec">
        <i className="fa-solid fa-arrow-left"></i>
      </button>

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

      <button className="pagination-btn-spec">
        <i className="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  );
};

export default Pagination;

