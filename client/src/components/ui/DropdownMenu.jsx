import React, { useRef, useState } from "react";
import Popover from "./Popover";

const DropdownMenu = ({ trigger, items, groups, placement = "bottom-end", minWidth = "min-w-40" }) => {
  const triggerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // Normalize items to groups
  const normalizedGroups = groups || (items ? [items] : []);

  // Filter out any empty groups
  const validGroups = normalizedGroups.filter(group => group && group.length > 0);

  const clonedTrigger = React.cloneElement(trigger, {
    ref: triggerRef,
    onClick: (e) => {
      setIsOpen((prev) => !prev);
      if (trigger.props.onClick) {
        trigger.props.onClick(e);
      }
    },
    "aria-haspopup": "menu",
    "aria-expanded": isOpen,
  });

  return (
    <>
      {clonedTrigger}
      <Popover
        open={isOpen}
        onOpenChange={setIsOpen}
        anchorRef={triggerRef}
        placement={placement}
      >
        {({ close, closeAndRestoreFocus }) => (
          <menu className={`dropdown-content m-0 ${minWidth}`}>
            {validGroups.map((group, groupIndex) => (
              <React.Fragment key={groupIndex}>
                {group.map((item) => {
                  if (item.type === "label") {
                    return (
                      <li key={item.id} role="presentation">
                        <div className="px-2 py-1 text-xs font-medium text-(--ink-muted) uppercase tracking-wider">
                          {item.label}
                        </div>
                      </li>
                    );
                  }

                  return (
                    <li key={item.id} role="none">
                      <button
                      type="button"
                      role="menuitem"
                      onClick={(e) => {
                        item.onClick?.(e);
                        if (item.autoClose !== false) {
                          closeAndRestoreFocus();
                        }
                      }}
                      className={`dropdown-item ${item.danger ? "!text-red-500 hover:!bg-red-500/10" : ""}`}
                    >
                      <span className="flex items-center gap-2">
                        {item.icon && <span className={`flex-shrink-0 ${item.danger ? "" : "text-(--ink-muted)"}`}>{item.icon}</span>}
                        {item.label}
                      </span>
                      {item.rightElement && (
                        <span className="flex-shrink-0">{item.rightElement}</span>
                      )}
                    </button>
                  </li>
                );
              })}
              {/* Render divider between groups */}
                {groupIndex < validGroups.length - 1 && (
                  <div className="h-px bg-(--line) my-1 mx-2" role="presentation" />
                )}
              </React.Fragment>
            ))}
          </menu>
        )}
      </Popover>
    </>
  );
};

export default DropdownMenu;
