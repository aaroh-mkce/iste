import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { SpinnerIcon } from "../components/Icons";
import AdminLogin from "./AdminLogin";

export function AdminGuard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <SpinnerIcon className="w-10 h-10 text-brand-500" />
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }

  return <Outlet />;
}

export default AdminGuard;
