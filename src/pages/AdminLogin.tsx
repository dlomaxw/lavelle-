import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Loader2, Lock, Mail, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // If already logged in, redirect straight to dashboard
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/admin/dashboard", { replace: true });
    });
    return unsub;
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setStatus("loading");
    setErrorMessage("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged above will handle redirect
    } catch (err: any) {
      setStatus("error");
      const code = err?.code ?? "";
      if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
        setErrorMessage("Invalid email or password. Please try again.");
      } else if (code === "auth/too-many-requests") {
        setErrorMessage("Too many failed attempts. Please wait a moment and try again.");
      } else {
        setErrorMessage("Login failed. Please check your credentials.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#060607] flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,142,113,0.18),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(200,142,113,0.08),transparent_50%)]" />

      <div className="w-full max-w-md">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to site
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="rounded-[2rem] border-white/10 bg-white/5 text-white backdrop-blur-xl shadow-2xl shadow-black/50">
            <CardHeader className="pb-2 pt-8 px-8">
              <div className="flex flex-col items-center mb-8">
                <div className="mb-6">
                  <img 
                    src="/logo.svg" 
                    alt="Lavelle" 
                    className="h-32 w-auto object-contain" 
                  />
                </div>
                <div className="text-center">
                  <div className="text-xs uppercase tracking-[0.4em] text-[#efc2aa] font-semibold">Admin Control Panel</div>
                </div>
              </div>

              <CardTitle className="text-3xl font-semibold">Sign in</CardTitle>
              <p className="text-sm text-white/55 mt-1">Access the Lavelle sales dashboard</p>
            </CardHeader>

            <CardContent className="px-8 pb-8 pt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/35" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 rounded-xl border-white/10 bg-black/40 text-white pl-11 placeholder:text-white/35 focus-visible:ring-[#c88e71]/50"
                      placeholder="admin@lavelle.ug"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/35" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 rounded-xl border-white/10 bg-black/40 text-white pl-11 pr-12 placeholder:text-white/35 focus-visible:ring-[#c88e71]/50"
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {status === "error" && (
                  <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300">
                    {errorMessage}
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full h-12 rounded-full bg-[#c88e71] text-black font-semibold hover:bg-[#ddb09a] mt-2 disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Sign in to Dashboard"
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-xs text-white/35">
                Authorised personnel only. All access is logged.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
