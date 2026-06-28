'use client'
// import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from "react-toastify";

const Register = () => {
    const [showPass, setShowPass] = useState(false);
    const router = useRouter();
        const { register, handleSubmit, formState: { errors } } = useForm();
        
        
            const handleRegister = async (data) => {
            console.log(data);

            // const { data: Res, error } = await authClient.signUp.email({
            //     email: data.email,
            //     password: data.password,
            //     name: data.name,
            //     photoUrl: data.photoUrl,
            //    callbackURL: "/login",
            // });

            if (Res) {
                toast.success("Registration successful! Please check your email to verify your account.");
                router.push("/login");
            }

            if (error) {
                error.message && toast.error(error.message);
                return;
            }}

            return (
                <div className='container mx-auto min-h-[80vh] flex items-center justify-center flex-col gap-5 bg-slate-200 p-5 rounded-lg'>
                    <div className='bg-white p-5 rounded-lg'>
                        <h2 className='font-bold text-3xl mb-6'>Register your account</h2>
                    <form className='space-y-3' onSubmit={handleSubmit(handleRegister)}>
                        <fieldset className="fieldset">
          <legend className="fieldset-legend ">Name</legend>
          <input type="text" className="input" placeholder="Type your name"   {...register("name", { required: true })} />
          {errors.name && <p className="text-red-500">Name is required</p>}
        
        </fieldset>
                        <fieldset className="fieldset">
          <legend className="fieldset-legend ">Photo Url</legend>
          <input type="text" className="input" placeholder="Paste link here"   {...register("photoUrl", { required: true })} />
          {errors.photoUrl && <p className="text-red-500">Photo Url is required</p>}
        
        </fieldset>
                        <fieldset className="fieldset">
          <legend className="fieldset-legend ">E-mail</legend>
          <input type="email" className="input" placeholder="Type your E-mail"   {...register("email", { required: true })} />
          {errors.email && <p className="text-red-500">E-mail is required</p>}
        
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Password</legend>
          <input type={showPass ? "text" : "password"} className="input" placeholder="Type Password"   {...register("password", { required: true })} />
          {errors.password && <p className="text-red-500">Password is required</p>}
        
        </fieldset>
        <span className=''>
    <input type="checkbox" id="showPass" onChange={()=>setShowPass(!showPass)} />
    <label htmlFor="showPass" className='ml-2 text-sm'>Show Password</label>
</span>

        
        <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl w-full bg-black text-white">Register</button>
                        </form>
                        <div className='text-center mt-2'>
                <p> Have an account? <Link href="/login" className="text-blue-500 hover:underline">Login</Link></p>
                </div>
                
                    </div>
                    
                </div>
            );
        };



export default Register;