
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Routings/Authentic'; // Import useAuth




function Admin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleLogin = () => {
    const adminUsername = 'admin'; // Fixed username
    const adminPassword = 'admin123'; // Fixed password

    if (username === adminUsername && password === adminPassword) {
      setError('');
      login(); // Update authentication state
      navigate("/expad"); // Redirect to the admin dashboard
    } else {
      setError('Invalid username or password');
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

 

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4 font-semibold">Admin Login</h2>
        <input
          type="text"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="relative w-full mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 py-2 text-gray-600"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <button
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mb-4"
          onClick={handleLogin}
        >
          Login
        </button>

        {error && (
          <div className="mt-4 text-red-500">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
