
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Github } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Register = () => {
  const { toast } = useToast();
  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const handleGoogleLogin = () => {
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${backendUrl}/api/auth/github`;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Side - Registration Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-1/2 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-10">
            <div className="flex items-center">
              <div className="mr-2 h-8 w-8 rounded-full bg-brand-600"></div>
              <span className="text-xl font-bold">DevSyncSpace</span>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create your account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-brand-600 hover:text-brand-500">
                Sign in
              </Link>
            </p>
          </div>

          <div className="space-y-6">
            <p className="text-center text-sm text-gray-500 mb-6">
              Choose one of the following options to create your account
            </p>
            
            <Button 
              className="w-full mb-3"
              onClick={handleGoogleLogin}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#FFFFFF"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#FFFFFF"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FFFFFF"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#FFFFFF"
                />
              </svg>
              Continue with Google
            </Button>
            
            <Button 
              variant="secondary" 
              className="w-full"
              onClick={handleGithubLogin}
            >
              <Github className="mr-2 h-4 w-4" />
              Continue with GitHub
            </Button>

            <div className="mt-8 text-center text-sm text-gray-500">
              By creating an account, you agree to our{" "}
              <a href="#" className="font-medium text-brand-600 hover:text-brand-500">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="font-medium text-brand-600 hover:text-brand-500">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden relative lg:block lg:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-700 to-brand-900 opacity-90"></div>
        <img
          src="https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?auto=format&fit=crop&q=80&w=1200"
          alt="Team collaboration"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-white">
          <h2 className="mb-4 text-3xl font-bold">Built for modern dev teams</h2>
          <p className="max-w-md text-center text-lg">
            Join thousands of teams already using DevSync to ship better software, faster.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold">3.5x</div>
              <p className="text-sm opacity-80">Faster sprints</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">87%</div>
              <p className="text-sm opacity-80">Fewer meetings</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">99.9%</div>
              <p className="text-sm opacity-80">Uptime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
