'use client'
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import React, { use, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaGoogle } from 'react-icons/fa';
import { toast } from "react-toastify";

const Login = () => {
    const handlelogin = async()=>{
        const data = await authClient.signIn.social({
    provider: "google",
    })}
    const [showPass, setShowPass] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();


    const handleLogin = async (data) => {
    const { data: res, error } = await authClient.signIn.email({
    email: data.email, // required
    password: data.password, // required
    rememberMe: true,
    callbackURL: "/",
});
    if (res) {
        toast.success("Login successful!");
    }   
    if (error) {
        error.message && toast.error(error.message);
        return;
    }

}

    return (
        <div className='container mx-auto min-h-[80vh] flex items-center justify-center flex-col gap-5 bg-slate-200 p-5 rounded-lg'>
            <div className='bg-white p-5 rounded-lg'>
                <h2 className='font-bold text-3xl mb-6'>Login your account</h2>
            <form className='space-y-3' onSubmit={handleSubmit(handleLogin)}>
                <fieldset className="fieldset">
  <legend className="fieldset-legend ">E-mail</legend>
  <input type="email" className="input" placeholder="Type your E-mail"   {...register("email", { required: true })} />
  {errors.email && <p className="text-red-500">E-mail is required</p>}

</fieldset>
<fieldset className="fieldset">
  <legend className="fieldset-legend">Password</legend>
  <input type={showPass ? "text" : "password"} className="input" placeholder="Type password"   {...register("password", { required: true })} />
  {errors.password && <p className="text-red-500">Password is required</p>}

</fieldset>
<span className=''>
    <input type="checkbox" id="showPass" onChange={()=>setShowPass(!showPass)} />
    <label htmlFor="showPass" className='ml-2 text-sm'>Show Password</label>
</span>

<button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl w-full bg-black text-white">Login</button>
                </form>
            <div className='text-center mt-2'>
                <p>Dont have an account? <Link href="/register" className="text-blue-500 hover:underline">Register</Link></p>
                <div className='text-center mt-2 font-bold'>
                    <p>Or</p>
                </div>
                <div>
            <button className='btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl w-full bg-black text-white' onClick={()=>handlelogin()}>Login with <span><FaGoogle />
</span></button>
                </div>
                </div>
            </div>
            
        </div>
    );
};



export default Login;