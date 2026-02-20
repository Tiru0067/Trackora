import WalletList from "../../components/wallets/WalletList";
import WalletOverview from "../../components/wallets/WalletOverview";

const Wallets = () => {
  return (
    <div className="w-full h-full flex max-md:flex-col gap-9 overflow-y-auto hide-scrollbar">
      {/* Wallet Overview */}
      <section className="max-md:mb-6 md:w-2/5 p-5 h-fit rounded-xl bg-neutral-100 dark:bg-neutral-900">
        <WalletOverview />
      </section>

      {/* Wallets */}
      <section className="max-md:mb-6 md:w-3/5 mb-8">
        {/* Header */}
        <div className="mb-3 flex justify-between items-center">
          <h3 className="font-medium text-base text-neutral-500 dark:text-neutral-500 truncate">
            Your wallets
          </h3>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {}}
          >
            Add Wallet
          </button>
        </div>

        {/* Wallet list */}
        <WalletList />
      </section>
    </div>
  );
};

export default Wallets;
