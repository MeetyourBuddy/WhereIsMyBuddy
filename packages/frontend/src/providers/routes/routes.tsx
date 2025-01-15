import { Routes, Route } from 'react-router-dom';
import Signin from '@/pages/auth/signin';
import ChangePassword from '@/pages/auth/change-password';
import Signup from '@/pages/auth/signup';
import Forgotpassword from '@/pages/auth/forgot-password';
import ProtectedRoute from './protected-routes';
import NotFound from '@/pages/not-found/not-found';
import Onboarding from '@/pages/onboarding/onboarding';
import OAuthHandler from '@/pages/auth/oauth';
import AuthLayout from '@/layouts/auth-layout';
import BaseLayout from '@/layouts/base-layout';
import ProfilePage from '@/pages/profile/profile';
import Dashboard from '@/pages/dashhboard/dashboard';
import Activity from '@/pages/activity/activity';
import UserProfileCard from '@/pages/profile/profile-card';

const Router = () => (
  <Routes>
    {/* Auth routes with AuthLayout */}
    <Route element={<AuthLayout />}>
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/oauth" element={<OAuthHandler />} />
      <Route path="/forgot-password" element={<Forgotpassword />} />
    </Route>

    {/* Protected routes with BaseLayout */}
    <Route element={<ProtectedRoute />}>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route element={<BaseLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/card" element={<UserProfileCard />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Route>
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default Router;
