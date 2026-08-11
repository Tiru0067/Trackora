import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import LoadingThreeDots from "@/components/ui/LoadingThreeDots";

const ProtectedRoute = () => {
  const { loading, user } = useAuth();

  if (loading) {
    return <LoadingThreeDots />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
