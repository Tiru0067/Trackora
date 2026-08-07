import AuthBranding from "./AuthBranding";
import Logo from "@/assets/trend-up.svg?react";
import ThemeToggle from "@/components/ui/ThemeToggle";

const Auth = ({ children }) => {
  return (
    <div className="w-full h-dvh flex">
      <div className="hidden lg:flex min-w-123 max-w-[45%] grow lg:items-center shrink-0 h-full bg-(--bg-warm) border-r dark:border-white/5 border-black/5">
        <AuthBranding />
      </div>
      <main className="flex-1 h-full flex flex-col items-center justify-center p-6 sm:p-10 overflow-y-auto relative">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
          <ThemeToggle buttonStyle="p-3 rounded-full bg-(--line-soft) hover:bg-(--line) text-(--ink-soft) transition-colors" />
        </div>

        <div className="w-full max-w-sm flex lg:hidden items-center gap-2 mb-8">
          <span className="bg-(--accent) w-7 h-7 flex items-center justify-center rounded-lg">
            <Logo className="size-4.5 text-white" />
          </span>
          <span className="text-xl font-semibold tracking-tight text-(--accent-ink)">
            Trackora
          </span>
        </div>

        {children}
      </main>
    </div>
  );
};

export default Auth;
