import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Pin, PinOff, EllipsisVertical, Edit2 } from "lucide-react";
import * as Icons from "@phosphor-icons/react";
import { motion as Motion } from "motion/react";
import Popover from "@/components/ui/Popover";
import { formatCompact } from "@/utils/currency";
import { getWalletSummary } from "../utils/walletCalculation";

// Helper component for Icon
const WalletIcon = ({ value, color }) => {
  if (!value) return <span className="text-zinc-400 text-sm">?</span>;
  if (value.type === "emoji") {
    return <span className="text-xs">{value.value}</span>;
  }
  const Icon = Icons[value.value];
  if (!Icon) return <span className="text-zinc-400 text-sm">?</span>;
  return <Icon aria-hidden="true" size={16} color={color} />;
};

const WalletCard = ({ wallet, togglePinWallet, handleEdit }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const triggerRef = useRef(null);

  const { totalBalance } = getWalletSummary(wallet, []);

  return (
    <Motion.li
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="relative bg-(--bg-card) border border-(--line) hover:border-(--line-soft) rounded-xl shadow-sm hover:shadow-md transition-shadow group"
    >
      <button
        type="button"
        onClick={() => navigate(`/wallets/${wallet.id}`)}
        className="w-full h-full p-3 flex flex-col gap-3 items-start text-left cursor-pointer rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
        aria-label={`View details for ${wallet.name}`}
      >
        <div className="w-full flex justify-between items-center pr-8">
          <span
            aria-hidden="true"
            className="w-7 h-7 flex items-center justify-center rounded-lg"
            style={{ background: `${wallet.color}33` }}
          >
            <WalletIcon value={wallet.icon} color={wallet.color} />
          </span>

          <span className="flex items-center gap-2">
            {wallet.pinnedAt && (
              <Pin
                aria-label="Pinned wallet"
                className="size-3.5 rotate-45 text-(--ink-muted)"
              />
            )}
          </span>
        </div>

        <span className="w-full flex flex-col gap-1">
          <span className="text-[13px] font-medium text-(--ink-soft) truncate">
            {wallet.name}
          </span>

          <span className="text-[15px] font-semibold text-(--ink) whitespace-nowrap tracking-tight">
            {formatCompact(totalBalance, wallet.currency)}
          </span>
        </span>
      </button>

      {/* Action Menu Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsMenuOpen((prev) => !prev);
        }}
        className="absolute top-3 right-3 p-1.5 rounded-md text-(--ink-muted) transition-opacity hover:text-(--ink) hover:bg-(--line-soft)"
      >
        <EllipsisVertical size={16} />
      </button>

      <Popover
        open={isMenuOpen}
        onOpenChange={setIsMenuOpen}
        anchorRef={triggerRef}
        placement="bottom-end"
      >
        {({ close }) => (
          <ul className="bg-(--bg-card) border border-(--line) rounded-xl shadow-lg p-1.5 min-w-40 flex flex-col gap-1">
            <li>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePinWallet(wallet.id);
                  close();
                }}
                className="w-full flex items-center gap-2 text-left px-3 py-1.5 text-sm text-(--ink) hover:bg-(--line-soft) rounded-lg transition-colors"
              >
                {wallet.pinnedAt ? <PinOff size={14} /> : <Pin size={14} />}
                <span>{wallet.pinnedAt ? "Unpin wallet" : "Pin wallet"}</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(wallet);
                  close();
                }}
                className="w-full flex items-center gap-2 text-left px-3 py-1.5 text-sm text-(--ink) hover:bg-(--line-soft) rounded-lg transition-colors"
              >
                <Edit2 size={14} />
                <span>Edit Wallet</span>
              </button>
            </li>
          </ul>
        )}
      </Popover>
    </Motion.li>
  );
};

export default WalletCard;
