import { useAuth } from "@/features/auth/hooks/useAuth";

const DashboardPage = () => {
  const { user } = useAuth();
  
  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div>
      <header className="page-header">
        <span className="page-section">Home</span>
        <h1 className="page-title">Welcome back, {user?.name || 'User'}</h1>
        <p className="page-subtitle">{today}</p>
      </header>
      
      <div className="p-4 rounded-xl border border-(--line) bg-(--bg-card)">
        <p className="text-(--ink-soft)">Dashboard content will go here.</p>
      </div>
    </div>
  );
};

export default DashboardPage;
