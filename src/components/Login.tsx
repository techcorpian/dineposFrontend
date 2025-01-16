import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { login } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../UIElements/CustomInput'; // Adjust the path as per your file structure

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { token, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      // Store token in local storage for persistence
      localStorage.setItem('token', token);
      navigate('/home');
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    await dispatch(login({ email, password }));
    setIsLoading(false);
  };

  return (
    <div className='flex flex-rows h-screen md:p-3 md:px-3 bg-gray-100 gap-9'>
    <div className='flex flex-col justify-between p-6 px-9 rounded-lg md:w-1/2 w-full h-full'>
      <h2 className='md:pb-4 pb-6 text-2xl font-bold'><span className='text-2xl text-gray-400'>Dine</span>POS.</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
    <div className='md:pb-4 md:text-6xl text-4xl font-bold '>Login to Our <span className='pb-4 md:text-6xl text-4xl font-medium text-gray-400'>Portal</span></div>
      <h2 className="text-2xl font-bold">Login</h2>
      <CustomInput
        type="email"
        id="email"
        label="Email"
        value={email}
        setValue={setEmail}
      />
      <CustomInput
        type="password"
        id="password"
        label="Password"
        value={password}
        setValue={setPassword}
      />
      <button
        type="submit"
        disabled={isLoading}
        className='mt-4 py-3 bg-black/80 text-white rounded cursor-pointer'
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
          <div className='md:text-left text-center'>Created By Mushthaq Ameen.</div>
          </div>
          <div className='md:block hidden flex flex-col justify-between p-6 px-8 rounded-lg w-1/2 h-full bg-black/80'>
            <div className='text-white'></div>
          </div>
        </div>


  );
};

export default Login;
