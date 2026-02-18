import WalletContext from "../../context/WalletContext";
import { useContext } from "react";
import { Pin, Crown, ArrowRight } from "lucide-react";
import { motion as Motion } from "motion/react";
import { useNavigate } from "react-router-dom";

const WalletList = () => {
  const { wallets, togglePinWallet, selectedWalletId, setSelectedWalletId } =
    useContext(WalletContext);

  const navigate = useNavigate();

  const isWalletActive = (id) => selectedWalletId === id;

  const activeWalletClass =
    "bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-500 shadow-sm";
  const defaultWalletClass = "bg-neutral-100 dark:bg-neutral-900 shadow-sm";

  const handlePinClick = (e, walletId) => {
    e.stopPropagation();
    togglePinWallet(walletId);
  };

  return (
    <ul className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
      {wallets.map((wallet) => (
        <Motion.li
          key={wallet.id}
          layout
          transition={{
            duration: 0.22,
            ease: [0.4, 0, 0.2, 1],
          }}
          className={`w-full max-w-90 px-4 py-3 flex flex-col gap-2 items-start rounded-xl cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all ${isWalletActive(wallet.id) ? activeWalletClass : defaultWalletClass}`}
          onClick={() => setSelectedWalletId(wallet.id)}
        >
          <div className="w-full flex items-center justify-between gap-3">
            <button
              type="buton"
              className={`text-sm truncate hover:text-emerald-500 ${isWalletActive(wallet.id) ? "text-emerald-700 dark:text-emerald-500" : "text-neutral-700 dark:text-neutral-300"}`}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/wallets/${wallet.id}`);
              }}
            >
              {wallet.name}
            </button>
            {/* Show pinned status */}
            <button
              type="button"
              onClick={
                wallet.primary ? null : (e) => handlePinClick(e, wallet.id)
              }
            >
              {wallet.primary ? (
                <Crown className="text-yellow-500 " size={15} />
              ) : wallet.pinned ? (
                <Pin className="text-emerald-500" size={15} />
              ) : (
                <Pin className="text-neutral-500" size={15} />
              )}
            </button>
          </div>

          <p className="text-lg md:text-xl font-semibold text-black dark:text-neutral-200 whitespace-nowrap tracking-tight">
            {wallet.balance}
            <span className="ml-1 text-sm font-medium text-neutral-500 dark:text-neutral-400">
              {wallet.currency}
            </span>
          </p>
        </Motion.li>
      ))}
    </ul>
  );
};

export default WalletList;
