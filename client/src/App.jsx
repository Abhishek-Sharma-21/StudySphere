import { Routes, Route } from "react-router-dom";
import {
  AboutPage,
  AISupport,
  CommunityDashboardRoute,
  communityPostDetail,
  ContactPage,
  CreateCommunityPosts,
  DashboardGroupDetailRoute,
  DashboardIndexRoute,
  DiscussionDashboardRoute,
  DiscussionHomePage,
  FeaturePage,
  ForgotPasswordPage,
  GroupDashboardRoute,
  GroupDetailsRoute,
  GroupHomePage,
  LoginPage,
  ResetPasswordpage,
  ResourceDashboard,
  ResourceHomepage,
  ResourcesDetailPage,
  RouteIndex,
  SignUpPage,
} from "./components/RouteNames/RouteName";

import MainLayout from "./layout/MainLayout";
import Index from "./components/Home/Index";
import AiSupport from "./Pages/AiSupport";
import CommunityPostDetails from "./Pages/Community/CommunityPostDetails";
import CreateCommunityPost from "./Pages/Community/CreateCommunityPost";
import Features from "./Pages/Extras/Features";
import ContactUs from "./Pages/Extras/ContactUs";
import AboutUs from "./Pages/Extras/AboutUs";
import Signup from "./Pages/Authentication/SignUp";
import Login from "./Pages/Authentication/Login";
import ResourceHomePage from "./Pages/Resources/ResourceHomePage";
import DiscussionsIndex from "./Pages/Discussions/DiscussionIndex";
import GroupsIndex from "./Pages/Groups/GroupIndex";
import GroupDetails from "./Pages/Groups/GroupDetails";
import ResourcesDetail from "./Pages/Resources/ResourcesDetail";
import ForgotPassword from "./Pages/Authentication/ForgotPassword";
import ResetPasswordUI from "./Pages/Authentication/ResetPassword";
import DashboardLayout from "./Pages/Dashboards/DashboardLayout";
import DashboardIndex from "./Pages/Dashboards/DashboardIndex";
import ResourcesDashboard from "./Pages/Dashboards/ResourcesDashboard";
import DiscussionDashboard from "./Pages/Dashboards/DiscussionDashboard";
import GroupDashboard from "./Pages/Dashboards/GroupDashboard";
import CommunityDashboard from "./Pages/Dashboards/CommunityDashboard";
import Settings from "./Pages/Dashboards/Settings";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { SettingsRoute, EditCommunityPostPath } from "./components/RouteNames/RouteName";



import NeuralSyncManager from "./components/common/NeuralSyncManager";

const App = () => {
  return (
    <div>
      <NeuralSyncManager />
      <Routes>

        {/* ── Public layout ── anyone can browse without logging in ── */}
        <Route path={RouteIndex} element={<MainLayout />}>
          <Route index element={<Index />} />

          {/* Community — public browsing, login only needed to write */}
          <Route path={communityPostDetail} element={<CommunityPostDetails />} />
          <Route
            path={CreateCommunityPosts}
            element={
              <ProtectedRoute>
                <CreateCommunityPost />
              </ProtectedRoute>
            }
          />
          <Route
            path={EditCommunityPostPath}
            element={
              <ProtectedRoute>
                <CreateCommunityPost />
              </ProtectedRoute>
            }
          />


          {/* Explore sections — fully public */}
          <Route path={GroupHomePage} element={<GroupsIndex />} />
          <Route path={GroupDetailsRoute} element={<GroupDetails />} />
          <Route path={DiscussionHomePage} element={<DiscussionsIndex />} />
          <Route path={ResourceHomepage} element={<ResourceHomePage />} />
          <Route path={ResourcesDetailPage} element={<ResourcesDetail />} />
          <Route path={FeaturePage} element={<Features />} />
          <Route path={ContactPage} element={<ContactUs />} />
          <Route path={AboutPage} element={<AboutUs />} />

          {/* AI Support — protected */}
          <Route
            path={AISupport}
            element={
              <ProtectedRoute>
                <AiSupport />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ── Dashboard — fully protected ── */}
        <Route
          path={DashboardIndexRoute}
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardIndex />} />
          <Route path={ResourceDashboard} element={<ResourcesDashboard />} />
          <Route path={DiscussionDashboardRoute} element={<DiscussionDashboard />} />
          <Route path={GroupDashboardRoute} element={<GroupDashboard />} />
          <Route path={CommunityDashboardRoute} element={<CommunityDashboard />} />
          <Route path={DashboardGroupDetailRoute} element={<GroupDetails />} />
          <Route path={SettingsRoute} element={<Settings />} />
        </Route>



        {/* ── Auth routes ── */}
        <Route path={SignUpPage} element={<Signup />} />
        <Route path={LoginPage} element={<Login />} />
        <Route path={ForgotPasswordPage} element={<ForgotPassword />} />
        <Route path={ResetPasswordpage} element={<ResetPasswordUI />} />
      </Routes>
    </div>
  );
};
export default App;
