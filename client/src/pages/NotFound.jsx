import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main className="h-dvh flex-center">
      <div className="text-center max-w-xs">
        <h1 className="text-lg font-semibold">We couldn't find that page</h1>

        <p className="text-sm text-(--text-2) mt-2 mb-5">
          The page may have been moved, deleted, or the link may be incorrect.
        </p>

        <Link
          to="/dashboard"
          className="text-sm px-3 py-1.5 rounded-md border-[0.5px] border-(--border-2) hover:bg-(--surface-3)"
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
