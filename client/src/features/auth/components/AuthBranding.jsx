import { TrendingUp, Target, ShieldCheck } from "lucide-react";
import Logo from "../../../assets/trend-up.svg?react";

const features = [
  {
    icon: TrendingUp,
    title: "Track your money",
    description: "Log income, expenses, wallets, and categories in one place.",
  },
  {
    icon: Target,
    title: "Plan your budget",
    description: "Set limits, manage goals, and stay ahead of overspending.",
  },
  {
    icon: ShieldCheck,
    title: "Private & secure",
    description: "Your financial data stays protected and under your control.",
  },
];

const AuthBranding = () => {
  return (
    <aside
      aria-labelledby="auth-branding-title"
      className="min-w-100 w-full h-full flex-center flex-col"
    >
      <div className="max-w-120 p-10">
        <div>
          <div className="flex items-center gap-2 mb-12">
            <span className="bg-(--accent) w-7 h-7 flex-center rounded-lg">
              <Logo className="size-4.5 text-(--bg-warm)" />
            </span>

            <span className="text-xl font-semibold tracking-tight text-(--accent-ink)">
              Trackora
            </span>
          </div>

          <div>
            <h2
              id="auth-branding-title"
              className="text-2xl font-medium text-(--ink-soft) leading-relaxed mb-2"
            >
              Take control of your finances
            </h2>

            <p className="text-base text-(--ink-soft)/75 leading-relaxed mb-10">
              Track spending, set budgets, and reach your goals — all in one
              place.
            </p>

            <ul className="flex flex-col gap-6">
              {features.map(({ icon, title, description }) => {
                const Icon = icon;

                return (
                  <li key={title} className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl bg-(--accent)/20 flex items-center justify-center shrink-0 mt-0.5"
                      aria-hidden="true"
                    >
                      <Icon size={18} className="text-(--accent)" />
                    </div>

                    <div>
                      <h3 className="text-[15px] font-medium text-(--ink-soft) mb-0.5">
                        {title}
                      </h3>

                      <p className="text-sm text-(--ink-soft)/75 leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <footer className="w-full mt-20">
          <small className="text-xs text-(--ink-muted)">
            &copy; 2026 Trackora
          </small>
        </footer>
      </div>
    </aside>
  );
};

export default AuthBranding;
