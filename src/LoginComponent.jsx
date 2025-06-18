import React, { useState, useEffect } from 'react';

const LoginComponent = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false
  });
  
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    general: ''
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('login');

  // Mock database
  const mockUsers = [
    { username: 'admin', password: 'admin123' },
    { username: 'user1', password: 'password1' },
    { username: 'testuser', password: 'test123' }
  ];

  // Check for existing session on component mount
  useEffect(() => {
    const savedSession = localStorage.getItem('userSession');
    if (savedSession) {
      setIsLoggedIn(true);
      setCurrentPage('home');
    }
  }, []);

  // Validate if string contains unicode characters
  const hasUnicodeChars = (str) => {
    return /[^\x00-\x7F]/.test(str);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear errors when user starts typing
    if (errors[name] || errors.general) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
        general: ''
      }));
    }
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {
      username: '',
      password: '',
      general: ''
    };

    // Check if fields are empty
    if (!formData.username || !formData.password) {
      newErrors.username = !formData.username ? 'border-red-500' : '';
      newErrors.password = !formData.password ? 'border-red-500' : '';
      newErrors.general = 'Điền đầy đủ username và password';
      setErrors(newErrors);
      return false;
    }

    // Check for unicode characters in username
    if (hasUnicodeChars(formData.username)) {
      newErrors.username = 'border-red-500';
      newErrors.general = 'Username không được dùng kí tự unicode';
      setErrors(newErrors);
      return false;
    }

    // Check for unicode characters in password
    if (hasUnicodeChars(formData.password)) {
      newErrors.password = 'border-red-500';
      newErrors.general = 'Password không được dùng kí tự unicode';
      setErrors(newErrors);
      return false;
    }

    return true;
  };

  // Authenticate user
  const authenticateUser = () => {
    const user = mockUsers.find(u => u.username === formData.username);
    
    if (!user) {
      setErrors(prev => ({
        ...prev,
        general: 'Sai thông tin đăng nhập'
      }));
      return false;
    }

    if (user.password !== formData.password) {
      setErrors(prev => ({
        ...prev,
        general: 'Sai thông tin đăng nhập'
      }));
      return false;
    }

    return true;
  };

  // Handle login submission
  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!authenticateUser()) {
      return;
    }

    // Successful login
    if (formData.remember) {
      localStorage.setItem('userSession', JSON.stringify({
        username: formData.username,
        loginTime: new Date().toISOString()
      }));
    } else {
      sessionStorage.setItem('userSession', JSON.stringify({
        username: formData.username,
        loginTime: new Date().toISOString()
      }));
    }

    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('userSession');
    sessionStorage.removeItem('userSession');
    setIsLoggedIn(false);
    setCurrentPage('login');
    setFormData({ username: '', password: '', remember: false });
    setErrors({ username: '', password: '', general: '' });
  };

  // Simulate browser close/reopen
  const simulateBrowserRestart = () => {
    // Clear session storage (simulates browser close)
    sessionStorage.clear();
    
    // Check if user should remain logged in
    const savedSession = localStorage.getItem('userSession');
    if (savedSession) {
      alert('Trình duyệt đã được mở lại - Người dùng vẫn đăng nhập (Remember được chọn)');
    } else {
      setIsLoggedIn(false);
      setCurrentPage('login');
      alert('Trình duyệt đã được mở lại - Người dùng đã đăng xuất (Remember không được chọn)');
    }
  };

  // Navigation handlers
  const navigateToRegister = () => {
    setCurrentPage('register');
  };

  const navigateToForgotPassword = () => {
    setCurrentPage('forgotpassword');
  };

  const navigateToLogin = () => {
    setCurrentPage('login');
  };

  // Render different pages
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
              <h2 className="text-2xl font-bold mb-4 text-center text-green-600">
                Đăng nhập thành công!
              </h2>
              <p className="text-center mb-4">
                Chào mừng, {formData.username}!
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                  Đăng xuất
                </button>
                <button
                  onClick={simulateBrowserRestart}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Giả lập tắt/mở trình duyệt
                </button>
              </div>
            </div>
          </div>
        );

      case 'register':
        return (
          <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
              <h2 className="text-2xl font-bold mb-4 text-center">Đăng ký</h2>
              <p className="text-center mb-4">Trang đăng ký (Demo)</p>
              <button
                onClick={navigateToLogin}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Quay lại đăng nhập
              </button>
            </div>
          </div>
        );

      case 'forgotpassword':
        return (
          <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
              <h2 className="text-2xl font-bold mb-4 text-center">Quên mật khẩu</h2>
              <p className="text-center mb-4">Trang quên mật khẩu (Demo)</p>
              <button
                onClick={navigateToLogin}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Quay lại đăng nhập
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
              <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>
              
              <div className="space-y-4">
                {/* Username field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.username || 'border-gray-300'
                    }`}
                    placeholder="Nhập username"
                  />
                </div>

                {/* Password field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.password || 'border-gray-300'
                    }`}
                    placeholder="Nhập password"
                  />
                </div>

                {/* Error message */}
                {errors.general && (
                  <div className="text-red-500 text-sm text-center">
                    {errors.general}
                  </div>
                )}

                {/* Remember checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="remember"
                    id="remember"
                    checked={formData.remember}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                    Nhớ tài khoản
                  </label>
                </div>

                {/* Login button */}
                <button
                  type="button"
                  onClick={handleLogin}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Đăng nhập
                </button>

                {/* Links */}
                <div className="flex justify-between text-sm">
                  <button
                    type="button"
                    onClick={navigateToRegister}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Đăng ký
                  </button>
                  <button
                    type="button"
                    onClick={navigateToForgotPassword}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderPage();
};

export default LoginComponent;