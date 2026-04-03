import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SharedPagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) {
  if (!totalPages || totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const goToPage = (page) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={`flex flex-wrap items-center justify-center gap-2 py-4 ${className}`.trim()}>
      <button
        type="button"
        onClick={() => goToPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex min-w-10 cursor-pointer items-center justify-center rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:border-secondary hover:text-secondary disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => goToPage(page)}
          className={`min-w-10 cursor-pointer rounded-xl border px-3 py-2 text-sm font-semibold transition ${
            currentPage === page
              ? "border-secondary bg-secondary text-secondary-foreground shadow-lg shadow-secondary/20"
              : "border-border bg-card text-foreground hover:border-secondary hover:text-secondary"
          }`}
          aria-label={`Go to page ${page}`}
          aria-current={currentPage === page ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex min-w-10 cursor-pointer items-center justify-center rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:border-secondary hover:text-secondary disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
