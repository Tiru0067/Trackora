import {
  Search,
  ArrowUpDown,
  Filter,
  Check,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import Popover from "@/components/ui/Popover";
import { useRef, useState } from "react";
import { cn } from "@/utils/cn";

const CategoryToolbar = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  usageFilter,
  setUsageFilter,
}) => {
  const sortRef = useRef(null);
  const filterRef = useRef(null);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <section
      aria-label="Filters and Search"
      className="flex gap-2 sm:gap-3 mt-4 mb-6"
    >
      <search className="relative flex-1" aria-label="Search categories">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-(--ink-muted)"
          aria-hidden="true"
        />
        <input
          type="search"
          aria-label="Search categories"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 h-10 bg-(--bg-card) border border-(--line) rounded-lg text-sm focus:outline-none focus:border-(--accent) focus:ring-1 focus:ring-(--accent) transition-colors placeholder:text-(--ink-muted) text-(--ink)"
        />
      </search>

      <div className="flex gap-2 shrink-0">
        {/* Filter Menu */}
        <div className="relative">
          <button
            ref={filterRef}
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            aria-expanded={isFilterOpen}
            aria-haspopup="menu"
            className="flex items-center justify-center sm:justify-start gap-2 px-3 py-2 h-10 bg-(--bg-card) border border-(--line) hover:border-(--line-soft) rounded-lg text-sm text-(--ink) transition-colors sm:min-w-36"
            title="Filter usage"
          >
            <Filter
              size={14}
              className="text-(--ink-muted)"
              aria-hidden="true"
            />
            <span className="hidden sm:inline">
              {usageFilter === "all"
                ? "All Usage"
                : usageFilter === "active"
                  ? "Active Only"
                  : "Unused"}
            </span>
          </button>
          <Popover
            open={isFilterOpen}
            onOpenChange={setIsFilterOpen}
            anchorRef={filterRef}
            placement="bottom-end"
          >
            {({ close }) => (
              <menu className="bg-(--bg-card) border border-(--line) rounded-xl shadow-lg p-1.5 w-44 flex flex-col gap-1 m-0">
                <div
                  className="px-2 py-1 text-xs font-medium text-(--ink-muted) uppercase tracking-wider"
                  role="presentation"
                >
                  Usage
                </div>
                {[
                  { id: "all", label: "All Usage" },
                  { id: "active", label: "Active Only" },
                  { id: "unused", label: "Unused" },
                ].map((opt) => (
                  <li key={opt.id} role="none">
                    <button
                      role="menuitem"
                      onClick={() => {
                        setUsageFilter(opt.id);
                        close();
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 text-[13px] rounded-lg transition-colors",
                        usageFilter === opt.id
                          ? "bg-(--line-soft) text-(--ink)"
                          : "text-(--ink-soft) hover:text-(--ink) hover:bg-(--line-soft)/50",
                      )}
                    >
                      <span>{opt.label}</span>
                      {usageFilter === opt.id && (
                        <Check size={14} aria-hidden="true" />
                      )}
                    </button>
                  </li>
                ))}
              </menu>
            )}
          </Popover>
        </div>

        {/* Sort Menu */}
        <div className="relative">
          <button
            ref={sortRef}
            type="button"
            onClick={() => setIsSortOpen(!isSortOpen)}
            aria-expanded={isSortOpen}
            aria-haspopup="menu"
            className="flex items-center justify-center sm:justify-start gap-2 px-3 py-2 h-10 bg-(--bg-card) border border-(--line) hover:border-(--line-soft) rounded-lg text-sm text-(--ink) transition-colors sm:min-w-40"
            title="Sort categories"
          >
            <ArrowUpDown
              size={14}
              className="text-(--ink-muted)"
              aria-hidden="true"
            />
            <span className="hidden sm:inline">
              {sortBy === "default" && "Default Sort"}
              {sortBy.startsWith("name") && "Name"}
              {sortBy.startsWith("amount") && "Amount"}
              {sortBy.startsWith("usage") && "Usage"}
              {sortBy.startsWith("date") && "Date Added"}
            </span>
          </button>
          <Popover
            open={isSortOpen}
            onOpenChange={setIsSortOpen}
            anchorRef={sortRef}
            placement="bottom-end"
          >
            {({ close }) => (
              <menu className="bg-(--bg-card) border border-(--line) rounded-xl shadow-lg p-1.5 w-48 flex flex-col gap-1 m-0">
                {[
                  { id: "name", label: "Name", defaultDir: "asc" },
                  { id: "amount", label: "Amount", defaultDir: "desc" },
                  { id: "usage", label: "Usage", defaultDir: "desc" },
                  { id: "date", label: "Date Added", defaultDir: "desc" },
                  { id: "default", label: "Default Sort", defaultDir: null },
                ].map((opt) => {
                  const isSelected =
                    sortBy === opt.id || sortBy.startsWith(opt.id + "-");
                  const currentDir =
                    isSelected && sortBy.includes("-")
                      ? sortBy.split("-")[1]
                      : null;

                  return (
                    <li key={opt.id} role="none">
                      <button
                        role="menuitem"
                        onClick={() => {
                          if (opt.id === "default") {
                            setSortBy("default");
                          } else if (isSelected) {
                            setSortBy(
                              `${opt.id}-${currentDir === "asc" ? "desc" : "asc"}`,
                            );
                          } else {
                            setSortBy(`${opt.id}-${opt.defaultDir}`);
                          }
                          close();
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 text-[13px] rounded-lg transition-colors",
                          isSelected
                            ? "bg-(--line-soft) text-(--ink)"
                            : "text-(--ink-soft) hover:text-(--ink) hover:bg-(--line-soft)/50",
                        )}
                      >
                        <span>{opt.label}</span>
                        {isSelected &&
                          (opt.id === "default" ? (
                            <Check
                              size={14}
                              className="text-(--accent)"
                              aria-hidden="true"
                            />
                          ) : currentDir === "asc" ? (
                            <ArrowUp
                              size={14}
                              className="text-(--accent)"
                              aria-hidden="true"
                            />
                          ) : (
                            <ArrowDown
                              size={14}
                              className="text-(--accent)"
                              aria-hidden="true"
                            />
                          ))}
                      </button>
                    </li>
                  );
                })}
              </menu>
            )}
          </Popover>
        </div>
      </div>
    </section>
  );
};

export default CategoryToolbar;
