import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "@/providers/AuthProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import OnboardingWelcome from "./pages/onboarding/index";
import BasicInfo from "./pages/onboarding/BasicInfo";
import InterestSelection from "./pages/onboarding/Interests";
import ProfileCompletion from "./pages/onboarding/ProfileCompletion";
import Welcome from "./pages/Welcome";
import GettingStarted from "./pages/GettingStarted";
import CreateActivity from "./pages/activities/CreateActivity";
import ActivityPage from "./pages/activities/ActivityPage";
import Activities from "./pages/activities/index";
import Buddies from "./pages/buddies/index";
import Analytics from "./pages/Analytics";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import AppLayout from "./components/layout/AppLayout";
import ProfilePage from "./pages/profile/[id]";
import SharedActivityPage from "./pages/activity/[id]";
import PartnerInvite from "./pages/PartnerInvite";
import AdminPanel from "./pages/admin/index";
import Oauth from "./pages/Oauth";
import ImageUploadDemo from "./components/common/ImageUploadDemo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_relativeSplatPath: true }}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/oauth" element={<Oauth />} />

            {/* Welcome & Getting Started */}
            {/* <Route path="/welcome" element={<Welcome />} />
          <Route path="/getting-started" element={<GettingStarted />} /> */}

            {/* Sharable Profile and Activity Cards */}
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/activity/:id" element={<SharedActivityPage />} />

            {/* Partner Invitation */}
            <Route
              path="/invite/partner/:activityId"
              element={<PartnerInvite />}
            />

            {/* Dashboard & Core App */}
            <Route
              path="/dashboard"
              element={
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              }
            />

            {/* Activity Routes */}
            <Route
              path="/activities"
              element={
                <AppLayout>
                  <Activities />
                </AppLayout>
              }
            />
            <Route
              path="/activities/create"
              element={
                <AppLayout>
                  <CreateActivity />
                </AppLayout>
              }
            />
            <Route
              path="/activities/:activityId"
              element={
                <AppLayout>
                  <ActivityPage />
                </AppLayout>
              }
            />

            {/* Buddy Routes */}
            <Route
              path="/buddies"
              element={
                <AppLayout>
                  <Buddies />
                </AppLayout>
              }
            />

            {/* Analytics Route */}
            {/* <Route path="/analytics" element={
            <AppLayout>
              <Analytics />
            </AppLayout>
          } /> */}

            {/* Notifications Route */}
            <Route
              path="/notifications"
              element={
                <AppLayout>
                  <Notifications />
                </AppLayout>
              }
            />

            {/* Settings Route */}
            <Route
              path="/settings"
              element={
                <AppLayout>
                  <Settings />
                </AppLayout>
              }
            />

            {/* Support Route */}
            <Route
              path="/support"
              element={
                <AppLayout>
                  <Support />
                </AppLayout>
              }
            />

            {/* Admin Panel Route */}
            <Route path="/admin" element={<AdminPanel />} />

            {/* Image Upload Demo Route */}
            <Route
              path="/upload-demo"
              element={
                <AppLayout>
                  <ImageUploadDemo />
                </AppLayout>
              }
            />

            {/* Onboarding Flow */}
            <Route path="/onboarding" element={<OnboardingWelcome />} />
            <Route path="/onboarding/basic-info" element={<BasicInfo />} />
            <Route
              path="/onboarding/interests"
              element={<InterestSelection />}
            />
            <Route
              path="/onboarding/profile-completion"
              element={<ProfileCompletion />}
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
