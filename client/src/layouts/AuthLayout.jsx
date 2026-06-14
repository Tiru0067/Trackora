import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <main className="flex min-w-[320px] h-dvh bg-(--surface-0)">
      <Outlet />
    </main>
  );
};

export default AuthLayout;
