import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Users, LayoutDashboard, Settings, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard | Modern Study Center",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r flex-shrink-0">
        <div className="h-auto md:h-full flex flex-col pt-4 md:pt-5 pb-4 overflow-x-auto md:overflow-y-auto">
          <div className="flex md:flex-col px-3 space-x-2 md:space-x-0 md:space-y-1">
            <div className="hidden md:block px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Admin Controls
            </div>
            <Link href="/admin" className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 rounded-md bg-gray-100 hover:bg-gray-200 group whitespace-nowrap">
              <LayoutDashboard className="text-gray-500 group-hover:text-gray-900 mr-2 md:mr-3 flex-shrink-0 h-5 w-5" />
              Dashboard
            </Link>
            <Link href="/admin/users" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group whitespace-nowrap">
              <Users className="text-gray-400 group-hover:text-gray-500 mr-2 md:mr-3 flex-shrink-0 h-5 w-5" />
              Manage Users
            </Link>
            <Link href="/admin/courses" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group whitespace-nowrap">
              <BookOpen className="text-gray-400 group-hover:text-gray-500 mr-2 md:mr-3 flex-shrink-0 h-5 w-5" />
              Manage Courses
            </Link>
            <Link href="/admin/study-material" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group whitespace-nowrap">
              <FileText className="text-gray-400 group-hover:text-gray-500 mr-2 md:mr-3 flex-shrink-0 h-5 w-5" />
              Study Material
            </Link>
            <Link href="/admin/settings" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group whitespace-nowrap">
              <Settings className="text-gray-400 group-hover:text-gray-500 mr-2 md:mr-3 flex-shrink-0 h-5 w-5" />
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
