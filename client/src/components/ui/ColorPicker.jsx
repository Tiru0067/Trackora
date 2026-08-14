import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { COLORS } from "@/constants/colors";
import { opacityToHex } from "@/utils/colors";
import Popover from "./Popover";

// ─── Constants ────────────────────────────────────────────────────────────────
const WIDTH = 120;
const GAP = 12;
const flatColors = COLORS.flat();

// ─── Component ────────────────────────────────────────────────────────────────
const ColorPicker = ({
  value,
  onChange,
  placement = "top",
  className = "",
  circleClassName = "",
  opacity = 0.3,
}) => {
  // ─── State ──────────────────────────────────────────────────────────────
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState(0);

  // ─── Refs ────────────────────────────────────────────────────────────────
  const triggerRef = useRef(null);
  const trackRef = useRef(null);
  const gridFocusRef = useRef(false);

  const totalPages = COLORS.length;

  // ─── Handlers ────────────────────────────────────────────────────────────
  const goTo = useCallback(
    (page) => {
      const nextPage = Math.min(Math.max(page, 0), totalPages - 1);

      trackRef.current?.scrollTo({
        left: page * (WIDTH + GAP),
      });

      setCurrentPage(nextPage);
    },
    [totalPages],
  );

  const handleSelect = (hex) => {
    onChange(hex);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleGridKeyDown = (e) => {
    let newIndex;

    switch (e.key) {
      case "ArrowRight":
        newIndex = Math.min(focusedIndex + 1, flatColors.length - 1);
        e.preventDefault();
        e.stopPropagation();
        break;
      case "ArrowLeft":
        newIndex = Math.max(focusedIndex - 1, 0);
        e.preventDefault();
        e.stopPropagation();
        break;
      case "ArrowDown":
        newIndex = Math.min(focusedIndex + 3, flatColors.length - 1);
        e.preventDefault();
        e.stopPropagation();
        break;
      case "ArrowUp":
        newIndex = Math.max(focusedIndex - 3, 0);
        e.preventDefault();
        e.stopPropagation();
        break;
      case "PageDown":
        newIndex = Math.min(focusedIndex + 9, flatColors.length - 1);
        e.preventDefault();
        e.stopPropagation();
        break;
      case "PageUp":
        newIndex = Math.max(focusedIndex - 9, 0);
        e.preventDefault();
        e.stopPropagation();
        break;
      case "Home":
        newIndex = 0;
        e.preventDefault();
        e.stopPropagation();
        break;
      case "End":
        newIndex = flatColors.length - 1;
        e.preventDefault();
        e.stopPropagation();
        break;
      default:
        return;
    }

    if (newIndex !== focusedIndex) {
      setFocusedIndex(newIndex);
      gridFocusRef.current = true;

      const newPage = Math.floor(newIndex / 9);
      if (newPage !== currentPage) {
        goTo(newPage);
      }
    }
  };

  // ─── Effects ─────────────────────────────────────────────────────────────

  // Track scroll position for pagination dots and prev/next buttons
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onScroll = () => {
      const page = Math.round(el.scrollLeft / (WIDTH + GAP));
      setCurrentPage(page);
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [open]); // re-attach when picker opens

  // Sync focusedIndex when picker opens
  useEffect(() => {
    if (open) {
      const index = flatColors.findIndex((hex) => hex === value);
      const targetIndex = Math.max(0, index);
      //eslint-disable-next-line
      setFocusedIndex(targetIndex);

      const page = Math.floor(targetIndex / 9);
      goTo(page);
    } else {
      setFocusedIndex(0);
    }
  }, [open, value, goTo]);

  // Apply focus to the new grid item when using arrow keys
  useEffect(() => {
    if (gridFocusRef.current && trackRef.current) {
      const activeBtn = trackRef.current.querySelector(
        `button[data-grid-index="${focusedIndex}"]`,
      );
      if (activeBtn) {
        activeBtn.focus();
        gridFocusRef.current = false;
      }
    }
  }, [focusedIndex]);

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Choose color"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={twMerge(
          "p-1 rounded-full transition-colors cursor-pointer",
          className,
        )}
      >
        <div
          aria-hidden="true"
          className={twMerge(
            "w-5 h-5 rounded-full border-2 transition-colors",
            circleClassName,
          )}
          style={{
            borderColor: value,
            background: value
              ? value + opacityToHex(opacity)
              : COLORS.flat()[0] + opacityToHex(opacity),
          }}
        />
      </button>

      <Popover
        open={open}
        onOpenChange={setOpen}
        anchorRef={triggerRef}
        placement={placement}
        role="dialog"
        trapFocus
        enableArrowNavigation={false}
      >
        <div
          className="bg-(--bg-elevated) border border-(--line) shadow-[0_12px_24px_-8px_rgba(0,0,0,0.15)] rounded-2xl p-1"
          onKeyDown={(e) => {
            const keys = [
              "ArrowUp",
              "ArrowDown",
              "ArrowLeft",
              "ArrowRight",
              "PageUp",
              "PageDown",
              "Home",
              "End",
            ];
            if (keys.includes(e.key)) {
              if (trackRef.current?.contains(document.activeElement)) return;

              e.preventDefault();
              e.stopPropagation();
              const activeBtn = trackRef.current?.querySelector(
                `button[data-grid-index="${focusedIndex}"]`,
              );
              activeBtn?.focus();
            }
          }}
        >
          <div className="flex items-stretch">
            <button
              type="button"
              aria-label="Previous color page"
              onClick={() => goTo(currentPage - 1)}
              disabled={currentPage === 0}
              className="w-7 self-stretch disabled:opacity-30 disabled:cursor-not-allowed enabled:cursor-pointer group"
            >
              <ChevronLeft className="size-4 stroke-(--ink-soft) mx-auto transition-transform duration-200 ease-out group-hover:scale-125" />
            </button>

            <div
              ref={trackRef}
              onKeyDown={handleGridKeyDown}
              tabIndex={-1}
              className="py-2.5 flex overflow-x-auto hide-scrollbar snap-x snap-mandatory outline-none"
              style={{ width: WIDTH, gap: GAP }}
            >
              {COLORS.map((colors, pageIndex) => {
                const isCurrentPage = pageIndex === currentPage;

                return (
                  <div
                    key={pageIndex}
                    aria-hidden={!isCurrentPage}
                    className="shrink-0 snap-start grid grid-cols-3 place-items-center gap-2"
                    style={{ width: WIDTH, gap: GAP }}
                  >
                    {colors.map((hex, indexInPage) => {
                      const globalIndex = pageIndex * 9 + indexInPage;
                      return (
                        <button
                          key={hex}
                          type="button"
                          tabIndex={-1}
                          data-grid-index={globalIndex}
                          aria-label={`Select color ${hex}`}
                          aria-pressed={value === hex}
                          onClick={() => handleSelect(hex)}
                          style={{ backgroundColor: hex }}
                          className="w-7 h-7 rounded-full cursor-pointer transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink)"
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              aria-label="Next color page"
              onClick={() => goTo(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="w-7 self-stretch disabled:opacity-30 disabled:cursor-not-allowed enabled:cursor-pointer group"
            >
              <ChevronRight
                aria-hidden="true"
                className="size-4 stroke-(--ink-soft) mx-auto transition-transform duration-200 ease-out group-hover:scale-125"
              />
            </button>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center gap-1 pb-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === currentPage
                    ? "bg-black dark:bg-white scale-150"
                    : "bg-black/30 dark:bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </Popover>
    </>
  );
};

export default ColorPicker;
