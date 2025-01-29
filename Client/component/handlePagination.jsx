import './moduledCSS/pagination.css'

const Pagination = ({ offset, totalPages, handlePagination }) => {
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (offset > 3) pages.push("...");
      for (let i = Math.max(2, offset - 1); i <= Math.min(totalPages - 1, offset + 1); i++) {
        pages.push(i);
      }
      if (offset < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="paginationcotainer">
    <div className="pagination">
      <button
        onClick={() => handlePagination(offset - 1)}
        disabled={offset === 1}
        className={`pagination-btn ${offset === 1 ? "disabled" : ""}`}
      >
        &lt;
      </button>

      {getPageNumbers().map((page, index) =>
        typeof page === "number" ? (
          <button
            key={index}
            onClick={() => handlePagination(page)}
            className={`pagination-btn ${offset === page ? "active" : ""}`}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="pagination-dots">
            {page}
          </span>
        )
      )}

      <button
        onClick={() => handlePagination(offset + 1)}
        disabled={offset === totalPages}
        className={`pagination-btn ${offset === totalPages ? "disabled" : ""}`}
      >
        &gt;
      </button>
    </div>
    </div>
  );
};

export default Pagination;