import React, { useEffect } from "react";
import { useAuth } from "@/store/auth.store";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { initializeAuth, isInitialized } = useAuth();

  useEffect(() => {
    if (!isInitialized) {
      console.log("🚀 App starting - initializing authentication...");
      initializeAuth();
    }
  }, [initializeAuth, isInitialized]);

  // Show loading while auth is initializing
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-buddy-purple border-t-transparent" />
          <p className="text-buddy-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
