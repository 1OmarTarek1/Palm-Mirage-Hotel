export function normalizePagination(payload, fallbackPage = 1, fallbackLimit = 10) {
  const source = payload?.pagination ?? payload ?? {};
  const parsedLimit = Number(source.limit ?? source.size ?? fallbackLimit);
  const safeLimit = parsedLimit > 0 ? parsedLimit : fallbackLimit;
  const parsedTotal = Number(
    source.total ?? source.totalItems ?? source.count ?? source.total_count ?? 0,
  );
  const parsedPage = Number(source.page ?? fallbackPage);
  const page = parsedPage > 0 ? parsedPage : fallbackPage;
  const totalPages =
    Number(source.totalPages ?? source.pages) ||
    Math.max(1, Math.ceil(parsedTotal / safeLimit));

  return {
    page,
    limit: safeLimit,
    total: parsedTotal,
    totalItems: parsedTotal,
    totalPages,
    hasNextPage: Boolean(source.hasNextPage ?? page < totalPages),
    hasPrevPage: Boolean(source.hasPrevPage ?? page > 1),
  };
}
