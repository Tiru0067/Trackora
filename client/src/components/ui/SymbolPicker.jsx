import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import * as Icons from "@phosphor-icons/react";
import emojis from "unicode-emoji-json";
import { twMerge } from "tailwind-merge";
import Popover from "./Popover";
import { cn } from "@/utils/cn";

// ─── Constants ────────────────────────────────────────────────────────────────
const OVERSCAN = 3;
const ITEM_SIZE = 44;
const COLUMN_COUNT = 6;
const CONTAINER_HEIGHT = 176;

// ─── Static data ──────────────────────────────────────────────────────────────
const iconsList = Object.entries(Icons).filter(([name]) => 
  /^[A-Z]/.test(name) && !name.includes("Context") && !name.includes("Base") && name !== "SSR"
);
const emojisList = Object.entries(emojis);
const items = { icons: iconsList, emojis: emojisList };
const tabs = Object.keys(items);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatName = (name) => name.replace(/([A-Z])/g, " $1").trim();

const getDisplayName = (item) => {
  if (!item) return "";
  if (item.set === "emojis") return emojis[item.name]?.name ?? item.name;
  return formatName(item.name);
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * SymbolPicker
 *
 * Props:
 *   value       { name: string, set: "phosphor" | "emojis" }   — controlled selected item
 *   onChange    (item) => void                               — called when user picks
 *   showLabel   boolean (default true)                       — show text label next to symbol on trigger
 *   className   string                                       — extra classes on the trigger button
 */
const TriggerSymbol = ({ value, color, iconClassName = "" }) => {
  if (!value)
    return (
      <span
        aria-hidden="true"
        className={twMerge("text-(--ink) text-xl", iconClassName)}
      >
        ?
      </span>
    );

  if (value.set === "emojis")
    return (
      <span
        aria-hidden="true"
        className={twMerge("leading-none text-xl", iconClassName)}
      >
        {value.name}
      </span>
    );

  const Icon = Icons[value.name];
  return Icon ? (
    <Icon
      aria-hidden="true"
      strokeWidth={1.75}
      className={twMerge("size-5", iconClassName)}
      color={color}
    />
  ) : null;
};

const FooterSymbol = ({ item }) => {
  if (!item) return null;

  if (item.set === "emojis")
    return (
      <span aria-hidden="true" className="text-sm leading-none">
        {item.name}
      </span>
    );

  const Icon = Icons[item.name];
  return Icon ? (
    <Icon
      aria-hidden="true"
      size={14}
      strokeWidth={1.75}
      className="text-(--ink) shrink-0"
    />
  ) : null;
};

// ─── Main component ───────────────────────────────────────────────────────────
const SymbolPicker = ({
  value,
  onChange,
  color,
  showLabel = false,
  placement = "bottom",
  className = "",
  iconClassName = "",
}) => {
  // ─── State ──────────────────────────────────────────────────────────────
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [scrollTop, setScrollTop] = useState(0);
  const [hovered, setHovered] = useState(null);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  // ─── Refs ────────────────────────────────────────────────────────────────
  const triggerRef = useRef(null);
  const tabRefs = useRef({});
  const searchRef = useRef(null);
  const containerRef = useRef(null);

  // ─── Derived data ────────────────────────────────────────────────────────

  // Filter icons/emojis by search query
  const filteredItems = useMemo(() => {
    if (!query) return items[activeTab];
    const q = query.toLowerCase().trim();
    if (activeTab === "emojis") {
      return items[activeTab].filter(([, meta]) =>
        meta.name.toLowerCase().includes(q),
      );
    }
    return items[activeTab].filter(([name]) => name.toLowerCase().includes(q));
  }, [query, activeTab]);

  // Virtual scroll calculations
  const rowCount = Math.ceil(filteredItems.length / COLUMN_COUNT);
  const totalHeight = rowCount * ITEM_SIZE;
  const visibleRowCount = Math.ceil(CONTAINER_HEIGHT / ITEM_SIZE);
  const startRow = Math.max(0, Math.floor(scrollTop / ITEM_SIZE) - OVERSCAN);
  const endRow = Math.min(
    rowCount,
    startRow + visibleRowCount + OVERSCAN * 2 + 1,
  );
  const visibleItems = filteredItems.slice(
    startRow * COLUMN_COUNT,
    endRow * COLUMN_COUNT,
  );

  const footerItem = hovered ?? value;

  // ─── Handlers ────────────────────────────────────────────────────────────
  const handleTriggerClick = () => {
    setScrollTop(0);
    setOpen((v) => !v);
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setSearch("");
    setQuery("");
    setScrollTop(0);
    containerRef.current?.scrollTo({ top: 0 });
  };

  const handleSelect = (item) => {
    onChange(item);
    setOpen(false);
  };

  // ─── Effects ─────────────────────────────────────────────────────────────

  // Animate tab underline
  useEffect(() => {
    const el = tabRefs.current[activeTab];
    if (el) setUnderlineStyle({ left: el.offsetLeft, width: el.offsetWidth });
  }, [activeTab, open]); // re-measure when picker opens too

  // Debounce search input into query
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(search);
      setScrollTop(0);
      containerRef.current?.scrollTo({ top: 0 });
    }, 250);
    return () => clearTimeout(t);
  }, [search]);

  // Reset scroll when picker opens
  useEffect(() => {
    if (open) containerRef.current?.scrollTo({ top: 0 });
  }, [open]);

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleTriggerClick}
        aria-label={
          value
            ? `Choose symbol, current symbol is ${getDisplayName(value)}`
            : "Choose symbol"
        }
        aria-haspopup="dialog"
        aria-expanded={open}
        className={twMerge(
          "p-1 inline-flex items-center gap-1.5 rounded-full transition-colors cursor-pointer",
          className,
        )}
      >
        <TriggerSymbol
          value={value}
          color={color}
          iconClassName={iconClassName}
        />
        {showLabel && value && (
          <span className="text-base font-medium text-(--ink) max-w-28 truncate">
            {getDisplayName(value)}
          </span>
        )}
      </button>

      <Popover
        open={open}
        onOpenChange={setOpen}
        anchorRef={triggerRef}
        placement={placement}
        role="dialog"
        trapFocus
      >
        <div className="w-80 rounded-2xl bg-(--bg-card) border border-(--line) p-1 shadow-[0_12px_24px_-8px_rgba(0,0,0,0.15)]">
          {/* Tabs */}
          <div className="px-2.5 w-fit">
            <div className="relative">
              <ul className="flex gap-3">
                {tabs.map((tab) => (
                  <li key={tab}>
                    <button
                      ref={(el) => (tabRefs.current[tab] = el)}
                      type="button"
                      aria-pressed={activeTab === tab}
                      onClick={() => handleTabSwitch(tab)}
                      className={`cursor-pointer px-1 py-2 text-[12px] font-medium capitalize transition-colors ${
                        activeTab === tab
                          ? "text-(--ink)"
                          : "text-(--ink-muted) hover:text-(--ink-soft)"
                      }`}
                    >
                      {tab}
                    </button>
                  </li>
                ))}
              </ul>
              <div
                className="absolute -bottom-px h-0.5 bg-(--ink)/75 transition-all duration-200 ease-out"
                style={underlineStyle}
              />
            </div>
          </div>

          {/* Search */}
          <div className="p-2.5 border-b border-(--line)">
            <div className="flex items-center gap-1.5 bg-(--bg-warm) rounded-lg px-2.5 h-10">
              <Search
                aria-hidden="true"
                size={14}
                className="text-zinc-400 shrink-0"
                strokeWidth={2.2}
              />
              <input
                ref={searchRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label={`Search ${activeTab}`}
                placeholder={`Search ${activeTab}…`}
                className="flex-1 bg-transparent border-none outline-none text-[12px] text-(--ink-soft) placeholder:text-(--ink-muted)"
              />
              {search && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setSearch("");
                    searchRef.current?.focus();
                  }}
                  className="flex items-center text-(--ink-muted) transition-colors cursor-pointer"
                >
                  <X aria-hidden="true" size={13} strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>

          {/* Count */}
          <div className="px-3 py-1 text-[11px] font-medium tracking-wide text-(--ink-muted)">
            {filteredItems.length} {activeTab === "icons" ? "icon" : "emoji"}
            {filteredItems.length !== 1 ? "s" : ""}
          </div>

          {/* Grid */}
          <div
            ref={containerRef}
            onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
            className="overflow-y-auto px-1.5 pb-1.5 hide-scrollbar"
            style={{ height: CONTAINER_HEIGHT }}
          >
            {filteredItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-1.5 text-[13px] text-(--ink-muted)">
                <Search aria-hidden="true" size={20} />
                No {activeTab} match "{query}"
              </div>
            ) : (
              <div style={{ height: totalHeight, position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    top: startRow * ITEM_SIZE,
                    left: 0,
                    right: 0,
                    display: "grid",
                    gridTemplateColumns: `repeat(${COLUMN_COUNT}, 1fr)`,
                  }}
                >
                  {visibleItems.map(([item, data]) => {
                    const isSelected = value?.name === item;

                    const Icon = activeTab === "icons" ? Icons[item] : null;

                    const label = Icon
                      ? formatName(item)
                      : (data?.name ?? item);

                    const itemObject = {
                      name: item,
                      set: Icon ? "phosphor" : "emojis",
                    };

                    return (
                      <button
                        type="button"
                        key={item}
                        aria-label={`Select ${label}`}
                        aria-pressed={isSelected}
                        title={label}
                        onMouseEnter={() => setHovered(itemObject)}
                        onMouseLeave={() => setHovered(null)}
                        onFocus={() => setHovered(itemObject)}
                        onBlur={() => setHovered(null)}
                        onClick={() => handleSelect(itemObject)}
                        style={{ height: ITEM_SIZE }}
                        className={cn(
                          `flex items-center justify-center 
                          rounded-lg border-none cursor-pointer
                          transition-colors duration-100
                          focus-ring`,
                          isSelected
                            ? "bg-(--line) text-(--ink)"
                            : `bg-transparent text-(--ink-muted) hover:bg-(--line)/50 hover:text-(--ink-soft)`,
                        )}
                      >
                        {Icon ? (
                          <Icon
                            aria-hidden="true"
                            size={17}
                            strokeWidth={1.75}
                          />
                        ) : (
                          <span aria-hidden="true">{item}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer: hovered → selected fallback */}
          <div className="flex items-center gap-1.5 border-t border-(--line) px-3 min-h-8.5">
            {footerItem ? (
              <>
                <FooterSymbol item={footerItem} />
                <span className="text-[12px] font-medium text-(--ink-muted) truncate">
                  {getDisplayName(footerItem)}
                </span>
              </>
            ) : (
              <span className="text-[12px] text-(--ink)">No icon selected</span>
            )}
          </div>
        </div>
      </Popover>
    </>
  );
};

export default SymbolPicker;
