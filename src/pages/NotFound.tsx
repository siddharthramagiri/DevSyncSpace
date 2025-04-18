
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="mx-auto w-full max-w-md px-4 text-center sm:px-6 lg:max-w-lg lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
          </div>
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-gray-900">404</h1>
          <h2 className="mb-4 text-xl font-semibold text-gray-700">Page Not Found</h2>
          <p className="mb-8 text-gray-600">
            The page you are looking for doesn't exist or has been moved. Please check the URL or go back to the home page.
          </p>
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
            <Button
              variant="outline"
              className="w-full justify-center sm:w-auto"
              asChild
            >
              <Link to="/app">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button
              className="w-full justify-center sm:w-auto"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
