import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/utils/cn";
import DropdownMenu from "@/components/ui/DropdownMenu";

const Pagination = ({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
}) => {
  if (totalPages <= 1 && total === 0) return null;

  // Generate page numbers
  const getPages = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(page - 1);
        pages.push(page);
        pages.push(page + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 pt-3 border-t border-(--line-soft) bg-(--bg-card)">
      <div className="flex items-center gap-2 text-[13px] text-(--ink-soft)">
        <span>Show Results</span>
        <DropdownMenu
          placement="bottom"
          minWidth="w-20"
          trigger={
            <button
              type="button"
              className="flex items-center justify-between gap-1.5 h-7 px-2 rounded-md bg-transparent border border-(--line) text-(--ink) hover:bg-(--line-soft) text-[13px] font-medium cursor-pointer transition-colors"
            >
              <span>{limit}</span>
              <ChevronDown size={12} className="text-(--ink-muted) shrink-0" />
            </button>
          }
          items={[10, 20, 50, 100].map((val) => ({
            id: String(val),
            label: String(val),
            onClick: () => onLimitChange?.(val),
          }))}
        />
        <span>of {total}</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className="w-8 h-8 flex items-center justify-center rounded-full text-(--ink-muted) hover:bg-(--line-soft) disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronsLeft size={16} />
        </button>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="w-8 h-8 flex items-center justify-center rounded-full text-(--ink-muted) hover:bg-(--line-soft) disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        {getPages().map((p, i) => (
          <button
            key={i}
            onClick={() => p !== "..." && onPageChange(p)}
            disabled={p === "..."}
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded-full text-[13px] font-medium transition-colors",
              p === page
                ? "bg-(--accent) text-(--bg)"
                : p === "..."
                  ? "text-(--ink-muted) cursor-default"
                  : "text-(--ink) hover:bg-(--line-soft)",
            )}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-full text-(--ink-muted) hover:bg-(--line-soft) disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronRight size={16} />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-full text-(--ink-muted) hover:bg-(--line-soft) disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
