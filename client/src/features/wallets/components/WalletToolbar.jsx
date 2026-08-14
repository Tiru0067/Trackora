import {
  Search,
  ArrowUpDown,
  Filter,
  Check,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import DropdownMenu from "@/components/ui/DropdownMenu";

const WalletToolbar = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  filterCurrency,
  setFilterCurrency,
  balancesByCurrency,
}) => {
  return (
    <section
      aria-label="Filters and Search"
      className="flex gap-2 sm:gap-3 mt-4 mb-2"
    >
      <search className="relative flex-1">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-(--ink-muted)"
          aria-hidden="true"
        />
        <input
          type="search"
          aria-label="Search wallets"
          placeholder="Search wallets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 pl-9 pr-4 py-2 bg-(--bg-card) border border-(--line) rounded-lg text-[13.5px] focus:outline-none focus:border-(--accent) focus:ring-1 focus:ring-(--accent) transition-colors placeholder:text-(--ink-muted) text-(--ink)"
        />
      </search>

      <div className="flex gap-2 shrink-0">
        {/* Custom Filter Dropdown */}
        <DropdownMenu
          placement="bottom-end"
          trigger={
            <button
              type="button"
              aria-haspopup="menu"
              className="btn sm:justify-start bg-(--bg-card) border border-(--line) hover:border-(--line-soft) text-(--ink) sm:min-w-36"
              title="Filter by currency"
            >
              <Filter
                size={14}
                className="text-(--ink-muted)"
                aria-hidden="true"
              />
              <span className="hidden sm:inline">
                {filterCurrency === "All" ? "All Currencies" : filterCurrency}
              </span>
            </button>
          }
          groups={[
            [
              {
                id: "all",
                label: "All Currencies",
                onClick: () => setFilterCurrency("All"),
                rightElement:
                  filterCurrency === "All" ? (
                    <Check
                      size={14}
                      className="text-(--accent)"
                      aria-hidden="true"
                    />
                  ) : null,
              },
            ],
            Object.keys(balancesByCurrency).map((currency) => ({
              id: currency,
              label: currency,
              onClick: () => setFilterCurrency(currency),
              rightElement:
                filterCurrency === currency ? (
                  <Check
                    size={14}
                    className="text-(--accent)"
                    aria-hidden="true"
                  />
                ) : null,
            })),
          ]}
        />

        {/* Custom Sort Dropdown */}
        <DropdownMenu
          placement="bottom-end"
          trigger={
            <button
              type="button"
              aria-haspopup="menu"
              className="btn sm:justify-start bg-(--bg-card) border border-(--line) hover:border-(--line-soft) text-(--ink) sm:min-w-40"
              title="Sort wallets"
            >
              <ArrowUpDown
                size={14}
                className="text-(--ink-muted)"
                aria-hidden="true"
              />
              <span className="hidden sm:inline">
                {sortBy === "default" && "Default Sort"}
                {sortBy.startsWith("name") && "Name"}
                {sortBy.startsWith("balance") && "Balance"}
                {sortBy.startsWith("date") && "Date Added"}
              </span>
            </button>
          }
          items={[
            { id: "name", label: "Name", defaultDir: "asc" },
            { id: "balance", label: "Balance", defaultDir: "desc" },
            { id: "date", label: "Date Added", defaultDir: "desc" },
            { id: "default", label: "Default Sort", defaultDir: null },
          ].map((opt) => {
            const isSelected =
              sortBy === opt.id || sortBy.startsWith(opt.id + "-");
            const currentDir =
              isSelected && sortBy.includes("-") ? sortBy.split("-")[1] : null;

            return {
              id: opt.id,
              label: opt.label,
              autoClose: false,
              onClick: () => {
                if (opt.id === "default") {
                  setSortBy("default");
                } else if (isSelected) {
                  setSortBy(
                    `${opt.id}-${currentDir === "asc" ? "desc" : "asc"}`,
                  );
                } else {
                  setSortBy(`${opt.id}-${opt.defaultDir}`);
                }
              },
              rightElement: isSelected ? (
                opt.id === "default" ? (
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
                )
              ) : null,
            };
          })}
        />
      </div>
    </section>
  );
};

export default WalletToolbar;
