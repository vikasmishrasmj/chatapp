import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';


function Register() {
    const {setAuthUser}=useAuth();
      const [loading,setLoading]=useState(false)
      const [inputData,setInputData]=useState({})
      const navigate= useNavigate()
   
      

    const handleInput = (e)=>{
          setInputData({
            ...inputData , [e.target.id]:e.target.value
          })
    }
          console.log(inputData);
    const selectGender = (selectGender)=>{
        setInputData((prev)=>({
            ...prev , gender:selectGender === inputData.gender ? '' : selectGender
        }))

    }
    // now sent to the backend of your data
     const handleSubmit =async(e)=>{
        e.preventDefault()
        setLoading(true)
        if(inputData.password !== inputData.confpassword.toLowerCase()){
            setLoading(false)
            return toast.error("Password doesn't match")
        }
         try {
            const register = await axios.post(`/api/auth/register`,inputData)
            const data = register.data;
            if(data.success === false){
                setLoading(false)
                toast.error(data.message)  // Displaying the error message if login fails
                console.log(data.message);
            }
            toast.success(data?.message)
            localStorage.setItem('chattapp', JSON.stringify(data));  // Save only necessary data
            setAuthUser(data);// it could send data manully
            setLoading(false)
            navigate('/login')
         } catch (error) {
              setLoading(false)
              toast.error(error?.response?.data?.message) // Show error message to user
              console.log(error)
         }
     }



    return (
        <div className='flex flex-col items-center justify-center mix-w-full mx-auto '>
            <div className='w-full p-6 rounded-lg shadow-lg bg-gray-400 bg-clip-padding
         backderop-filter backdrop-blur-lg bg-opacity-0'>

                <h1 className='text-3xl font-bold text-center
                     text-gray-300'>Register
                    <span className='text-gray-950'>Chatt App</span>
                </h1>

                <form onSubmit={handleSubmit} className='flex flex-col text-black'>
                <div>
                        <label className='label p-2 text-left w-full'>
                            <span className='font-bold text-gray-950 text-xl label-text'>Full Name :</span>
                        </label>
                        <input id='fullname'
                             type='text'
                            onChange={handleInput}
                            placeholder='Enter Full Name'
                            required
                            className='w-full input input-bordered h-10' />
                    </div>
                    <div>
                        <label className='label p-2 text-left w-full'>
                            <span className='font-bold text-gray-950 text-xl label-text'>User Name :</span>
                        </label>
                        <input id='username'
                             type='text'
                            onChange={handleInput}
                            placeholder='Enter User Name'
                            required
                            className='w-full input input-bordered h-10' />
                    </div>
                    <div>
                        <label className='label p-2 text-left w-full'>
                            <span className='font-bold text-gray-950 text-xl label-text'>Email :</span>
                        </label>
                        <input id='email' type='email'
                            onChange={handleInput}
                            placeholder='Enter Email'
                            required
                            className='w-full input input-bordered h-10' />
                    </div>

                    <div>
                        <label className='label p-2 text-left w-full'>
                            <span className='font-bold text-gray-950 text-xl label-text'>Password :</span>
                        </label>
                        <input id='password' type='password'
                            onChange={handleInput}
                            placeholder='Enter  Password'
                            required
                            className='w-full input input-bordered h-10' />
                    </div>
                    <div>
                        <label className='label p-2 text-left w-full'>
                            <span className='font-bold text-gray-950 text-xl label-text'> Confirm Password :</span>
                        </label>
                        <input id='confpassword' type='text'
                            onChange={handleInput}
                            placeholder='Enter confirm Password'
                            required
                            className='w-full input input-bordered h-10' />
                    </div>
                       <div id='gender' className='flex gap-2'>
                        <label className='cursor-pointer label flex gap-2'>
                            <span className='label-text font-semibold text-gray-950'>male</span>
                            <input 
                            onChange={()=>selectGender('male')}
                            checked = {inputData.gender == 'male'}
                            type='checkbox' 
                            className='checkbox checkbox-info'/>
                        </label>
                        <label className='cursor-pointer label flex gap-2'>
                            <span className='label-text font-semibold text-gray-950'>female</span>
                            <input
                             onChange={()=>selectGender('female')}
                             checked = {inputData.gender == 'female'}
                            type='checkbox' 
                            className='checkbox checkbox-info'/>
                        </label>
                       </div>


                    <button type='submit'
                        className='mt-4 self-center w-auto px-2  py-1 bg-gray-950 text-lg hover:bg-gray-900 text-white rounded-lg hover: scale-105'>
                        {loading ? "loading.." : "Register"}
                    </button>
                </form>

                <div className='pt-2'>
                    <p className='text-sm font-semibold text-gray-800'>
                        Don't have an Account? <Link to={'/login'}>
                            <span className='text-gray-950 font-bold underline cursor-pointer hover:text-green-950'>
                                Login Now!!
                            </span>
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    )
}

export default Register;