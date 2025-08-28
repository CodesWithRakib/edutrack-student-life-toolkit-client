import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Shield, Home, ArrowLeft } from "lucide-react";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="mx-auto w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <Shield className="h-12 w-12 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-6xl font-bold text-red-600 mt-6">403</h1>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-4">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          You don't have permission to access this page.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/dashboard" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
