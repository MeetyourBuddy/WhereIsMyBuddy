import React from "react";
import Pagination from "@/components/ui/pagination";

interface TablePaginationControlsProps {
  totalItems: number;
  currentPage: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  className?: string;
}

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

const TablePaginationControls: React.FC<TablePaginationControlsProps> = ({
  totalItems,
  currentPage,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  className = "",
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  return (
    <div
      className={`flex flex-col gap-3 border-t border-buddy-gray-200/60 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4 md:px-6 ${className}`}
    >
      <div className="flex items-center gap-2 text-xs text-buddy-gray-600 sm:text-sm">
        <span>Rows per page</span>
        <select
          aria-label="Rows per page"
          value={rowsPerPage}
          onChange={(event) => onRowsPerPageChange(Number(event.target.value))}
          className="h-8 rounded-md border border-buddy-gray-200 bg-white px-2 text-xs text-buddy-gray-700 outline-none transition-colors hover:border-buddy-purple/40 focus:border-buddy-purple/60 sm:text-sm"
        >
          {ROWS_PER_PAGE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        showInfo
        totalItems={totalItems}
        itemsPerPage={rowsPerPage}
      />
    </div>
  );
};

export default TablePaginationControls;
