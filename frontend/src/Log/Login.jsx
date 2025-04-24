import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext';

function Login() {
    const navigate = useNavigate();
    const {setAuthUser} = useAuth();
    const [userInput, setUserInput] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false)

    const handleInput = (e) => {
        setUserInput({
            ...userInput, [e.target.id]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const login = await axios.post(`/api/auth/login`, userInput);
            const data = login.data
            if (data.success === false) {
                setLoading(false)
                toast.error(data.message)  // Displaying the error message if login fails
                console.log(data.message);
                return;
            }
            toast.success(data.message)
            localStorage.setItem('chattapp', JSON.stringify(data));  // Save only necessary data
            setAuthUser(data);// it could send data manually
            setLoading(false);
            navigate('/')  // Navigate to home after successful login
        } catch (error) {
            setLoading(false)
            toast.error(error?.response?.data?.message) // Show error message to user
            console.log(error)
        }
    }

    return (
        <div className='flex flex-col items-center justify-center mix-w-full mx-auto '>
            <div className='w-full p-6 rounded-lg shadow-lg bg-gray-400 bg-clip-padding backderop-filter backdrop-blur-lg bg-opacity-0'>
                <h1 className='text-3xl font-bold text-center text-gray-300'>Login
                    <span className='text-gray-950'>Chatt App</span>
                    </h1>
                    <form onSubmit={handleSubmit} className='flex flex-col text-black'>
                        <div>
                            <label className='label p-2 text-left w-full'>
                                <span className='font-bold text-gray-950 text-xl label-text'>Email :</span>
                            </label>
                            <input id='email' type='email'
                                onChange={handleInput}
                                placeholder='Enter Your Email'
                                required
                                className='w-full input input-bordered h-10' />
                        </div>

                        <div>
                            <label className='label p-2 text-left w-full'>
                                <span className='font-bold text-gray-950 text-xl label-text'>Password :</span>
                            </label>
                            <input id='password' type='password'
                                onChange={handleInput}
                                placeholder='Enter Your Password'
                                required
                                className='w-full input input-bordered h-10' />
                        </div>
                        <button type='submit'
                            className='mt-4 self-center w-auto px-2  py-1 bg-gray-950 text-lg hover:bg-gray-900 text-white rounded-lg hover: scale-105'>
                            {loading ? "loading.." : "Login"}
                        </button>
                    </form>

                    <div className='pt-2'>
                        <p className='text-sm font-semibold text-gray-800'>
                            Don't have an Account? <Link to={'/register'}>
                                <span className='text-gray-950 font-bold underline cursor-pointer hover:text-green-950'>
                                    Register Now!!
                                </span>
                            </Link>
                        </p>
                    </div>
                
            </div>
        </div>
    )
}

export default Login
