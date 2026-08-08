import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const WalletDetailsPage = () => {
  const { id } = useParams();

  return (
    <div>
      <header className="page-header">
        <div className="flex items-center gap-2 mb-2">
          <Link to="/wallets" className="p-1 rounded-md text-(--ink-muted) hover:text-(--ink) hover:bg-(--line-soft) transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <span className="text-[11px] font-semibold tracking-wider text-(--ink-muted) uppercase">
            § Wallet Details
          </span>
        </div>
        <h1 className="page-title">Wallet {id}</h1>
        <p className="page-subtitle">View transactions and details for this wallet</p>
      </header>
      
      <div className="p-4 rounded-xl border border-(--line) bg-(--bg-card)">
        <p className="text-(--ink-soft)">Wallet details content will go here.</p>
      </div>
    </div>
  );
};

export default WalletDetailsPage;
