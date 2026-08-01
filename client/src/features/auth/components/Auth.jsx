import AuthBranding from "./AuthBranding";

const Auth = ({ children }) => {
  return (
    <div className="w-full h-dvh flex">
      <div className="hidden lg:flex min-w-123 max-w-[45%] grow lg:items-center shrink-0 h-full bg-(--bg-warm) border-r dark:border-white/5 border-black/5">
        <AuthBranding />
      </div>
      <main className="flex-1 h-full flex items-center justify-center p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Auth;
