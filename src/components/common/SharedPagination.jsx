import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SharedPagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalEntries,
  className = "",
}) {
  if (!totalPages || totalPages <= 1) return null;

  const goToPage = (page) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Unified pagination logic from Dashboard
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    range.push(1);
    if (left > 2) range.push("...");
    for (let i = left; i <= right; i++) range.push(i);
    if (right < totalPages - 1) range.push("...");
    if (totalPages > 1) range.push(totalPages);

    return range;
  };

  const startIndex = totalEntries ? (currentPage - 1) * pageSize + 1 : 0;
  const endIndex = totalEntries ? Math.min(currentPage * pageSize, totalEntries) : 0;

  return (
    <div className={`flex flex-col gap-4 rounded-b-[28px] border-t border-border px-2 pt-6 sm:flex-row sm:items-center sm:justify-between ${className}`.trim()}>
      {totalEntries && (
        <p className="text-center font-main text-sm text-muted-foreground sm:text-left">
          Showing{" "}
          <span className="font-medium text-foreground">
            {startIndex}-{endIndex}
          </span>{" "}
          of <span className="font-medium text-foreground">{totalEntries}</span>{" "}
          entries
        </p>
      )}

      <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
        <button
          onClick={() => goToPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-xl border border-border bg-card px-3 text-muted-foreground shadow-sm transition-colors hover:border-primary/40 hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {getPageNumbers().map((page, i) =>
          page === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="flex h-10 min-w-10 items-center justify-center px-2 font-main text-sm text-muted-foreground"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-xl border px-3 font-main text-sm font-semibold shadow-sm transition-colors ${
                currentPage === page
                  ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-muted hover:text-foreground"
              }`}
              aria-label={`Go to page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-xl border border-border bg-card px-3 text-muted-foreground shadow-sm transition-colors hover:border-primary/40 hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
