"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Auto login after registration
      const signInRes = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInRes?.error) {
        throw new Error(signInRes.error);
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    "Access to 500+ hours of video content",
    "Chapter-wise PYQs with video solutions",
    "All India rank prediction & analytics",
    "Live doubt-clearing sessions daily",
  ];

  return (
    <div className="min-h-screen flex w-full bg-white">
      {/* Left Panel - Branding & Benefits */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#0a0f1c] via-[#111827] to-[#1e1b4b] relative flex-col justify-between p-12 overflow-hidden text-white">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.25)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(236,72,153,0.15)_0%,transparent_50%)]" />
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Modern Study Center" className="h-12 w-auto" />
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Sparkles className="w-10 h-10 text-amber-400 mb-6" />
            <h2 className="text-4xl font-bold leading-tight mb-4">
              Begin your journey to the top ranks
            </h2>
            <p className="text-indigo-200 text-lg mb-10">
              Create your free account and get instant access to our world-class preparation material.
            </p>
          </motion.div>
          
          <div className="space-y-5">
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index} 
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
              >
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="text-indigo-100 text-base font-medium">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 sm:p-12 lg:p-24 relative bg-slate-50/50">
        <Link href="/" className="absolute top-8 left-8 lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white">M</div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">MSC</span>
        </Link>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create your account</h1>
            <p className="text-slate-500 mt-2 text-lg">Start your preparation journey today.</p>
          </div>

          <Button 
            variant="outline" 
            className="w-full h-12 text-base font-semibold border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <svg className="mr-3 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            Sign up with Google
          </Button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">Or sign up with email</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 text-sm font-medium text-red-600 bg-red-50 rounded-lg border border-red-100 flex items-center">
                <span className="mr-2">⚠️</span> {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700 font-semibold">Full Name</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="Rahul Sharma" 
                required 
                value={formData.name}
                onChange={handleChange}
                className="h-12 rounded-xl border-slate-300 focus:ring-indigo-600 focus:border-indigo-600"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-semibold">Email address</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="aspirant@example.com" 
                required 
                value={formData.email}
                onChange={handleChange}
                className="h-12 rounded-xl border-slate-300 focus:ring-indigo-600 focus:border-indigo-600"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-semibold">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="••••••••"
                required 
                value={formData.password}
                onChange={handleChange}
                className="h-12 rounded-xl border-slate-300 focus:ring-indigo-600 focus:border-indigo-600"
              />
              <p className="text-xs text-slate-400">Must be at least 8 characters</p>
            </div>
            
            <Button 
              className="w-full h-12 text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5" 
              type="submit" 
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <>Create Account <ArrowRight className="ml-2 w-5 h-5" /></>
              )}
            </Button>
          </form>

          <p className="text-center text-slate-600 text-sm mt-8 font-medium">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
