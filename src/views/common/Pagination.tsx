import React, { useState } from "react";

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number, pageSize: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(itemsPerPage);

  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      onPageChange(page, pageSize);
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
    onPageChange(1, newSize);
  };

  // Function to render page numbers with ellipsis
  const renderPageNumbers = () => {
    const pages = [];

    // Show all pages when less than 7
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <li
            key={i}
            className={`dt-paging-button page-item ${
              currentPage === i ? "active" : ""
            }`}
          >
            <button className="page-link" onClick={() => handlePageChange(i)}>
              {i}
            </button>
          </li>
        );
      }
    } else {
      // More than 6 pages: add dots
      pages.push(
        <li
          key="1"
          className={`dt-paging-button page-item ${
            currentPage === 1 ? "active" : ""
          }`}
        >
          <button className="page-link" onClick={() => handlePageChange(1)}>
            1
          </button>
        </li>
      );

      if (currentPage > 4) {
        pages.push(
          <li key="start-dots" className="dt-paging-button page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <li
            key={i}
            className={`dt-paging-button page-item ${
              currentPage === i ? "active" : ""
            }`}
          >
            <button className="page-link" onClick={() => handlePageChange(i)}>
              {i}
            </button>
          </li>
        );
      }

      if (currentPage < totalPages - 3) {
        pages.push(
          <li key="end-dots" className="dt-paging-button page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }

      pages.push(
        <li
          key={totalPages}
          className={`dt-paging-button page-item ${
            currentPage === totalPages ? "active" : ""
          }`}
        >
          <button
            className="page-link"
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </button>
        </li>
      );
    }

    return pages;
  };

  return (
    <div className="row">
      {/* Page Size Selector */}
      <div className="col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start dt-toolbar">
        <div>
          <select
            name="kt_ecommerce_products_table_length"
            aria-controls="kt_ecommerce_products_table"
            className="form-select form-select-solid form-select-sm"
            id="dt-length-0"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pagination Navigation */}
      <div className="col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end">
        <div className="dt-paging paging_simple_numbers">
          <nav aria-label="pagination">
            <ul className="pagination">
              {/* Previous Button */}
              <li
                className={`dt-paging-button page-item ${
                  currentPage === 1 ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link previous"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous"
                >
                  <i className="previous"></i>
                </button>
              </li>

              {/* Page Numbers with Ellipsis */}
              {renderPageNumbers()}

              {/* Next Button */}
              <li
                className={`dt-paging-button page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link next"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next"
                >
                  <i className="next"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
