import { Routes, Route } from "react-router-dom";
import {
  AboutPage,
  AISupport,
  communityPostDetail,
  ContactPage,
  CreateCommunityPosts,
  FeaturePage,
  LoginPage,
  RouteIndex,
  SignUpPage,
  VerifyEmailPage,
} from "./components/RouteNames/RouteName";
import MainLayout from "./layout/MainLayout";
import Index from "./components/Home/Index";
import AiSupport from "./Pages/AiSupport";
import Dashboard from "./Pages/Dashboard";
import CommunityPostDetails from "./Pages/Community/CommunityPostDetails";
import CreateCommunityPost from "./Pages/Community/CreateCommunityPost";
import Features from "./Pages/Extras/Features";
import ContactUs from "./Pages/Extras/ContactUs";
import AboutUs from "./Pages/Extras/AboutUs";
import Signup from "./Pages/Authentication/SignUp";
import Login from "./Pages/Authentication/Login";
import VerifyEmail from "./Pages/Authentication/VerifyEmail";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path={RouteIndex} element={<MainLayout />}>
          <Route index element={<Index />} />
          <Route path={AISupport} element={<AiSupport />} />
          <Route
            path={communityPostDetail}
            element={<CommunityPostDetails />}
          />
          <Route
            path={CreateCommunityPosts}
            element={<CreateCommunityPost />}
          />
          <Route path={FeaturePage} element={<Features />} />
          <Route path={ContactPage} element={<ContactUs />} />
          <Route path={AboutPage} element={<AboutUs />} />
        </Route>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path={SignUpPage} element={<Signup />} />
        <Route path={LoginPage} element={<Login />} />
        <Route path={VerifyEmailPage} element={<VerifyEmail />} />
      </Routes>
    </div>
  );
};
export default App;
