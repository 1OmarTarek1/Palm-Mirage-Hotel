import { useCallback, useEffect, useMemo, useState } from "react";

export function usePagination(items = [], pageSize = 6) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(items.length / pageSize)),
    [items.length, pageSize]
  );

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [items, currentPage, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems,
    resetPage,
  };
}
