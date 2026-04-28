import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Users, LayoutDashboard, Settings, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard | Modern Study Center",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:block">
        <div className="h-full flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex-1 px-3 space-y-1">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Admin Controls
            </div>
            <Link href="/admin" className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 rounded-md bg-gray-100 hover:bg-gray-200 group">
              <LayoutDashboard className="text-gray-500 group-hover:text-gray-900 mr-3 flex-shrink-0 h-5 w-5" />
              Dashboard
            </Link>
            <Link href="/admin/users" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group">
              <Users className="text-gray-400 group-hover:text-gray-500 mr-3 flex-shrink-0 h-5 w-5" />
              Manage Users
            </Link>
            <Link href="/admin/courses" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group">
              <BookOpen className="text-gray-400 group-hover:text-gray-500 mr-3 flex-shrink-0 h-5 w-5" />
              Manage Courses
            </Link>
            <Link href="/admin/study-material" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group">
              <FileText className="text-gray-400 group-hover:text-gray-500 mr-3 flex-shrink-0 h-5 w-5" />
              Study Material
            </Link>
            <Link href="/admin/settings" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group">
              <Settings className="text-gray-400 group-hover:text-gray-500 mr-3 flex-shrink-0 h-5 w-5" />
              Settings
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
