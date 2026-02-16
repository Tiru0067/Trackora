import WalletList from "../../components/wallets/WalletList";
import TransactionList from "../../components/wallets/TransactionList";
import { Plus } from "lucide-react";

const Section = ({
  title,
  buttonText,
  onClick,
  className = "",
  btnClassName = "btn btn-secondary",
  children,
}) => {
  return (
    <section className={`max-md:mb-6 ${className}`}>
      <div className="mb-3 flex justify-between items-center">
        <h3 className="font-medium text-base text-neutral-500 dark:text-neutral-500">
          {title}
        </h3>
        <button type="button" className={btnClassName} onClick={onClick}>
          {buttonText}
        </button>
      </div>

      {children}
    </section>
  );
};

const Wallets = () => {
  return (
    <div className="w-full h-full flex flex-row-reverse max-md:flex-col gap-9">
      <div className="md:w-2/5">
        {/* Wallets */}
        <Section
          title={"Your Wallets"}
          buttonText={"Add Wallet"}
          className="mb-8"
        >
          <WalletList />
        </Section>

        {/* Subscriptions */}
        <Section
          title={"Subscriptions"}
          buttonText={<Plus size={16} />}
          className="p-5 rounded-xl bg-neutral-100 dark:bg-neutral-900"
          btnClassName="w-10 h-10 flex-center rounded-full hover:bg-neutral-200 hover:dark:bg-neutral-800"
        >
          <p>No Subscriptions</p>
        </Section>
      </div>

      {/* Transactions */}
      <Section
        title={"All Transactions"}
        buttonText={"Add Transaction"}
        className="md:w-3/5 flex flex-col"
      >
        <TransactionList />
      </Section>
    </div>
  );
};

export default Wallets;
