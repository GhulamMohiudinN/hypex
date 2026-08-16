"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { FiLock, FiMail, FiArrowLeft } from "react-icons/fi";
import { loginAdmin, watchAuthState } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const unsub = watchAuthState((user) => {
      setCheckingSession(false);
      if (user) router.replace("/admin/dashboard");
    });
    return () => unsub();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await loginAdmin(form.email, form.password);
      toast.success("Welcome back!");
      router.replace("/admin/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-ink/20 border-t-ink rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-bg-dark relative">
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors"
      >
        <FiArrowLeft size={16} /> Back to Home
      </Link>

      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Link href="/" className="bg-bg px-4 py-3 inline-block">
            <Image src="/images/logo.jpg" alt="HypeX" width={130} height={44} className="h-9 w-auto" />
          </Link>
        </div>

        <div className="bg-paper p-8">
          <h1 className="font-display uppercase text-2xl mb-1 text-center">Admin Login</h1>
          <p className="text-ink/50 text-sm text-center mb-8">Sign in to manage HypeX</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" size={16} />
              <input
                type="email"
                required
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 bg-bg border border-border text-sm focus:outline-none focus:border-ink"
              />
            </div>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" size={16} />
              <input
                type="password"
                required
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 bg-bg border border-border text-sm focus:outline-none focus:border-ink"
              />
            </div>
            <button type="submit" disabled={submitting} className="btn-accent w-full disabled:opacity-50">
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
        <p className="text-center text-white/30 text-xs mt-6">
          Access restricted to HypeX store administrators
        </p>
      </div>
    </div>
  );
}
