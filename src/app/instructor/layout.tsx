import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, LayoutDashboard, PlusCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Instructor Dashboard | Modern Study Center",
};

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r hidden md:block">
        <div className="h-full flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex-1 px-3 space-y-1">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Instructor Panel
            </div>
            <Link href="/instructor" className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-100 group">
              <LayoutDashboard className="text-gray-400 group-hover:text-gray-500 mr-3 flex-shrink-0 h-5 w-5" />
              Dashboard
            </Link>
            <Link href="/instructor/courses" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group">
              <BookOpen className="text-gray-400 group-hover:text-gray-500 mr-3 flex-shrink-0 h-5 w-5" />
              My Courses
            </Link>
            <Link href="/instructor/courses/create" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group">
              <PlusCircle className="text-gray-400 group-hover:text-gray-500 mr-3 flex-shrink-0 h-5 w-5" />
              Create Course
            </Link>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
