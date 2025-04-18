
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setError('No authentication token found');
      return;
    }

    const handleLogin = async () => {
      try {
        await login(token);
        // Login function will handle redirection to /app
      } catch (err) {
        console.error('Login error:', err);
        setError('Authentication failed. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleLogin();
  }, [searchParams, login, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow">
        {error ? (
          <>
            <h2 className="text-2xl font-bold text-center text-red-600">
              Authentication Error
            </h2>
            <p className="text-center">{error}</p>
            <p className="text-center text-sm text-gray-500">
              Redirecting you back to login...
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center">Authenticating...</h2>
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-t-brand-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-center text-sm text-gray-500">
              Please wait while we complete your authentication
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
