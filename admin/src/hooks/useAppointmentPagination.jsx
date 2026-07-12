import { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 6;

const byNewest = (a, b) => (b.date || 0) - (a.date || 0);

export const useAppointmentPagination = (appointments, pageSize = PAGE_SIZE) => {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  const sorted = useMemo(
    () => [...appointments].sort(byNewest),
    [appointments],
  );

  const visible = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [appointments.length, pageSize]);

  const loadMore = () => {
    setVisibleCount((count) => Math.min(count + pageSize, sorted.length));
  };

  return { visible, hasMore, loadMore, total: sorted.length };
};

export const LoadMoreButton = ({ hasMore, onClick, loaded, total }) => {
  if (!hasMore) return null;

  return (
    <div className="flex flex-col items-center gap-2 pt-4">
      <p className="text-sm text-gray-500">
        Showing {loaded} of {total} appointments
      </p>
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition"
        aria-label="Load more appointments"
      >
        <span className="text-lg leading-none">↓</span>
        Load 6 more
      </button>
    </div>
  );
};
