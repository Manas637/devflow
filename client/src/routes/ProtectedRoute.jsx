import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/store/auth";

export default function ProtectedRoute() {
  const location = useLocation();

  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return <Outlet />;
}