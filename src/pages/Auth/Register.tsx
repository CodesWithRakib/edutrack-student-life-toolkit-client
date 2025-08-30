import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import type { FirebaseError } from "firebase/app";
import useAxios from "@/hooks/useAxios";

const registerSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
          message:
            "Password must contain uppercase, lowercase, number, and special character",
        }
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { createUser, updateUser, sendVerificationEmail, setUser } = useAuth();
  const axiosSecure = useAxios();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const password = watch("password");

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    setPasswordStrength(Math.min(strength, 100));
  }, [password]);

  const getStrengthColor = (strength: number) => {
    if (strength < 40) return "bg-red-500";
    if (strength < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength: number) => {
    if (strength < 40) return "Weak";
    if (strength < 70) return "Moderate";
    return "Strong";
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      // 1. Create Firebase user
      const userCredential = await createUser(data.email, data.password);
      setUser(userCredential.user);

      if (userCredential.user) {
        // 2. Update Firebase display name
        await updateUser({ displayName: data.name });

        // 3. Send verification email
        await sendVerificationEmail();
        setIsVerificationSent(true);

        // 4. Sync user with backend
        try {
          const { data: userData } = await axiosSecure.post("/users/sync");
          console.log("User synced with backend:", userData);

          toast.success("Account created successfully!", {
            description: "Please verify your email before logging in.",
            icon: <CheckCircle className="h-5 w-5 text-green-500" />,
            duration: 5000,
          });

          // Reset form
          reset();

          // Redirect to login after a short delay
          setTimeout(() => {
            navigate("/login", { replace: true });
          }, 3000);
        } catch (syncError) {
          console.error("Error syncing user with backend:", syncError);

          // Even if sync fails, account was created in Firebase
          toast.success("Account created in Firebase!", {
            description:
              "There was an issue syncing with our servers, but you can still log in after verifying your email.",
            icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
            duration: 6000,
          });

          // Still redirect to login
          setTimeout(() => {
            navigate("/login", { replace: true });
          }, 3000);
        }
      }
    } catch (err: unknown) {
      const error = err as FirebaseError;
      let errorMessage = "Failed to create account. Please try again.";

      // Handle specific Firebase auth errors
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage =
            "An account with this email already exists. Please try logging in.";
          break;
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address.";
          break;
        case "auth/weak-password":
          errorMessage =
            "Password is too weak. Please use a stronger password.";
          break;
        case "auth/network-request-failed":
          errorMessage =
            "Network error. Please check your connection and try again.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many attempts. Please try again later.";
          break;
        default:
          errorMessage =
            error.message || "An unknown error occurred during registration.";
      }

      toast.error("Registration Failed", {
        description: errorMessage,
        action: <button onClick={() => toast.dismiss()}>Dismiss</button>,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full">
            <User className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-blue-100">
            Join us today and explore amazing features
          </p>
        </div>

        {/* Form */}
        {isVerificationSent ? (
          <div className="p-8 text-center">
            <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Verification Email Sent!
            </h2>
            <p className="text-gray-600 mb-6">
              We've sent a verification email to your email address. Please
              check your inbox and click on the verification link to activate
              your account.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              You will be redirected to the login page shortly...
            </p>
            <Button
              onClick={() => navigate("/login")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              Go to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Name Field */}
            <div>
              <Label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className={`pl-10 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  {...register("name")}
                  disabled={isLoading}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> {errors.name.message}
                </p>
              )}
            </div>

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
                  className={`pl-10 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  {...register("email")}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />{" "}
                  {errors.email.message}
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
                  placeholder="• • • • • • • •"
                  className={`pl-10 pr-10 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  {...register("password")}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Password strength:</span>
                  <span>{getStrengthText(passwordStrength)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(
                      passwordStrength
                    )}`}
                    style={{ width: `${passwordStrength}%` }}
                  ></div>
                </div>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />{" "}
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <Label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="• • • • • • • •"
                  className={`pl-10 pr-10 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                  {...register("confirmPassword")}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />{" "}
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
              disabled={!isValid || isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </>
              ) : (
                <>Create Account</>
              )}
            </Button>
          </form>
        )}

        {/* Footer */}
        {!isVerificationSent && (
          <div className="bg-gray-50 p-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
