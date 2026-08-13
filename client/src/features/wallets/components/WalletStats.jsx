import { formatCompact } from "@/utils/currency";

const WalletStats = ({
  totalWalletsCount,
  balancesByCurrency,
  uniqueCurrenciesCount,
  baseCurrencyTotal,
  baseCurrency,
}) => {
  return (
    <section
      aria-label="Wallet Statistics"
      className="mt-6 p-4 bg-(--bg-card) border border-(--line) rounded-xl text-sm font-medium text-(--ink)"
    >
      <table className="max-md:w-full w-lg table-fixed">
        <tbody>
          <tr className="text-(--ink-soft) text-xs text-left">
            <th className="font-medium pr-6">Total Wallets</th>

            <th className="font-medium px-6 border-l border-(--line)">
              Total Balance
            </th>

            <th className="font-medium pl-6 border-l border-(--line)">
              Currencies
            </th>
          </tr>

          <tr>
            <td className="pt-1 pr-6">{totalWalletsCount}</td>

            <td className="pt-1 px-6 border-l border-(--line)">
              <div className="flex items-center gap-3">
                {uniqueCurrenciesCount > 1 &&
                baseCurrencyTotal !== undefined ? (
                  <span>{formatCompact(baseCurrencyTotal, baseCurrency)}</span>
                ) : (
                  Object.entries(balancesByCurrency).map(
                    ([currency, total]) => (
                      <span key={currency}>
                        {formatCompact(total, currency)}
                      </span>
                    ),
                  )
                )}

                {totalWalletsCount === 0 && <span>$0</span>}
              </div>
            </td>

            <td className="pt-1 pl-6 border-l border-(--line)">
              {uniqueCurrenciesCount}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};

export default WalletStats;
