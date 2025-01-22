// Import external dependencies
import { Routes, Route } from 'react-router-dom';

// Import layouts
import AuthLayout from '@/layouts/auth-layout';
import BaseLayout from '@/layouts/base-layout';

// Import pages - Auth
import Signin from '@/pages/auth/signin';
import Signup from '@/pages/auth/signup';
import ForgotPassword from '@/pages/auth/forgot-password';
import OAuthHandler from '@/pages/auth/oauth';
import ChangePassword from '@/pages/auth/change-password';

// Import pages - Activity
import { MyActivityPage, CreateActivityPage, ViewActivityPage } from '@/pages/activity';

// Import pages - Profile
import UserProfileCard from '@/pages/profile/profile-card';
import UpdateProfilePage from '@/pages/profile/update-profile';

// Import pages - Other
import Onboarding from '@/pages/onboarding/onboarding';
import Dashboard from '@/pages/dashhboard/dashboard';
import NotFound from '@/pages/not-found/not-found';

// Import utilities
import ProtectedRoute from './protected-routes';

const Router = () => (
  <Routes>
    {/* Auth routes wrapped with AuthLayout */}
    <Route element={<AuthLayout />}>
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/oauth" element={<OAuthHandler />} />
    </Route>

    {/* Protected routes wrapped with ProtectedRoute */}
    <Route element={<ProtectedRoute />}>
      {/* Protected routes with BaseLayout */}
      <Route element={<BaseLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/activity" element={<MyActivityPage />} />
        <Route path="/activity/create" element={<CreateActivityPage />} />
        <Route path="/activity/:id" element={<ViewActivityPage />} />
        <Route path="/profile" element={<UserProfileCard />} />
        <Route path="/profile/update" element={<UpdateProfilePage />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Route>
    </Route>

    {/* Fallback route for unmatched paths */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default Router;
