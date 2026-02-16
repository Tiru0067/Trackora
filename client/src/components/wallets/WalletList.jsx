import WalletContext from "../../context/WalletContext";
import { useContext } from "react";

const WalletList = () => {
  const { wallets } = useContext(WalletContext);
  return (
    <ul className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
      {wallets.map((wallet) => (
        <li
          key={wallet.id}
          className="w-full max-w-90 px-4 py-3 rounded-xl bg-white dark:bg-neutral-900 border-2 border-neutral-300 dark:border-transparent hover:shadow-md dark:shadow-black hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <h4 className="text-sm text-neutral-500">{wallet.name}</h4>
          <p className="text-lg md:text-xl font-semibold text-black dark:text-neutral-200 whitespace-nowrap tracking-tight">
            {wallet.balance}
            <span className="ml-1 text-sm font-medium text-neutral-500 dark:text-neutral-400">
              {wallet.currency}
            </span>
          </p>
        </li>
      ))}
    </ul>
  );
};

export default WalletList;
