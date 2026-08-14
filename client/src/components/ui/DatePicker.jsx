import { format } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import { cn } from "@/utils/cn";
import Popover from "./Popover";

const DatePicker = ({ value, onChange, className, disabled, id, name }) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);

  // add time to parse as local date instead of UTC so the day doesn't shift
  const dateValue = value ? new Date(`${value}T00:00:00`) : undefined;

  const emit = (date) => {
    const formatted = date ? format(date, "yyyy-MM-dd") : "";
    onChange?.({ target: { name, value: formatted } });
  };

  const handleSelect = (date) => {
    if (date) emit(date);
    setOpen(false);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full bg-transparent border border-(--line) rounded-lg px-3 h-10 outline-none focus:border-(--accent) focus:ring-1 focus:ring-(--accent) transition-all text-[13.5px] flex items-center justify-between",
          dateValue ? "text-(--ink)" : "text-(--ink-muted)",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
      >
        <span>
          {dateValue ? format(dateValue, "MMM d, yyyy") : "Pick a date"}
        </span>
        <CalendarIcon size={16} className="text-(--ink-muted)" />
      </button>

      <Popover
        open={open}
        onOpenChange={setOpen}
        anchorRef={triggerRef}
        placement="bottom-start"
      >
        <div className="bg-(--bg-elevated) border border-(--line) rounded-xl shadow-lg p-3 z-10 w-auto overflow-hidden">
          <DayPicker
            mode="single"
            selected={dateValue}
            onSelect={handleSelect}
            showOutsideDays
            components={{
              IconLeft: (props) => <ChevronLeft size={16} {...props} />,
              IconRight: (props) => <ChevronRight size={16} {...props} />,
            }}
          />

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-(--line-soft) px-1">
            <button
              type="button"
              onClick={() => {
                emit(null);
                setOpen(false);
              }}
              className="text-[12.5px] text-(--ink-muted) hover:text-(--ink) transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleSelect(new Date())}
              className="text-[12.5px] font-medium text-(--accent) hover:opacity-80 transition-opacity"
            >
              Today
            </button>
          </div>
        </div>
      </Popover>
    </>
  );
};

export default DatePicker;
