import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Layout from "@/components/Layout";

const Login = lazy(() => import("./pages/Login/Login"));
const Signup = lazy(() => import("./pages/SignUp/Signup"));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Contacts = lazy(() => import("@/pages/Contacts"));
const Leads = lazy(() => import("@/pages/Leads"));
const User = lazy(() => import("@/pages/User"));
const Tasks = lazy(() => import("./pages/Tasks"));
const ViewContact = lazy(() => import("./pages/ViewContact"));

const queryClient = new QueryClient();

const App: React.FC = () => {
  const isAuthenticated = localStorage.getItem("accessToken") !== null;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Sonner />
          <Router>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected routes */}
                <Route
                  path="/"
                  element={
                    isAuthenticated ? (
                      <Layout children={undefined} />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="contacts/:id/view" element={<ViewContact />} />
                  <Route path="contacts" element={<Contacts />} />
                  <Route path="leads" element={<Leads />} />
                  <Route path="user" element={<User />} />
                  <Route path="task" element={<Tasks />} />
                </Route>

                {/* Redirect unmatched routes */}
                <Route
                  path="*"
                  element={
                    isAuthenticated ? <Navigate to="/" /> : <Navigate to="/login" />
                  }
                />
              </Routes>
            </Suspense>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
