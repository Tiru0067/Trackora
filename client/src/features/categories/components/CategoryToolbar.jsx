import {
  Search,
  ArrowUpDown,
  Filter,
  Check,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import DropdownMenu from "@/components/ui/DropdownMenu";

const CategoryToolbar = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  usageFilter,
  setUsageFilter,
}) => {

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
        {/* Filter Menu */}
        <DropdownMenu
          placement="bottom-end"
          trigger={
            <button
              type="button"
              aria-haspopup="menu"
              className="btn sm:justify-start bg-(--bg-card) border border-(--line) hover:border-(--line-soft) text-(--ink) sm:min-w-36"
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
          }
          items={[
            { id: "label-usage", label: "Usage", type: "label" },
            ...[
              { id: "all", label: "All Usage" },
              { id: "active", label: "Active Only" },
              { id: "unused", label: "Unused" },
            ].map((opt) => ({
              id: opt.id,
              label: opt.label,
              onClick: () => setUsageFilter(opt.id),
              rightElement: usageFilter === opt.id ? (
                <Check size={14} aria-hidden="true" className="text-(--accent)" />
              ) : null,
            }))
          ]}
        />

        {/* Sort Menu */}
        <DropdownMenu
          placement="bottom-end"
          trigger={
            <button
              type="button"
              aria-haspopup="menu"
              className="btn sm:justify-start bg-(--bg-card) border border-(--line) hover:border-(--line-soft) text-(--ink) sm:min-w-40"
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
          }
          items={[
            { id: "name", label: "Name", defaultDir: "asc" },
            { id: "amount", label: "Amount", defaultDir: "desc" },
            { id: "usage", label: "Usage", defaultDir: "desc" },
            { id: "date", label: "Date Added", defaultDir: "desc" },
            { id: "default", label: "Default Sort", defaultDir: null },
          ].map((opt) => {
            const isSelected = sortBy === opt.id || sortBy.startsWith(opt.id + "-");
            const currentDir = isSelected && sortBy.includes("-") ? sortBy.split("-")[1] : null;

            return {
              id: opt.id,
              label: opt.label,
              autoClose: false,
              onClick: () => {
                if (opt.id === "default") {
                  setSortBy("default");
                } else if (isSelected) {
                  setSortBy(`${opt.id}-${currentDir === "asc" ? "desc" : "asc"}`);
                } else {
                  setSortBy(`${opt.id}-${opt.defaultDir}`);
                }
              },
              rightElement: isSelected ? (
                opt.id === "default" ? (
                  <Check size={14} className="text-(--accent)" aria-hidden="true" />
                ) : currentDir === "asc" ? (
                  <ArrowUp size={14} className="text-(--accent)" aria-hidden="true" />
                ) : (
                  <ArrowDown size={14} className="text-(--accent)" aria-hidden="true" />
                )
              ) : null,
            };
          })}
        />
      </div>
    </section>
  );
};

export default CategoryToolbar;
