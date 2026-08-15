import { WifiSlash } from "@phosphor-icons/react";

const OfflinePage = ({ onRetry }) => {
  return (
    <main className="h-dvh flex-center">
      <div className="text-center max-w-xs flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-(--line-soft) flex-center mb-4 text-(--ink-soft)">
          <WifiSlash size={24} weight="regular" />
        </div>
        <h1 className="text-lg font-semibold">You are offline</h1>

        <p className="text-sm text-(--ink-soft) mt-2 mb-5">
          We couldn't connect to the server. Please check your internet connection and try again.
        </p>

        {onRetry ? (
          <button
            onClick={onRetry}
            className="text-sm px-4 py-2 rounded-md bg-(--accent) text-black font-medium hover:opacity-90 cursor-pointer"
          >
            Try again
          </button>
        ) : (
          <button
            onClick={() => window.location.reload()}
            className="text-sm px-4 py-2 rounded-md bg-(--accent) text-black font-medium hover:opacity-90 cursor-pointer"
          >
            Refresh page
          </button>
        )}
      </div>
    </main>
  );
};

export default OfflinePage;
