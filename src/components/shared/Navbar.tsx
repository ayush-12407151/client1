"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export const Navbar = () => {
  const pathname = usePathname();
  const isAuth = pathname.startsWith("/login") || pathname.startsWith("/register");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, status } = useSession();

  if (isAuth) return null;

  return (
    <nav className="w-full sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.jpg" alt="Modern Study Center" className="h-10 w-auto rounded" />
              <span className="font-bold text-lg text-slate-900 tracking-tight hidden sm:inline">Modern Study Center</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-7">
            <Link href="/courses" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium text-sm">Courses</Link>
            <Link href="/courses?category=jee" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium text-sm">JEE</Link>
            <Link href="/courses?category=neet" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium text-sm">NEET</Link>
            <Link href="/educator" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium text-sm">Educator</Link>
            {session?.user?.role !== "ADMIN" && (
              <Link href="/quizzes" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium text-sm">Quizzes</Link>
            )}
            <Link href="/free-material" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium text-sm">Free Material</Link>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
            ) : session ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="font-medium text-slate-700 hover:bg-slate-100 gap-2">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Button>
                </Link>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                    {session.user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate">{session.user?.name}</span>
                </div>
                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-red-500 hover:bg-red-50" onClick={() => signOut({ callbackUrl: "/" })}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/login"><Button variant="ghost" className="font-medium text-slate-700 hover:bg-slate-100">Log in</Button></Link>
                <Link href="/register"><Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl px-6 shadow-sm">Start Free</Button></Link>
              </>
            )}
          </div>

          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6 text-slate-900" /> : <Menu className="w-6 h-6 text-slate-900" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-3">
          <Link href="/courses" className="block py-2 font-medium text-slate-700" onClick={() => setMobileOpen(false)}>Courses</Link>
          <Link href="/courses?category=jee" className="block py-2 font-medium text-slate-700" onClick={() => setMobileOpen(false)}>JEE</Link>
          <Link href="/courses?category=neet" className="block py-2 font-medium text-slate-700" onClick={() => setMobileOpen(false)}>NEET</Link>
          <Link href="/educator" className="block py-2 font-medium text-slate-700" onClick={() => setMobileOpen(false)}>Educator</Link>
          {session?.user?.role !== "ADMIN" && (
            <Link href="/quizzes" className="block py-2 font-medium text-slate-700" onClick={() => setMobileOpen(false)}>Quizzes</Link>
          )}
          <Link href="/free-material" className="block py-2 font-medium text-slate-700" onClick={() => setMobileOpen(false)}>Free Material</Link>
          <div className="flex gap-3 pt-2">
            {session ? (
              <>
                <Link href="/dashboard" className="flex-1" onClick={() => setMobileOpen(false)}><Button variant="outline" className="w-full">Dashboard</Button></Link>
                <Button variant="outline" className="flex-1 text-red-600 border-red-200" onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</Button>
              </>
            ) : (
              <>
                <Link href="/login" className="flex-1"><Button variant="outline" className="w-full">Log in</Button></Link>
                <Link href="/register" className="flex-1"><Button className="w-full bg-indigo-600 hover:bg-indigo-700">Start Free</Button></Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
