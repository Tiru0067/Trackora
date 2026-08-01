import { useCallback, useState } from "react";

export function useListNavigation({
  itemCount,
  onSelect,
  onClose,
  loop = false,
  initialIndex = -1,
}) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const reset = useCallback(() => setActiveIndex(initialIndex), [initialIndex]);

  const onKeyDown = useCallback(
    (e) => {
      if (!itemCount) return;

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          setActiveIndex((prev) => {
            const next = prev + 1;
            if (next >= itemCount) return loop ? 0 : itemCount - 1;
            return next;
          });
          break;
        }

        case "ArrowUp": {
          e.preventDefault();
          setActiveIndex((prev) => {
            const next = prev - 1;
            if (next < 0) return loop ? itemCount - 1 : 0;
            return next;
          });
          break;
        }

        case "Enter": {
          e.preventDefault();
          if (activeIndex >= 0) onSelect?.(activeIndex);
          break;
        }

        case "Escape": {
          onClose?.();
          break;
        }
      }
    },
    [itemCount, activeIndex, onSelect, onClose, loop],
  );

  return {
    activeIndex,
    setActiveIndex,
    reset,
    onKeyDown,
  };
}
