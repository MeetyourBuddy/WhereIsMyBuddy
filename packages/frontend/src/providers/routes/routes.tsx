import { Routes, Route } from 'react-router-dom';
import Signin from '@/pages/auth/signin';
import ChangePassword from '@/pages/auth/change-password';
import Signup from '@/pages/auth/signup';
import Forgotpassword from '@/pages/auth/forgot-password';
import ProtectedRoute from './protected-routes';
import NotFound from '@/pages/not-found/not-found';
import Onboarding from '@/pages/onboarding/onboarding';
import OAuthHandler from '@/pages/auth/oauth';

const Router = () => (
  <Routes>
    <Route path="/signin" element={<Signin />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/oauth" element={<OAuthHandler />} />
    <Route path="/forgot-password" element={<Forgotpassword />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<div>Home</div>} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/change-password" element={<ChangePassword />} />
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default Router;
