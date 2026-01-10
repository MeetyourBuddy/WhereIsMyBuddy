import React from "react";
import { useAuth } from "@/store/auth.store";

const AuthDebug: React.FC = () => {
  const {
    user,
    isAuthenticated,
    isInitialized,
    clearAuthState,
    forceReinitialize,
    verifyUserWithBackend,
  } = useAuth();

  const handleClearAuth = () => {
    clearAuthState();
  };

  const handleReinitialize = () => {
    forceReinitialize();
  };

  const handleVerifyBackend = () => {
    verifyUserWithBackend();
  };

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-black/80 text-white text-xs rounded-lg z-50 max-w-sm">
      <div className="font-bold mb-2">🔍 Auth Debug</div>
      <div>Initialized: {isInitialized ? "✅" : "❌"}</div>
      <div>Authenticated: {isAuthenticated ? "✅" : "❌"}</div>
      <div>User ID (_id): {user?._id || "NULL"}</div>
      <div>User ID (id): {user?.id || "NULL"}</div>
      <div>User Name: {user?.name || "NULL"}</div>
      <div>User Email: {user?.email || "NULL"}</div>

      <div className="mt-3 space-y-1">
        <button
          onClick={handleClearAuth}
          className="w-full px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
        >
          Clear Auth
        </button>
        <button
          onClick={handleReinitialize}
          className="w-full px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
        >
          Reinitialize
        </button>
        <button
          onClick={handleVerifyBackend}
          className="w-full px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs"
        >
          Verify Backend
        </button>
      </div>
    </div>
  );
};

export default AuthDebug;
