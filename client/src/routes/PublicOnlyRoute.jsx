import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/features/auth/hooks/useAuth";
import LoadingThreeDotsJumping from "@/components/ui/LoadingThreeDots";

const PublicOnlyRoute = () => {
  const { loading, user } = useAuth();

  if (loading) {
    return <LoadingThreeDotsJumping />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;
