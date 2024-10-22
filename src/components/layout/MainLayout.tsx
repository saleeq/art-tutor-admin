// src/components/layout/MainLayout.tsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  // Palette,
  // BookOpen,
  Users,
  // Settings,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    // { path: "/dashboard", name: "Dashboard", icon: Palette },
    // { path: "/lessons", name: "Lessons", icon: BookOpen },
    // { path: "/student-groups", name: "Student Groups", icon: Users },
    { path: "/word-lists", name: "Word Lists", icon: Users },

    // { path: "/settings", name: "Settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    return [
      { name: "Home", path: "/" },
      ...pathnames.map((name, index) => {
        const path = `/${pathnames.slice(0, index + 1).join("/")}`;
        return { name: name.charAt(0).toUpperCase() + name.slice(1), path };
      }),
    ];
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`bg-secondary w-64 fixed inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition duration-200 ease-in-out z-30`}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-primary text-primary-foreground">
          <span className="text-2xl font-semibold">Art Tutor</span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X size={24} />
          </button>
        </div>
        <nav className="mt-5">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-2 mt-2 text-secondary-foreground hover:bg-secondary-foreground/10 ${
                location.pathname === item.path
                  ? "bg-secondary-foreground/20 text-primary"
                  : ""
              }`}
            >
              <item.icon className="mr-3" size={20} />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* App Bar */}
        <header className="bg-background border-b border-border shadow-sm z-20 flex items-center justify-between p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-foreground hover:text-primary"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={user?.photoURL || undefined} />
              <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground mr-4">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>

        {/* Breadcrumb */}
        <nav className="bg-gray-100 px-4 py-2 text-gray-400 text-xs z-10">
          <ol className="flex flex-wrap items-center space-x-2">
            {getBreadcrumbs().map((crumb, index, array) => (
              <li key={crumb.path} className="flex items-center">
                {index > 0 && <ChevronRight size={16} className="mx-1" />}
                {index === array.length - 1 ? (
                  <span>{crumb.name}</span>
                ) : (
                  <Link to={crumb.path} className="hover:text-primary">
                    {crumb.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-background p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
