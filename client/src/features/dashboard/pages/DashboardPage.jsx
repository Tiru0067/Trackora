import { useDashboard } from "../hooks/useDashboard";
import { DashboardStats } from "../components/DashboardStats";
import { DashboardCharts } from "../components/DashboardCharts";
import { DashboardTopCategories } from "../components/DashboardTopCategories";
import TransactionList from "@/features/transactions/components/TransactionList";
import { useNavigate } from "react-router-dom";
import Skeleton from "@/components/ui/Skeleton";

const DashboardPage = () => {
  const { data, isLoading, error, range, setRange } = useDashboard();
  const navigate = useNavigate();

  return (
    <main className="flex flex-col flex-1 w-full max-w-7xl mx-auto pb-10">
      <header className="page-header justify-between items-start sm:items-end flex-col sm:flex-row gap-4 mb-8 mt-2">
        <div>
          <span className="page-section">Dashboard</span>
          <h1 className="page-title">Overview</h1>
          <p className="page-subtitle">
            Welcome back! Here's your financial overview.
          </p>
        </div>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-6">
          {/* Left Column Skeleton */}
          <div className="flex flex-col gap-4">
            <Skeleton className="h-28 w-full rounded-2xl" />
            <div className="flex justify-between items-center px-1 mt-2">
              <Skeleton className="h-5 w-32 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4 mb-2">
              <Skeleton className="h-36 w-full rounded-2xl" />
              <Skeleton className="h-36 w-full rounded-2xl" />
              <Skeleton className="h-36 w-full rounded-2xl" />
            </div>
            <Skeleton className="h-96 w-full rounded-2xl mt-2" />
          </div>

          {/* Right Column Skeleton */}
          <div className="flex flex-col gap-6">
            <Skeleton className="h-105 w-full rounded-2xl" />
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
        </div>
      ) : error ? (
        <div className="w-full flex items-center justify-center p-12 text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">
          <p className="font-medium">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-6">
          {/* Left Column: Stats & Charts */}
          <section aria-label="Financial Overview" className="flex flex-col">
            <DashboardStats data={data} range={range} setRange={setRange} />
            <DashboardCharts data={data} />
          </section>

          {/* Right Column: Sidebar */}
          <aside
            aria-label="Recent Activity and Categories"
            className="flex flex-col"
          >
            <div className="min-h-50 w-full flex flex-col">
              <TransactionList
                transactions={data.recentTransactions.slice(0, 6)}
                isLoading={false}
                context="dashboard"
                compact={true}
                onViewAll={() => navigate("/transactions")}
              />
            </div>

            <DashboardTopCategories data={data} />
          </aside>
        </div>
      )}
    </main>
  );
};

export default DashboardPage;
