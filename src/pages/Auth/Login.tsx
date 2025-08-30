import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, Github, AlertCircle } from "lucide-react";
import type { FirebaseError } from "firebase/app";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { logIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      await logIn(data.email, data.password);

      toast.success("Login successful!", {
        description: "Welcome back to your account.",
      });

      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      const error = err as FirebaseError;
      let errorMessage = "Failed to login. Please try again.";

      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "Your account has been disabled.";
      }

      toast.error("Login Failed", {
        description: errorMessage,
        action: <button onClick={() => toast.dismiss()}>Dismiss</button>,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);

    try {
      await signInWithGoogle();

      toast.success("Login successful!", {
        description: "Welcome back to your account.",
      });

      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      const error = err as FirebaseError;
      let errorMessage = "Failed to login with Google. Please try again.";

      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Google sign-in was cancelled.";
      } else if (error.code === "auth/popup-blocked") {
        errorMessage =
          "Popup was blocked by your browser. Please allow popups for this site.";
      }

      toast.error("Google Login Failed", {
        description: errorMessage,
        action: <button onClick={() => toast.dismiss()}>Dismiss</button>,
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-center">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-purple-100">Sign in to access your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Email Field */}
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                className={`pl-10 w-full border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.email ? "border-red-500" : ""
                }`}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" /> {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="• • • • • •"
                className={`pl-10 pr-10 w-full border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.password ? "border-red-500" : ""
                }`}
                {...register("password")}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />{" "}
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <Label
              htmlFor="rememberMe"
              className="ml-2 block text-sm text-gray-700"
            >
              Remember me
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            disabled={!isValid || isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing in...
              </>
            ) : (
              <>Sign In</>
            )}
          </Button>

          {/* Alternative Login Options */}
          <div className="pt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Github className="h-5 w-5 mr-2" />
                GitHub
              </Button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              Create one here
            </Link>
          </p>

          <div className="mt-4">
            <Link
              to="/forgot-password"
              className="text-sm text-purple-600 hover:text-purple-800 font-medium"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
