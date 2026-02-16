import { useContext } from "react";
import { EllipsisVertical } from "lucide-react";
import CategoryContext from "../../context/CategoryContext";
import WalletContext from "../../context/WalletContext";

const TransactionItem = ({ txn }) => {
  const { categories } = useContext(CategoryContext);
  const { wallets } = useContext(WalletContext);

  const currency = (id) => {
    return wallets.map((w) => (w.id === id ? w.currency : ""));
  };

  const category = (id) => {
    return categories.find((c) => c.id === id);
  };

  return (
    <li className="flex items-center gap-4 px-4 py-3 rounded-xl bg-neutral-200/60 dark:bg-neutral-900">
      <div className="w-10 h-10 text-sm flex-center rounded-full bg-neutral-300 dark:bg-neutral-800">
        {category(txn?.categoryId)?.icon}
      </div>
      <div className="min-w-40">
        <h5 className="text-base md:text-lg font-semibold text-neutral-800 dark:text-neutral-200 whitespace-nowrap tracking-tight">
          {txn.amount}
          <span className="ml-1 text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {currency(txn.walletId)}
          </span>
        </h5>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {txn.description}
        </p>
      </div>
      <div className="ml-auto">
        <button
          type="button"
          className="w-10 h-10 rounded-full flex-center hover:bg-neutral-300 hover:dark:bg-neutral-800"
        >
          <EllipsisVertical size={18} />
        </button>
      </div>
    </li>
  );
};

export default TransactionItem;
