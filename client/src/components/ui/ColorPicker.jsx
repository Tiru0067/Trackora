import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { COLORS } from "@/constants/colors";
import { opacityToHex } from "@/utils/colors";
import Popover from "./Popover";

// ─── Constants ────────────────────────────────────────────────────────────────
const WIDTH = 120;
const GAP = 12;

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

  // ─── Refs ────────────────────────────────────────────────────────────────
  const triggerRef = useRef(null);
  const trackRef = useRef(null);

  const totalPages = COLORS.length;

  // ─── Handlers ────────────────────────────────────────────────────────────
  const goTo = (page) => {
    const nextPage = Math.min(Math.max(page, 0), totalPages - 1);

    trackRef.current?.scrollTo({
      left: page * (WIDTH + GAP),
      behavior: "smooth",
    });

    setCurrentPage(nextPage);
  };

  const handleSelect = (hex) => {
    onChange(hex);
    setOpen(false);
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
      >
        <div className="bg-(--bg-card) border border-(--line) shadow-[0_12px_24px_-8px_rgba(0,0,0,0.15)] rounded-2xl p-1">
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
              className="py-2.5 flex overflow-x-auto hide-scrollbar snap-x snap-mandatory"
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
                    {colors.map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        tabIndex={isCurrentPage ? 0 : -1}
                        aria-label={`Select color ${hex}`}
                        aria-pressed={value === hex}
                        onClick={() => handleSelect(hex)}
                        style={{ background: hex }}
                        className="w-7 h-7 rounded-full cursor-pointer transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-100 dark:focus-visible:ring-offset-neutral-800"
                      />
                    ))}
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
              <button
                key={i}
                type="button"
                aria-label={`Go to color page ${i + 1}`}
                aria-current={i === currentPage ? "page" : undefined}
                onClick={() => goTo(i)}
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
