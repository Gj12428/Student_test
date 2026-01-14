"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { logoutUser } from "@/lib/auth-client";
import type { User } from "@/lib/types";
import {
  BookOpen,
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  GraduationCap,
  Target,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Mail,
  MessageSquare,
  FolderTree,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  type: "admin" | "student";
  user?: User;
}

const adminLinks = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/students", icon: Users, label: "Students" },
  { href: "/admin/tests", icon: FileText, label: "Tests" },
  { href: "/admin/manage", icon: FolderTree, label: "Manage" }, // Added Manage link
  { href: "/admin/results", icon: Trophy, label: "Results" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/admin/contacts", icon: Mail, label: "Contacts" },
  { href: "/admin/feedback", icon: MessageSquare, label: "Feedback" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

const studentLinks = [
  { href: "/student", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/student/tests", icon: FileText, label: "Test Series" },
  { href: "/student/practice", icon: Target, label: "Practice" },
  { href: "/student/results", icon: Trophy, label: "Results" },
  { href: "/student/analytics", icon: BarChart3, label: "My Analytics" },
];

export function Sidebar({ type, user }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = type === "admin" ? adminLinks : studentLinks;
  const dashboardPath = type === "admin" ? "/admin" : "/student";

  const displayName = user?.full_name || "User";
  const initials = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      window.location.replace("/");
    } catch (error) {
      console.error("Logout error:", error);
      window.location.replace("/");
    }
  };

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <Link href={dashboardPath} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          {(!collapsed || isMobile) && (
            <span className="text-lg font-bold text-foreground whitespace-nowrap">
              HSSC CET <span className="text-primary">TEST</span>
            </span>
          )}
        </Link>
      </div>

      {/* User Info */}
      <div
        className={cn(
          "p-4 border-b border-border",
          collapsed && !isMobile && "px-2"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            {type === "admin" ? (
              <GraduationCap className="w-5 h-5 text-primary" />
            ) : (
              <span className="text-sm font-bold text-primary">{initials}</span>
            )}
          </div>
          {(!collapsed || isMobile) && (
            <div className="overflow-hidden">
              <p className="font-medium text-foreground text-sm truncate">
                {displayName}
              </p>
              <p className="text-xs text-muted-foreground truncate capitalize">
                {type}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
                collapsed && !isMobile && "justify-center px-2"
              )}
            >
              <link.icon
                className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isActive && "animate-pulse"
                )}
              />
              {(!collapsed || isMobile) && (
                <span className="font-medium">{link.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors",
            collapsed && !isMobile && "justify-center px-2"
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {(!collapsed || isMobile) && (
            <span className="font-medium">Logout</span>
          )}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-card border-b border-border flex items-center justify-between px-4">
        <Link href={dashboardPath} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-base font-bold text-foreground">
            HSSC CET <span className="text-primary">TEST</span>
          </span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 z-50 h-screen w-72 bg-card border-r border-border flex flex-col transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          onClick={() => setMobileOpen(false)}
        >
          <X className="w-5 h-5" />
        </Button>
        <SidebarContent isMobile={true} />
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 flex-col",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {/* Collapse Button - Desktop only */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-20 w-6 h-6 rounded-full border border-border bg-background shadow-sm"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </Button>
        <SidebarContent />
      </aside>
    </>
  );
}
