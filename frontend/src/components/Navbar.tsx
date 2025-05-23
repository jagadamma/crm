import React from "react";
import { useNavigate } from "react-router-dom";
import { Menu, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const getUsername = (): string => {
    try {
      const userDataString = localStorage.getItem("userData");

      // Fix: check for null or "undefined" string before parsing
      if (!userDataString || userDataString === "undefined") {
        console.warn("Invalid or missing userData in localStorage");
        return "User";
      }

      const userData = JSON.parse(userDataString);

      // Return username or fallback to a default
      return userData?.username || userData?.name || "User";
    } catch (error) {
      console.error("Error parsing user data:", error);
      return "User";
    }
  };

  const username = getUsername();

  const handleLogout = () => {
    // Clear all user-related data from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("refreshToken");

    // Redirect to login page
    navigate("/login");
  };

  return (
    <header className="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 py-2">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="mr-2 cursor-pointer"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-medium">Welcome {username}!</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          aria-label="Toggle theme"
          className="cursor-pointer"
        >
          {isDarkMode ? (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          )}
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleLogout}

        >
          <LogOut className="h-4 w-4" />
          <span>Log Out</span>
        </Button>
      </div>
    </header>
  );
};

export default Navbar;