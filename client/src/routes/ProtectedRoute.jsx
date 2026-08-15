import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import LoadingThreeDots from "@/components/ui/LoadingThreeDots";
import OfflinePage from "@/pages/OfflinePage";

const ProtectedRoute = () => {
  const { loading, user, isOffline, retryConnection } = useAuth();

  if (isOffline) {
    return <OfflinePage onRetry={retryConnection} />;
  }

  if (loading) {
    return <LoadingThreeDots />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
