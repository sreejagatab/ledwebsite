"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";

// Navigation items for the sidebar
const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/projects", label: "Projects", icon: "📁" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "💬" },
  { href: "/admin/inquiries", label: "Inquiries", icon: "📨" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Skip the sidebar for the login page
  if (pathname === "/admin/login") {
    return (
      <SessionProvider>
        {children}
      </SessionProvider>
    );
  }

  return (
    <SessionProvider>
      <div className="min-h-screen bg-gray-100">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-800 min-h-screen p-4 fixed">
            <div className="text-white font-bold text-xl mb-8 p-2">
              LuminaTech Admin
            </div>
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-4 py-2 rounded transition-colors duration-200 ${
                      isActive
                        ? "text-white bg-blue-600"
                        : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            
            <div className="absolute bottom-0 left-0 w-full p-4">
              <Link
                href="/"
                className="flex items-center text-gray-300 hover:bg-gray-700 px-4 py-2 rounded"
              >
                <span className="mr-2">🏠</span>
                View Website
              </Link>
              <Link
                href="/api/auth/signout"
                className="flex items-center text-gray-300 hover:bg-gray-700 px-4 py-2 rounded mt-2"
              >
                <span className="mr-2">🚪</span>
                Sign Out
              </Link>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 ml-64">
            {children}
          </div>
        </div>
      </div>
    </SessionProvider>
  );
} 