"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";

export default function EnrollButton({ courseId, price, isEnrolled }: { courseId: string; price: number; isEnrolled: boolean }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(isEnrolled);

  const handleEnroll = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=/courses/${courseId}`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      const data = await res.json();

      if (res.status === 409) {
        // Already enrolled
        setEnrolled(true);
        return;
      }

      if (!res.ok) {
        throw new Error(data.message || "Enrollment failed");
      }

      setEnrolled(true);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (enrolled) {
    return (
      <div className="space-y-3">
        <Button disabled className="w-full h-14 text-lg bg-emerald-600 text-white rounded-xl font-bold cursor-default">
          <CheckCircle className="w-5 h-5 mr-2" /> Enrolled ✓
        </Button>
        <Button 
          onClick={() => router.push(`/courses/${courseId}/learn`)} 
          className="w-full h-12 text-base bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold"
        >
          Go to Course →
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleEnroll} 
      disabled={loading}
      className="w-full h-14 text-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 rounded-xl font-bold"
    >
      {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : price === 0 ? "Enroll for Free" : `Enroll Now – ₹${price}`}
    </Button>
  );
}
