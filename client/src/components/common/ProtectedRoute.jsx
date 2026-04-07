import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { LoginPage } from "../RouteNames/RouteName";

// Wrap any route that requires the user to be logged in.
// If not authenticated, redirects to /login and comes back after login.
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={LoginPage} replace />;
  }

  return children;
};

export default ProtectedRoute;
