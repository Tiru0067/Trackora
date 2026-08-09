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
      className="flex flex-col sm:flex-row gap-3 mt-4 mb-2"
    >
      <search className="relative flex-1">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-(--ink-muted)"
        />
        <input
          type="text"
          placeholder="Search wallets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-(--bg-card) border border-(--line) rounded-lg text-sm focus:outline-none focus:border-(--accent) transition-colors"
        />
      </search>

      <div className="flex gap-2 ml-auto">
        {/* Custom Sort Dropdown */}
        <div className="relative">
          <button
            ref={sortTriggerRef}
            type="button"
            onClick={() => setIsSortMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-2 bg-(--bg-card) border border-(--line) hover:border-(--line-soft) rounded-lg text-sm text-(--ink) transition-colors min-w-40"
          >
            <ArrowUpDown size={14} className="text-(--ink-muted)" />
            <span>
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
            placement="bottom-start"
          >
            {({ close }) => (
              <ul className="bg-(--bg-card) border border-(--line) rounded-xl shadow-lg p-1.5 min-w-40 flex flex-col gap-1">
                {[
                  { value: "default", label: "Default Sort" },
                  { value: "highToLow", label: "Highest Balance" },
                  { value: "lowToHigh", label: "Lowest Balance" },
                  { value: "aToZ", label: "A to Z" },
                  { value: "zToA", label: "Z to A" },
                ].map((opt) => (
                  <li key={opt.value}>
                    <button
                      type="button"
                      onClick={() => {
                        setSortBy(opt.value);
                        close();
                      }}
                      className="w-full flex items-center justify-between px-3 py-1.5 text-sm text-(--ink) hover:bg-(--line-soft) rounded-lg transition-colors text-left"
                    >
                      <span>{opt.label}</span>
                      {sortBy === opt.value && (
                        <Check size={14} className="text-(--accent)" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Popover>
        </div>

        {/* Custom Filter Dropdown */}
        <div className="relative">
          <button
            ref={filterTriggerRef}
            type="button"
            onClick={() => setIsFilterMenuOpen((prev) => !prev)}
            className="flex items-center justify-between gap-2 px-3 py-2 bg-(--bg-card) border border-(--line) hover:border-(--line-soft) rounded-lg text-sm text-(--ink) transition-colors min-w-35"
          >
            <Filter size={14} className="text-(--ink-muted)" />
            <span>
              {filterCurrency === "All" ? "All Currencies" : filterCurrency}
            </span>
          </button>
          <Popover
            open={isFilterMenuOpen}
            onOpenChange={setIsFilterMenuOpen}
            anchorRef={filterTriggerRef}
            placement="bottom-start"
          >
            {({ close }) => (
              <ul className="bg-(--bg-card) border border-(--line) rounded-xl shadow-lg p-1.5 min-w-40 flex flex-col gap-1 max-h-60 overflow-y-auto">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setFilterCurrency("All");
                      close();
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-sm text-(--ink) hover:bg-(--line-soft) rounded-lg transition-colors text-left"
                  >
                    <span>All Currencies</span>
                    {filterCurrency === "All" && (
                      <Check size={14} className="text-(--accent)" />
                    )}
                  </button>
                </li>
                {Object.keys(balancesByCurrency).length > 0 && (
                  <div className="h-px bg-(--line) my-1 mx-2" />
                )}
                {Object.keys(balancesByCurrency).map((currency) => (
                  <li key={currency}>
                    <button
                      type="button"
                      onClick={() => {
                        setFilterCurrency(currency);
                        close();
                      }}
                      className="w-full flex items-center justify-between px-3 py-1.5 text-sm text-(--ink) hover:bg-(--line-soft) rounded-lg transition-colors text-left"
                    >
                      <span>{currency}</span>
                      {filterCurrency === currency && (
                        <Check size={14} className="text-(--accent)" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Popover>
        </div>
      </div>
    </section>
  );
};

export default WalletToolbar;
