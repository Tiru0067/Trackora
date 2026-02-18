import WalletList from "../../components/wallets/WalletList";

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
        <h3 className="font-medium text-base text-neutral-500 dark:text-neutral-500 truncate">
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
    <div className="w-full h-full flex max-md:flex-col gap-9 overflow-y-auto hide-scrollbar">
      {/* Wallet Overview */}
      <Section
        title={"Overview"}
        className="md:w-2/5 p-5 h-fit rounded-xl bg-neutral-100 dark:bg-neutral-900"
        btnClassName="hidden"
      >
        <p>Wallet Overview</p>
      </Section>

      {/* Wallets */}
      <Section
        title={"Your Wallets"}
        buttonText={"Add Wallet"}
        className="md:w-3/5 mb-8"
      >
        <WalletList />
      </Section>
    </div>
  );
};

export default Wallets;
