import type { FC, JSX } from "react";
import s from "./Pagination.module.scss";
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) return null;

  const renderPagination = () => {
    const pages: JSX.Element[] = [];

    const addPage = (page: number) => {
      pages.push(
        <button
          key={page}
          className={`${s["_pageButton"]} ${currentPage === page ? s["_active"] : ""}`}
          onClick={() => handlePageClick(page)}
        >
          {page}
        </button>,
      );
    };

    const addDots = (key: string) => {
      pages.push(
        <span key={key} className={s["_dots"]}>
          ...
        </span>,
      );
    };

    const total = totalPages;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) addPage(i);
      return pages;
    }

    for (let i = 1; i <= 3; i++) addPage(i);

    if (currentPage > 5) addDots("start-dots");

    const middlePages = [];
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i > 3 && i < total - 2) middlePages.push(i);
    }
    middlePages.forEach(addPage);

    if (currentPage < total - 4) addDots("end-dots");

    for (let i = total - 2; i <= total; i++) addPage(i);

    return pages;
  };

  return (
    <div className={s["_pagination"]}>
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className={s["_navButton-left"]}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M16.6778 2.32544C16.2482 1.89152 15.5518 1.89152 15.1222 2.32544L5.32218 11.2143C4.8926 11.6482 4.8926 12.3518 5.32218 12.7857L15.1222 21.6746C15.5518 22.1085 16.2482 22.1085 16.6778 21.6746C17.1074 21.2406 17.1074 20.5371 16.6778 20.1032L7.65563 12L16.6778 3.89679C17.1074 3.46287 17.1074 2.75935 16.6778 2.32544Z"
            fill="#7C746C"
          />
        </svg>
      </button>

      {renderPagination()}

      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={s["_navButton-right"]}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M16.6778 2.32544C16.2482 1.89152 15.5518 1.89152 15.1222 2.32544L5.32218 11.2143C4.8926 11.6482 4.8926 12.3518 5.32218 12.7857L15.1222 21.6746C15.5518 22.1085 16.2482 22.1085 16.6778 21.6746C17.1074 21.2406 17.1074 20.5371 16.6778 20.1032L7.65563 12L16.6778 3.89679C17.1074 3.46287 17.1074 2.75935 16.6778 2.32544Z"
            fill="#7C746C"
          />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
