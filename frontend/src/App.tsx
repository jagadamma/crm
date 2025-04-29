import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import React from "react";
import "./App.css";
import Login from "./pages/Login/Login";
import Signup from "./pages/SignUp/Signup";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Contacts from "@/pages/Contacts";
import Leads from "@/pages/Leads";
import User from "@/pages/User";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Tasks from "./pages/Tasks";

const queryClient = new QueryClient();

const App: React.FC = () => {
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem("accessToken") !== null;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Sonner />
          <Router>
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
                <Route path="contacts" element={<Contacts />} />
                <Route path="leads" element={<Leads />} />
                <Route path="user" element={<User />} />
                <Route path="task" element={<Tasks />} />
              </Route>

              {/* Redirect unmatched routes */}
              <Route
                path="*"
                element={
                  isAuthenticated ? (
                    <Navigate to="/" />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
            </Routes>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
