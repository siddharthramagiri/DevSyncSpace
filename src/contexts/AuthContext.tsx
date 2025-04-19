import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types/project';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import api from '@/services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      
      const token = localStorage.getItem('token');
      // console.log(await api.auth.getMe());
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await api.auth.getMe();
        setUser(userData);
      } catch (error) {
        console.error('Auth error:', error);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Handle login (store token and fetch user data)
  const login = async (token: string) => {
    localStorage.setItem('token', token);
    setIsLoading(true);
    
    try {
      const userData = await api.auth.getMe();
      console.log(userData._id);
      setUser(userData);
      toast({
        title: 'Login successful',
        description: `Welcome back, ${userData.name}!`,
      });
      // navigate('/app');
      navigate(`/app/updateProfile/${userData._id}`)
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: 'Unable to fetch user data',
        variant: 'destructive'
      });
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      toast({
        title: 'Logged out',
        description: 'You have been logged out successfully',
      });
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
