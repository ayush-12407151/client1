"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { SkeletonRow } from "@/components/shared/Loaders";

export default function AdminAchieversPage() {
  const [achievers, setAchievers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievers();
  }, []);

  const fetchAchievers = async () => {
    try {
      const res = await fetch("/api/achievers");
      if (res.ok) {
        const data = await res.json();
        setAchievers(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAchiever = async (id: string) => {
    if (!confirm("Are you sure you want to delete this achiever?")) return;
    try {
      const res = await fetch(`/api/achievers/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAchievers(achievers.filter((a) => a._id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleVisibility = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/achievers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: !currentStatus }),
      });
      if (res.ok) {
        setAchievers(achievers.map((a) => (a._id === id ? { ...a, isVisible: !currentStatus } : a)));
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-7 w-44 bg-slate-200 rounded-full animate-pulse" />
          <div className="h-4 w-56 bg-slate-100 rounded-full animate-pulse mt-2" />
        </div>
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Student", "Exam & Year", "Score / Rank", "Visibility", "Actions"].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(4)].map((_, i) => <SkeletonRow key={i} cols={5} />)}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Achievers</h1>
          <p className="text-sm text-gray-500">Add and manage student success stories.</p>
        </div>
        <Link
          href="/admin/achievers/create"
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-4 h-4" />
          Add Achiever
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam & Year</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score / Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visibility</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {achievers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No achievers found. Add one to get started!
                </td>
              </tr>
            ) : (
              achievers.map((achiever) => (
                <tr key={achiever._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img className="h-10 w-10 rounded-full object-cover border border-gray-200" src={achiever.imageUrl} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{achiever.name}</div>
                        <div className="text-sm text-gray-500">Class {achiever.className}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-semibold">{achiever.exam}</div>
                    <div className="text-sm text-gray-500">{achiever.year}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-indigo-600">{achiever.score}</div>
                    {achiever.badge && <div className="text-xs text-amber-600 font-medium">{achiever.badge}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleVisibility(achiever._id, achiever.isVisible)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium ${
                        achiever.isVisible ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {achiever.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {achiever.isVisible ? "Visible" : "Hidden"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
                      <Link href={`/admin/achievers/${achiever._id}/edit`} className="text-indigo-600 hover:text-indigo-900 p-1">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button onClick={() => deleteAchiever(achiever._id)} className="text-red-600 hover:text-red-900 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
