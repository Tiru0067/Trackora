import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency, formatCompact } from "@/utils/currency";
import { useAuth } from "@/features/auth/hooks/useAuth";

const CustomTooltip = ({ active, payload, label, currency }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-(--bg) border border-(--line) p-3 rounded-lg shadow-lg">
        <p className="text-sm text-(--ink-soft) mb-2 font-medium">{label}</p>
        {payload.map((entry, index) => {
          const displayValue =
            entry.dataKey === "expense" && entry.value > 0
              ? -entry.value
              : entry.value;
          return (
            <p
              key={index}
              className="text-sm font-semibold flex justify-between gap-6"
              style={{ color: entry.color }}
            >
              <span>{entry.name}:</span>
              <span>{formatCurrency(displayValue, currency)}</span>
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

export const DashboardCharts = ({ data }) => {
  const { user } = useAuth();
  const currency = user?.baseCurrency || "USD";

  const chartDataWithSaving = data.chartData.map((d) => ({
    ...d,
    saving: d.income - d.expense,
  }));

  return (
    <figure className="bg-(--bg-card) border border-(--line) rounded-2xl p-5 shadow-sm w-full flex flex-col m-0">
      <figcaption className="flex justify-between items-center mb-6">
        <h3 className="text-base font-semibold text-(--ink) tracking-tight">
          Money Flow
        </h3>
        <div className="flex items-center gap-4 text-[13px] text-(--ink-soft)">
          <div className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"
              aria-hidden="true"
            />
            <span>Total Expense</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full bg-(--ink)"
              aria-hidden="true"
            />
            <span>Total Saving</span>
          </div>
        </div>
      </figcaption>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartDataWithSaving}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--line)"
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "var(--ink-soft)" }}
              axisLine={{ stroke: "var(--line)" }}
              tickLine={{ stroke: "var(--line)" }}
              tickMargin={15}
              minTickGap={30}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--ink-soft)" }}
              axisLine={{ stroke: "var(--line)" }}
              tickLine={{ stroke: "var(--line)" }}
              tickFormatter={(val) => formatCompact(val, currency)}
            />
            <Tooltip
              content={<CustomTooltip currency={currency} />}
              cursor={{ stroke: "var(--line)", strokeWidth: 1 }}
            />

            <Line
              type="monotone"
              dataKey="saving"
              name="Total Saving"
              stroke="var(--ink)"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 5,
                fill: "var(--ink)",
                stroke: "var(--bg)",
                strokeWidth: 2,
              }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              name="Total Expense"
              stroke="#EF4444"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{
                r: 5,
                fill: "#EF4444",
                stroke: "var(--bg)",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
};
