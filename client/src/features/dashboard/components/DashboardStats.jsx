import { formatCurrency } from "@/utils/currency";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import DropdownMenu from "@/components/ui/DropdownMenu";
import { ChevronDown } from "lucide-react";

const Sparkline = ({ data, dataKey, color }) => (
  <div className="h-10 w-2/3 my-1 mx-auto">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line
          type="basis"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const PastelStatCard = ({
  title,
  amount,
  currency,
  bgClass,
  titleColor,
  amountColor,
  data,
  dataKey,
  sparklineColor,
}) => {
  return (
    <article
      className={`flex flex-col px-5 py-4 rounded-2xl shadow-xs border border-transparent ${bgClass}`}
    >
      <div className={`text-[13px] font-medium capitalize ${titleColor}`}>
        {title}
      </div>

      <Sparkline data={data} dataKey={dataKey} color={sparklineColor} />

      <div
        className={`text-[20px] font-bold tracking-tight mt-1 ${amountColor}`}
      >
        {formatCurrency(amount, currency)}
      </div>
    </article>
  );
};

export const DashboardStats = ({ data, range, setRange }) => {
  const { user } = useAuth();
  const currency = user?.baseCurrency || "USD";

  const chartDataWithSaving = data.chartData.map((d) => ({
    ...d,
    saving: d.income - d.expense,
  }));

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Top Total Balance Card (Dark Theme) */}
      <section aria-labelledby="total-balance-heading" className="bg-[#111113] rounded-2xl p-6 shadow-sm flex justify-between items-center relative overflow-hidden">
        <div className="z-10 flex flex-col">
          <h2 id="total-balance-heading" className="text-white/60 text-sm font-medium mb-1">
            Total Balance
          </h2>
          <p className="text-white text-2xl font-semibold tracking-tight m-0">
            {formatCurrency(data.netWorth, currency)}
          </p>
        </div>

        {/* Abstract background shapes */}
        <div className="absolute right-0 top-0 w-full md:w-1/2 h-full pointer-events-none opacity-30">
          <div className="absolute right-[-10%] top-[-50%] w-48 h-48 rounded-full bg-emerald-500 blur-3xl"></div>
          <div className="absolute right-[20%] bottom-[-50%] w-48 h-48 rounded-full bg-blue-500 blur-3xl"></div>
        </div>
      </section>

      {/* Financial Records */}
      <section aria-labelledby="financial-record-heading" className="flex flex-col gap-4">
        <header className="flex justify-between items-center px-1 mb-1 mt-2">
          <h3 id="financial-record-heading" className="text-base font-semibold text-(--ink) tracking-tight">
            Financial Record
          </h3>
        <DropdownMenu
          placement="bottom-end"
          minWidth="min-w-32"
          trigger={
            <button className="flex items-center gap-1.5 bg-(--bg) hover:bg-(--bg-card-hover) border border-(--line) text-(--ink) text-xs font-medium rounded-lg px-3 py-1.5 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-(--ink)/20">
              {range === "7d" ? "Week" : range === "30d" ? "Month" : "Quarter"}
              <ChevronDown size={14} className="text-(--ink-muted)" />
            </button>
          }
          items={[
            { id: "7d", label: "Week", onClick: () => setRange("7d") },
            { id: "30d", label: "Month", onClick: () => setRange("30d") },
            { id: "90d", label: "Quarter", onClick: () => setRange("90d") },
          ]}
        />
        </header>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
        <PastelStatCard
          title="Total Income"
          amount={data.monthlyIncome}
          currency={currency}
          bgClass="bg-[#eafbf3]"
          titleColor="text-slate-500"
          amountColor="text-emerald-950"
          data={chartDataWithSaving}
          dataKey="income"
          sparklineColor="#34d399"
        />
        <PastelStatCard
          title="Total Expense"
          amount={data.monthlyExpense}
          currency={currency}
          bgClass="bg-[#fff0ed]"
          titleColor="text-slate-500"
          amountColor="text-rose-950"
          data={chartDataWithSaving}
          dataKey="expense"
          sparklineColor="#fb7185"
        />
        <PastelStatCard
          title="Net Saving"
          amount={data.monthlyIncome - data.monthlyExpense}
          currency={currency}
          bgClass="bg-[#f0f5ff]"
          titleColor="text-slate-500"
          amountColor="text-blue-950"
          data={chartDataWithSaving}
          dataKey="saving"
          sparklineColor="#60a5fa"
        />
      </div>
      </section>
    </div>
  );
};
