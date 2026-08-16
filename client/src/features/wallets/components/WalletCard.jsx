
import { useNavigate } from "react-router-dom";
import { Pin, PinOff, EllipsisVertical, Edit2 } from "lucide-react";
import * as Icons from "@phosphor-icons/react";
import { motion as Motion } from "motion/react";
import DropdownMenu from "@/components/ui/DropdownMenu";
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
        className="w-full h-full p-3 flex flex-col gap-3 items-start text-left cursor-pointer rounded-xl"
        aria-label={`View details for ${wallet.name}`}
      >
        <div className="w-full flex justify-between items-center pr-8">
          <span
            aria-hidden="true"
            className="w-7 h-7 flex items-center justify-center rounded-lg"
            style={{ background: `${wallet.color}22` }}
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
      <DropdownMenu
        placement="bottom-end"
        trigger={
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="btn btn-icon absolute top-2 right-2 h-7 w-7 min-w-7"
          >
            <EllipsisVertical size={16} />
          </button>
        }
        items={[
          {
            id: "pin",
            label: wallet.pinnedAt ? "Unpin Wallet" : "Pin Wallet",
            icon: wallet.pinnedAt ? <PinOff size={14} /> : <Pin size={14} />,
            onClick: (e) => {
              e.stopPropagation();
              togglePinWallet(wallet.id);
            },
          },
          {
            id: "edit",
            label: "Edit Wallet",
            icon: <Edit2 size={14} />,
            onClick: (e) => {
              e.stopPropagation();
              handleEdit(wallet.id);
            },
          },
        ]}
      />
    </Motion.li>
  );
};

export default WalletCard;
