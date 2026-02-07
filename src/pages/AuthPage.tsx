import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/admin");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = authSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = isLogin
      ? await signIn(email, password)
      : await signUp(email, password);
    setSubmitting(false);

    if (error) {
      toast.error(error.message);
    } else if (!isLogin) {
      toast.success("Account created! Check your email to confirm.");
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card p-8 rounded-xl border border-border shadow-xl"
      >
        <div className="flex items-center justify-center gap-2 mb-8">
          <Logo className="w-8 h-8" />
          <span className="font-display text-xl font-bold text-foreground">Admin</span>
        </div>

        <h2 className="font-display text-2xl font-bold text-foreground text-center mb-6">
          {isLogin ? "Sign In" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@msquarearchitects.com"
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-foreground">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary font-medium hover:underline"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
