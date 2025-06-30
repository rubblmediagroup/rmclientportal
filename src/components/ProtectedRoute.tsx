import { useAppContext } from "@/contexts/AppContext";
import { Navigate } from "react-router-dom";
import Navigation from "./Navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'client' | 'any';
}

const ProtectedRoute = ({ children, requiredRole = 'any' }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAppContext();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (requiredRole === 'admin') {
    const isAdmin = user.role === 'agency_admin' || user.role === 'super_admin' || user.role === 'team_member';
    if (!isAdmin) {
      return <Navigate to="/client" replace />;
    }
  }

  if (requiredRole === 'client') {
    const isClient = user.role === 'client_admin' || user.role === 'client_user';
    if (!isClient) {
      return <Navigate to="/admin" replace />;
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 lg:ml-64 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default ProtectedRoute;