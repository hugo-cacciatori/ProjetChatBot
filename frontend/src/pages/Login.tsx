import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import GuestLoginButton from '../components/auth/GuestLoginButton';
import SignUpLink from '../components/auth/SignUpLink';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const { login, loginAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleGuestLogin = async () => {
    try {
      await loginAsGuest();
      navigate('/');
    } catch (error) {
      console.error('Guest login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
        
        <LoginForm 
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
        
        <GuestLoginButton handleGuestLogin={handleGuestLogin} />
        
        <SignUpLink />
      </div>
    </div>
  );
};

export default Login;