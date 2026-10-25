import { lazy } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Layout, { PageLoader } from './components/Layout';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';

const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Projects = lazy(() => import('./pages/Projects'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const DockPass = lazy(() => import('./pages/DockPass'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Auth').then((m) => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Auth').then((m) => ({ default: m.Register })));
const VerifyEmail = lazy(() => import('./pages/Auth').then((m) => ({ default: m.VerifyEmail })));
const ForgotPassword = lazy(() => import('./pages/Auth').then((m) => ({ default: m.ForgotPassword })));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const Overview = lazy(() => import('./pages/admin/Overview'));
const Messages = lazy(() => import('./pages/admin/Messages'));
const UsersPage = lazy(() => import('./pages/admin/Lists').then((m) => ({ default: m.UsersPage })));
const SubscribersPage = lazy(() => import('./pages/admin/Lists').then((m) => ({ default: m.SubscribersPage })));
const RequestsPage = lazy(() => import('./pages/admin/Lists').then((m) => ({ default: m.RequestsPage })));
const ProjectsPage = lazy(() => import('./pages/admin/Content').then((m) => ({ default: m.ProjectsPage })));
const PostsPage = lazy(() => import('./pages/admin/Content').then((m) => ({ default: m.PostsPage })));

function RequireAuth({ children, admin = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  if (admin && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  if (!user.email_verified) return <Navigate to="/verify-email" replace state={{ from: location.pathname + location.search }} />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:slug" element={<ServiceDetail />} />
        <Route path="projects" element={<Projects />} />
        <Route path="recent-projects" element={<Navigate to="/projects" replace />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="portfolios" element={<Navigate to="/portfolio" replace />} />
        <Route path="dockpass" element={<DockPass />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogPost />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="verify-email" element={<VerifyEmail />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="admin" element={<RequireAuth admin><AdminLayout /></RequireAuth>}>
        <Route index element={<Overview />} />
        <Route path="messages" element={<Messages />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="subscribers" element={<SubscribersPage />} />
        <Route path="requests" element={<RequestsPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="posts" element={<PostsPage />} />
      </Route>
    </Routes>
  );
}
