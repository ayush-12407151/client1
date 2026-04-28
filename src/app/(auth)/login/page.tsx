"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, Quote } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
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
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (res?.error) {
        throw new Error(res.error);
      }

      window.location.href = "/dashboard";
    } catch (err: any) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-white">
      {/* Left Panel - Branding & Graphic */}
      <div className="hidden lg:flex w-1/2 bg-[#0a0f1c] relative flex-col justify-between p-12 overflow-hidden text-white">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.2)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,rgba(147,51,234,0.2)_0%,transparent_50%)]" />
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Modern Study Center" className="h-12 w-auto" />
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <Quote className="w-12 h-12 text-indigo-400/50 mb-6" />
          <motion.h2 
            className="text-4xl font-bold leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            "Success in JEE and NEET is not just about hard work, it's about the right strategy and guidance."
          </motion.h2>
          <p className="text-indigo-200 text-lg">
            Join the elite community of top rankers and kickstart your preparation journey with us today.
          </p>
          
          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-4">
              <img className="w-12 h-12 rounded-full border-2 border-[#0a0f1c]" src="https://ui-avatars.com/api/?name=User+A&background=random" alt="" />
              <img className="w-12 h-12 rounded-full border-2 border-[#0a0f1c]" src="https://ui-avatars.com/api/?name=User+B&background=random" alt="" />
              <img className="w-12 h-12 rounded-full border-2 border-[#0a0f1c]" src="https://ui-avatars.com/api/?name=User+C&background=random" alt="" />
            </div>
            <div className="text-sm font-medium">
              Over <span className="text-white font-bold">50,000+</span> selections<br/>in top medical and engineering colleges.
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 sm:p-12 lg:p-24 relative bg-slate-50/50">
        <Link href="/" className="absolute top-8 left-8 lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white">M</div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">MSC</span>
        </Link>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back</h1>
            <p className="text-slate-500 mt-2 text-lg">Please enter your details to sign in.</p>
          </div>

          <Button 
            variant="outline" 
            className="w-full h-12 text-base font-semibold border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <svg className="mr-3 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            Sign in with Google
          </Button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">Or sign in with email</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 text-sm font-medium text-red-600 bg-red-50 rounded-lg border border-red-100 flex items-center">
                <span className="mr-2">⚠️</span> {error}
              </div>
            )}
            
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700 font-semibold">Password</Label>
                <Link href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </Link>
              </div>
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
            </div>
            
            <Button 
              className="w-full h-12 text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5" 
              type="submit" 
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <>Sign in <ArrowRight className="ml-2 w-5 h-5" /></>
              )}
            </Button>
          </form>

          <p className="text-center text-slate-600 text-sm mt-8 font-medium">
            Don't have an account?{" "}
            <Link href="/register" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
