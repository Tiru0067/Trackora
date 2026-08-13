import { Search, ArrowUpDown, Filter, Check } from "lucide-react";
import Popover from "@/components/ui/Popover";
import { useRef } from "react";

const WalletToolbar = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  filterCurrency,
  setFilterCurrency,
  balancesByCurrency,
  isSortMenuOpen,
  setIsSortMenuOpen,
  isFilterMenuOpen,
  setIsFilterMenuOpen,
}) => {
  const sortTriggerRef = useRef(null);
  const filterTriggerRef = useRef(null);

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
        {/* Custom Sort Dropdown */}
        <div className="relative">
          <button
            ref={sortTriggerRef}
            type="button"
            onClick={() => setIsSortMenuOpen((prev) => !prev)}
            aria-expanded={isSortMenuOpen}
            aria-haspopup="menu"
            className="flex items-center justify-center sm:justify-start gap-2 px-3 py-2 h-10 bg-(--bg-card) border border-(--line) hover:border-(--line-soft) rounded-lg text-sm text-(--ink) transition-colors sm:min-w-40"
            title="Sort wallets"
          >
            <ArrowUpDown size={14} className="text-(--ink-muted)" aria-hidden="true" />
            <span className="hidden sm:inline">
              {sortBy === "default" && "Default Sort"}
              {sortBy === "highToLow" && "Highest Balance"}
              {sortBy === "lowToHigh" && "Lowest Balance"}
              {sortBy === "aToZ" && "A to Z"}
              {sortBy === "zToA" && "Z to A"}
            </span>
          </button>
          <Popover
            open={isSortMenuOpen}
            onOpenChange={setIsSortMenuOpen}
            anchorRef={sortTriggerRef}
            placement="bottom-end"
          >
            {({ close }) => (
              <menu className="bg-(--bg-card) border border-(--line) rounded-xl shadow-lg p-1.5 min-w-40 flex flex-col gap-1 m-0">
                {[
                  { value: "default", label: "Default Sort" },
                  { value: "highToLow", label: "Highest Balance" },
                  { value: "lowToHigh", label: "Lowest Balance" },
                  { value: "aToZ", label: "A to Z" },
                  { value: "zToA", label: "Z to A" },
                ].map((opt) => (
                  <li key={opt.value} role="none">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setSortBy(opt.value);
                        close();
                      }}
                      className="w-full flex items-center justify-between px-3 py-1.5 text-[13px] text-(--ink) hover:bg-(--line-soft) rounded-lg transition-colors text-left"
                    >
                      <span>{opt.label}</span>
                      {sortBy === opt.value && (
                        <Check size={14} className="text-(--accent)" aria-hidden="true" />
                      )}
                    </button>
                  </li>
                ))}
              </menu>
            )}
          </Popover>
        </div>

        {/* Custom Filter Dropdown */}
        <div className="relative">
          <button
            ref={filterTriggerRef}
            type="button"
            onClick={() => setIsFilterMenuOpen((prev) => !prev)}
            aria-expanded={isFilterMenuOpen}
            aria-haspopup="menu"
            className="flex items-center justify-center sm:justify-start gap-2 px-3 py-2 h-10 bg-(--bg-card) border border-(--line) hover:border-(--line-soft) rounded-lg text-sm text-(--ink) transition-colors sm:min-w-36"
            title="Filter by currency"
          >
            <Filter size={14} className="text-(--ink-muted)" aria-hidden="true" />
            <span className="hidden sm:inline">
              {filterCurrency === "All" ? "All Currencies" : filterCurrency}
            </span>
          </button>
          <Popover
            open={isFilterMenuOpen}
            onOpenChange={setIsFilterMenuOpen}
            anchorRef={filterTriggerRef}
            placement="bottom-end"
          >
            {({ close }) => (
              <menu className="bg-(--bg-card) border border-(--line) rounded-xl shadow-lg p-1.5 min-w-40 flex flex-col gap-1 max-h-60 overflow-y-auto m-0">
                <li role="none">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setFilterCurrency("All");
                      close();
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-[13px] text-(--ink) hover:bg-(--line-soft) rounded-lg transition-colors text-left"
                  >
                    <span>All Currencies</span>
                    {filterCurrency === "All" && (
                      <Check size={14} className="text-(--accent)" aria-hidden="true" />
                    )}
                  </button>
                </li>
                {Object.keys(balancesByCurrency).length > 0 && (
                  <div className="h-px bg-(--line) my-1 mx-2" role="presentation" />
                )}
                {Object.keys(balancesByCurrency).map((currency) => (
                  <li key={currency} role="none">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setFilterCurrency(currency);
                        close();
                      }}
                      className="w-full flex items-center justify-between px-3 py-1.5 text-[13px] text-(--ink) hover:bg-(--line-soft) rounded-lg transition-colors text-left"
                    >
                      <span>{currency}</span>
                      {filterCurrency === currency && (
                        <Check size={14} className="text-(--accent)" aria-hidden="true" />
                      )}
                    </button>
                  </li>
                ))}
              </menu>
            )}
          </Popover>
        </div>
      </div>
    </section>
  );
};

export default WalletToolbar;
