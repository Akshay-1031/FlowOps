import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Sparkles,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function AppLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Projects",
      path: "/projects",
      icon: FolderKanban,
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: CheckSquare,
    },
    {
      name: "AI Insights",
      path: "/ai",
      icon: Sparkles,
    },
  ];

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const handleNavigation = (path) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">

        {/* Desktop Sidebar */}
        <aside className="hidden w-64 flex-col border-r border-white/10 bg-slate-900/70 p-5 md:flex">

          {/* Brand */}
          <div className="mb-10 flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-950">
              <Sparkles size={20} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                FlowOps
              </h1>

              <p className="text-xs text-slate-400">
                Work smarter
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-white text-slate-950"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  <Icon size={18} />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Desktop User */}
          <div className="border-t border-white/10 pt-4">

            <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/[0.04] p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-950">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {user?.name || "User"}
                </p>

                <p className="truncate text-xs text-slate-500">
                  {user?.email || ""}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/settings")}
              className="mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <Settings size={18} />
              Settings
            </button>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-red-400/10 hover:text-red-300"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="relative flex-1 overflow-hidden">

          {/* Mobile Header */}
          <header className="relative z-30 flex h-16 items-center justify-between border-b border-white/10 bg-slate-950/90 px-5 backdrop-blur md:hidden">

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
              aria-label="Open menu"
            >
              <Menu size={21} />
            </button>

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-950">
                <Sparkles size={16} />
              </div>

              <span className="text-sm font-bold">
                FlowOps
              </span>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-950">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </header>

          {/* Mobile Overlay */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* Mobile Drawer */}
          <aside
            className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-slate-900 p-5 transition-transform duration-300 md:hidden ${
              mobileMenuOpen
                ? "translate-x-0"
                : "-translate-x-full"
            }`}
          >

            {/* Drawer Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-950">
                  <Sparkles size={19} />
                </div>

                <div>
                  <h1 className="text-lg font-bold">
                    FlowOps
                  </h1>

                  <p className="text-xs text-slate-500">
                    Work smarter
                  </p>
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-white"
                aria-label="Close menu"
              >
                <X size={19} />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="mt-10 flex-1 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-white text-slate-950"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`
                    }
                  >
                    <Icon size={18} />
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>

            {/* Mobile User */}
            <div className="border-t border-white/10 pt-4">

              <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/[0.04] p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-950">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {user?.name || "User"}
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    {user?.email || ""}
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  handleNavigation("/settings")
                }
                className="mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 hover:bg-white/5 hover:text-white"
              >
                <Settings size={18} />
                Settings
              </button>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 hover:bg-red-400/10 hover:text-red-300"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </aside>

          {/* Background */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_35%)]" />

          {/* Page Content */}
          <div className="relative mx-auto max-w-7xl p-5 sm:p-6 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;