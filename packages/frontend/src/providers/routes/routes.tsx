// Import external dependencies
import { Routes, Route } from 'react-router-dom';

// Import layouts
import AuthLayout from '@/layouts/auth-layout';
import AppLayout from '@/layouts/app-layout';

// Import pages - Auth
import Signin from '@/pages/auth/signin';
import Signup from '@/pages/auth/signup';
import ForgotPassword from '@/pages/auth/forgot-password';
import OAuthHandler from '@/pages/auth/oauth';
import ChangePassword from '@/pages/auth/change-password';

// Import pages - Activity
import {
  MyActivityPage,
  CreateActivityPage,
  ViewActivityPage,
  EditActivityPage
} from '@/pages/activity';

// Import pages - Profile
import UserProfileCard from '@/pages/profile/profile-card';
import UpdateProfilePage from '@/pages/profile/update-profile';

// Import pages - Other
import Onboarding from '@/pages/onboarding/onboarding';
import Dashboard from '@/pages/dashhboard/dashboard';
import NotFound from '@/pages/not-found/not-found';

// Import utilities
import ProtectedRoute from './protected-routes';

// Import components
import { Suspense } from 'react';
import { LoadingFallback } from '@/components/common/loading-fallback';

const Router = () => (
  <Routes>
    {/* Auth routes wrapped with AuthLayout */}
    <Route element={<AuthLayout />}>
      <Route
        path="/signin"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <Signin />
          </Suspense>
        }
      />
      <Route
        path="/signup"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <Signup />
          </Suspense>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ForgotPassword />
          </Suspense>
        }
      />
      <Route
        path="/oauth"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <OAuthHandler />
          </Suspense>
        }
      />
    </Route>

    {/* Protected routes wrapped with ProtectedRoute */}
    <Route element={<ProtectedRoute />}>
      {/* Protected routes with AppLayout */}
      <Route element={<AppLayout />}>
        <Route
          path="/"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Dashboard />
            </Suspense>
          }
        />
        <Route
          path="/onboarding"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Onboarding />
            </Suspense>
          }
        />
        <Route
          path="/activity"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <MyActivityPage />
            </Suspense>
          }
        />
        <Route
          path="/activity/create"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <CreateActivityPage />
            </Suspense>
          }
        />
        <Route
          path="/activity/:id"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ViewActivityPage />
            </Suspense>
          }
        />
        <Route
          path="/activity/:id/update"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <EditActivityPage />
            </Suspense>
          }
        />
        <Route
          path="/profile"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <UserProfileCard />
            </Suspense>
          }
        />
        <Route
          path="/profile/update"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <UpdateProfilePage />
            </Suspense>
          }
        />
        <Route
          path="/change-password"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ChangePassword />
            </Suspense>
          }
        />
      </Route>
    </Route>

    {/* Fallback route for unmatched paths */}
    <Route
      path="*"
      element={
        <Suspense fallback={<LoadingFallback />}>
          <NotFound />
        </Suspense>
      }
    />
  </Routes>
);

export default Router;
