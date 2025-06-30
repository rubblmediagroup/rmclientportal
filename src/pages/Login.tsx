import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle, Users, FileText, MessageSquare } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Mock authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'admin@example.com') {
        login({
          id: '1',
          email: 'admin@example.com',
          name: 'Agency Admin',
          role: 'agency_admin'
        });
        navigate('/admin');
      } else if (email === 'client@example.com') {
        login({
          id: '2',
          email: 'client@example.com',
          name: 'Client User',
          role: 'client_owner'
        });
        navigate('/client');
      } else {
        alert('Invalid credentials. Use admin@example.com or client@example.com');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: CheckCircle,
      title: 'Project Tracking',
      description: 'Monitor your project progress in real-time with detailed updates and milestones.'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Seamlessly collaborate with our team and provide feedback on deliverables.'
    },
    {
      icon: FileText,
      title: 'File Management',
      description: 'Access all your project files, documents, and assets in one organized location.'
    },
    {
      icon: MessageSquare,
      title: 'Direct Communication',
      description: 'Stay connected with instant messaging and project-specific discussions.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex min-h-screen">
        {/* Left Column - Login Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            {/* Logo */}
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <span className="text-white text-2xl font-bold">R</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
              <p className="mt-2 text-gray-600">Sign in to access your project portal</p>
            </div>

            {/* Login Form */}
            <Card className="shadow-lg border-0">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-xl text-center">Sign In</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="h-11"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className="h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
                
                <div className="mt-4 text-center">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Forgot your password?
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Demo Credentials */}
            <div className="text-center text-sm text-gray-500">
              <p>Demo credentials:</p>
              <p><strong>Admin:</strong> admin@example.com</p>
              <p><strong>Client:</strong> client@example.com</p>
            </div>
          </div>
        </div>

        {/* Right Column - Features */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-8 lg:py-12 bg-gradient-to-br from-blue-600 to-purple-700">
          <div className="max-w-lg mx-auto text-white">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Your Project Portal</h1>
              <p className="text-xl text-blue-100">
                Everything you need to track, collaborate, and succeed with your projects.
              </p>
            </div>

            <div className="space-y-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-blue-100 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
              <p className="text-blue-100 mb-4">
                Our support team is here to assist you with any questions about your projects.
              </p>
              <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;