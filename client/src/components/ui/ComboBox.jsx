import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Popover from "./Popover";
import { useListNavigation } from "@/hooks/useListNavigation";
import { cn } from "@/utils/cn";

const POSITION = "bottom";

const ComboBox = ({
  searchable = false,
  options,
  id,
  value,
  onChange,
  className,
  placeholder = "Select",
  searchPlaceholder = "Search...",
  disabled = false,
  clearable = false,
}) => {
  // ─── State ────────────────────────────────────────────────────────────────
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // ─── Refs ─────────────────────────────────────────────────────────────────
  const triggerRef = useRef(null);
  const focusedRef = useRef(null);

  // ─── IDs ──────────────────────────────────────────────────────────────────
  const listboxId = `${id}-listbox`;

  // ─── Derived Data ─────────────────────────────────────────────────────────
  const filteredOptions = useMemo(() => {
    if (!query) return options;

    const q = query.toLowerCase();

    return options.filter(
      (option) =>
        option.value.toLowerCase().includes(q) ||
        option.label?.toLowerCase().includes(q) ||
        option.name?.toLowerCase().includes(q),
    );
  }, [query, options]);

  const selectedLabel = useMemo(
    () => options.find((option) => option.value === value)?.label ?? "",
    [options, value],
  );

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleSelect = useCallback(
    (optionValue) => {
      onChange?.(optionValue);
      setQuery("");
      setOpen(false);
      triggerRef.current?.focus();
    },
    [onChange],
  );

  // ─── Keyboard Navigation ──────────────────────────────────────────────────
  const { activeIndex, setActiveIndex, onKeyDown, reset } = useListNavigation({
    itemCount: filteredOptions.length,
    onSelect: (index) => {
      const option = filteredOptions[index];
      if (!option) return;

      handleSelect(option.value);
    },
    onClose: () => {
      setOpen(false);
      setQuery("");
    },
    loop: true,
  });

  // ─── ARIA State ───────────────────────────────────────────────────────────
  const activeOptionId =
    open && activeIndex >= 0 && filteredOptions[activeIndex]
      ? `${listboxId}-option-${filteredOptions[activeIndex].value}`
      : undefined;

  // ─── Open / Close ─────────────────────────────────────────────────────────
  const openCombobox = useCallback(() => {
    setOpen(true);
    setQuery("");
    reset();
    setActiveIndex(-1);
  }, [reset, setActiveIndex]);

  const closeCombobox = useCallback(() => {
    setOpen(false);
    setQuery("");
    reset();
    setActiveIndex(-1);
  }, [reset, setActiveIndex]);

  // ─── Trigger Keyboard Events ──────────────────────────────────────────────
  const handleTriggerKeyDown = useCallback(
    (event) => {
      if (!open) {
        if (
          event.key === "ArrowDown" ||
          event.key === "Enter" ||
          (!searchable && event.key === " ")
        ) {
          event.preventDefault();
          openCombobox();
          setActiveIndex(0);
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          openCombobox();
          setActiveIndex(filteredOptions.length - 1);
        }
        return;
      }

      if (event.key === "Tab") {
        if (!open) return;
        event.preventDefault();
        onKeyDown({
          key: event.shiftKey ? "ArrowUp" : "ArrowDown",
          preventDefault: () => {},
        });
        return;
      }

      onKeyDown(event);
    },
    [
      open,
      openCombobox,
      searchable,
      onKeyDown,
      setActiveIndex,
      filteredOptions.length,
    ],
  );

  // ─── Effects ──────────────────────────────────────────────────────────────
  useEffect(() => {
    focusedRef.current?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="relative w-full">
      {/* Trigger */}
      {searchable ? (
        <input
          ref={triggerRef}
          id={id}
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-activedescendant={activeOptionId}
          value={open ? query : selectedLabel}
          autoComplete="off"
          placeholder={searchPlaceholder}
          disabled={disabled}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onClick={openCombobox}
          onKeyDown={handleTriggerKeyDown}
          className={cn(
            "w-full px-3 py-2.5 bg-(--bg-card) border border-(--line) rounded-lg outline-none focus-visible:ring-1 focus-visible:ring-(--accent) focus-visible:border-(--accent) disabled:opacity-50 disabled:cursor-not-allowed",
            className,
          )}
        />
      ) : (
        <button
          ref={triggerRef}
          id={id}
          type="button"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-haspopup="listbox"
          aria-activedescendant={activeOptionId}
          disabled={disabled}
          onClick={() => {
            if (open) {
              closeCombobox();
            } else {
              openCombobox();
            }
          }}
          onKeyDown={handleTriggerKeyDown}
          className={cn(
            "flex justify-between items-center text-left px-3 py-2.5 bg-(--bg-card) border border-(--line) rounded-lg outline-none focus-visible:ring-1 focus-visible:ring-(--accent) focus-visible:border-(--accent) disabled:opacity-50 disabled:cursor-not-allowed",
            className,
          )}
        >
          <span className="truncate">{selectedLabel || placeholder}</span>

          <div className="flex items-center shrink-0 ml-2">
            {clearable && value ? (
              <div
                role="button"
                tabIndex={0}
                className="p-0.5 hover:bg-(--line-soft) rounded-md transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange?.("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    onChange?.("");
                  }
                }}
              >
                <X aria-hidden="true" size={14} className="text-(--ink-muted) hover:text-(--ink)" />
              </div>
            ) : open ? (
              <ChevronUp aria-hidden="true" size={18} className="text-(--ink-muted)" />
            ) : (
              <ChevronDown aria-hidden="true" size={18} className="text-(--ink-muted)" />
            )}
          </div>
        </button>
      )}

      {/* Dropdown */}
      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);

          if (!nextOpen) {
            setQuery("");
            reset();
            setActiveIndex(-1);
          }
        }}
        anchorRef={triggerRef}
        placement={POSITION}
        trapFocus={false}
        autoFocus={false}
      >
        <ul
          id={listboxId}
          role="listbox"
          className="dropdown-content overflow-y-auto w-full max-h-65 m-0"
        >
          {filteredOptions.map((option, index) => (
            <li
              id={`${listboxId}-option-${option.value}`}
              key={option.value}
              ref={index === activeIndex ? focusedRef : null}
              role="option"
              aria-selected={value === option.value}
              onMouseDown={(event) => {
                event.preventDefault();
                handleSelect(option.value);
              }}
              className={cn(
                "dropdown-item",
                index === activeIndex && "bg-(--line-soft) text-(--ink) font-medium",
                value === option.value &&
                  index !== activeIndex &&
                  "text-(--ink) font-medium",
              )}
            >
              {option.label}
            </li>
          ))}

          {filteredOptions.length === 0 && (
            <li
              role="option"
              aria-disabled="true"
              className="px-4 py-2 text-(--ink)"
            >
              No results
            </li>
          )}
        </ul>
      </Popover>
    </div>
  );
};

export default ComboBox;
