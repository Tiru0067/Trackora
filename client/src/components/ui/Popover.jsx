import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

const GAP = 10;
const VIEWPORT_PADDING = 10;

const getFocusableElements = (element) => {
  if (!element) return [];

  return Array.from(
    element.querySelectorAll(
      [
        "a[href]",
        "button:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        '[tabindex]:not([tabindex="-1"])',
      ].join(","),
    ),
  ).filter((el) => {
    const isHidden =
      el.hasAttribute("hidden") ||
      el.getAttribute("aria-hidden") === "true" ||
      el.offsetParent === null;

    return !isHidden;
  });
};

const Popover = ({
  trigger,
  triggerClassName,
  placement = "bottom-start", // "bottom-start" | "bottom-end" | "top-start" | "top-end" | "left-start" | "left-end" | "right-start" | "right-end"
  children,
  open: controlledOpen,
  onOpenChange,
  anchorRef,
  role,
  id,
  labelledBy,
  trapFocus = true,
  autoFocus = true,
}) => {
  // ─── State ────────────────────────────────────────────────────────────────
  const [internalOpen, setInternalOpen] = useState(false);

  // ─── Refs ─────────────────────────────────────────────────────────────────
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);

  // ─── Controlled vs uncontrolled ───────────────────────────────────────────
  const anchor = anchorRef ?? triggerRef;
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  // ─── Open state handlers ──────────────────────────────────────────────────
  const setOpen = useCallback(
    (value) => {
      if (isControlled) {
        onOpenChange?.(value);
      } else {
        setInternalOpen(value);
      }
    },
    [isControlled, onOpenChange],
  );

  const close = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const closeAndRestoreFocus = useCallback(() => {
    setOpen(false);

    requestAnimationFrame(() => {
      anchor.current?.focus?.();
    });
  }, [setOpen, anchor]);

  const toggle = useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);

  // ─── Position ─────────────────────────────────────────────────────────────
  const updatePosition = useCallback(() => {
    if (!open || !anchor.current || !popoverRef.current) return;

    const rect = anchor.current.getBoundingClientRect();
    const menuWidth = popoverRef.current.offsetWidth;
    const menuHeight = popoverRef.current.offsetHeight;

    const spaceAbove = rect.top - VIEWPORT_PADDING;
    const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_PADDING;
    const spaceLeft = rect.left - VIEWPORT_PADDING;
    const spaceRight = window.innerWidth - rect.right - VIEWPORT_PADDING;

    const [side, align = "start"] = placement.split("-");

    let top, left;

    if (side === "left" || side === "right") {
      // ── Horizontal side ──────────────────────────────────────────────────
      if (side === "left") {
        left =
          spaceLeft >= menuWidth + GAP
            ? rect.left - menuWidth - GAP
            : rect.right + GAP; // flip to right
      } else {
        left =
          spaceRight >= menuWidth + GAP
            ? rect.right + GAP
            : rect.left - menuWidth - GAP; // flip to left
      }

      // Vertical alignment along the trigger
      if (align === "start") top = rect.top;
      else if (align === "end") top = rect.bottom - menuHeight;
      else top = rect.top + rect.height / 2 - menuHeight / 2; // center
    } else {
      // ── Vertical side ────────────────────────────────────────────────────
      if (side === "bottom") {
        top =
          spaceBelow >= menuHeight + GAP
            ? rect.bottom + GAP
            : rect.top - menuHeight - GAP; // flip to top
      } else {
        top =
          spaceAbove >= menuHeight + GAP
            ? rect.top - menuHeight - GAP
            : rect.bottom + GAP; // flip to bottom
      }

      // Horizontal alignment along the trigger
      if (align === "start") left = rect.left;
      else if (align === "end") left = rect.right - menuWidth;
      else left = rect.left + rect.width / 2 - menuWidth / 2; // center
    }

    // ── Clamp within viewport ──────────────────────────────────────────────
    top = Math.max(
      VIEWPORT_PADDING,
      Math.min(top, window.innerHeight - menuHeight - VIEWPORT_PADDING),
    );
    left = Math.max(
      VIEWPORT_PADDING,
      Math.min(left, window.innerWidth - menuWidth - VIEWPORT_PADDING),
    );

    popoverRef.current.style.top = `${top}px`;
    popoverRef.current.style.left = `${left}px`;

    // minWidth only makes sense when anchored to top/bottom
    if (side === "top" || side === "bottom") {
      popoverRef.current.style.minWidth = `${rect.width}px`;
    }
  }, [open, placement, anchor]);

  // Sync position before paint when open/placement changes
  useLayoutEffect(() => {
    updatePosition();
  }, [open, placement, updatePosition]);

  // ─── Event listeners ──────────────────────────────────────────────────────

  useEffect(() => {
    if (!open || !autoFocus) return;

    const frameId = requestAnimationFrame(() => {
      const focusableElements = getFocusableElements(popoverRef.current);
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        popoverRef.current?.focus();
      }
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [open, autoFocus]);

  // Reposition on scroll/resize
  useEffect(() => {
    if (!open) return;
    let frame;

    const handleUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updatePosition);
    };

    window.addEventListener("resize", handleUpdate);
    window.addEventListener("scroll", handleUpdate, true);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleUpdate);
      window.removeEventListener("scroll", handleUpdate, true);
    };
  }, [open, updatePosition]);

  // Close on Escape & handle keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation?.();
        closeAndRestoreFocus();
        return;
      }

      const focusableElements = getFocusableElements(popoverRef.current);
      if (focusableElements.length === 0) {
        if (trapFocus && event.key === "Tab") {
          event.preventDefault();
          popoverRef.current?.focus();
        }
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const currentIndex = focusableElements.indexOf(document.activeElement);

      // Arrow navigation
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        
        let nextIndex;
        if (currentIndex === -1) {
          nextIndex = event.key === "ArrowDown" ? 0 : focusableElements.length - 1;
        } else {
          if (event.key === "ArrowDown") {
            nextIndex = (currentIndex + 1) % focusableElements.length;
          } else {
            nextIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
          }
        }
        focusableElements[nextIndex]?.focus();
        return;
      }

      // Tab focus trapping
      if (!trapFocus || event.key !== "Tab") return;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && (document.activeElement === lastElement || currentIndex === -1)) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [open, trapFocus, closeAndRestoreFocus]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e) => {
      const target = e.target;
      if (
        popoverRef.current?.contains(target) ||
        anchor.current?.contains(target)
      ) {
        return;
      }
      close();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open, close, anchor]);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      {!isControlled && (
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={(e) => {
            toggle();
            e.stopPropagation();
          }}
          className={triggerClassName}
        >
          {trigger}
        </button>
      )}

      {open &&
        createPortal(
          <div
            ref={popoverRef}
            id={id}
            role={role}
            aria-labelledby={labelledBy}
            tabIndex={-1}
            className="fixed z-999"
          >
            {typeof children === "function" ? children({ close, closeAndRestoreFocus }) : children}
          </div>,
          document.body,
        )}
    </>
  );
};

export default Popover;
