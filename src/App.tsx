import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminProvider } from "@/contexts/AdminContext";

// Layouts
import PublicLayout from "@/components/layout/PublicLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";

// Public Pages
import Index from "@/pages/Index";
import Jobs from "@/pages/Jobs";
import JobDetails from "@/pages/JobDetails";
import ApplyJob from "@/pages/ApplyJob";
import NotFound from "@/pages/NotFound";

// Admin Pages
import AdminLogin from "@/pages/admin/AdminLogin";
import Dashboard from "@/pages/admin/Dashboard";
import ManageJobs from "@/pages/admin/ManageJobs";
import PostJob from "@/pages/admin/PostJob";
import EditJob from "@/pages/admin/EditJob";
import Applications from "@/pages/admin/Applications";
import ApplicationDetail from "@/pages/admin/ApplicationDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/jobs/:id/apply" element={<ApplyJob />} />
            </Route>

            {/* Admin Login (no layout) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="jobs" element={<ManageJobs />} />
                <Route path="jobs/new" element={<PostJob />} />
                <Route path="jobs/:id/edit" element={<EditJob />} />
                <Route path="applications" element={<Applications />} />
                <Route path="applications/:id" element={<ApplicationDetail />} />
              </Route>
            </Route>

            {/* Redirect /admin to login if not authenticated */}
            <Route path="/admin" element={<AdminLogin />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AdminProvider>
  </QueryClientProvider>
);

export default App;
