'use client';

import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from "react-toastify";

// Simple mapping structure for demonstration. 
// You can expand this or import a JSON array list for all 64 districts.
const bdLocationData = {
    "Chittagong": ["Feni", "Mirsharai", "Hathazari", "Sandwip", "Anwara"],
    "Dhaka": ["Dhanmondi", "Mirpur", "Savara", "Uttara", "Gulshan"],
    "Noakhali": ["Sadar", "Begumganj", "Chatkhil", "Senbagh", "Companiganj"],
    "Sylhet": ["Sadar", "Beanibazar", "Golapganj", "Fenchuganj"]
};

const Register = () => {
    const [showPass, setShowPass] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();
    
    const { 
        register, 
        handleSubmit, 
        watch, 
        formState: { errors } 
    } = useForm();

    // Watch district selection to dynamically filter upazila options
    const selectedDistrict = watch("district");
    const passwordValue = watch("password");

    const handleRegister = async (data) => {
        try {
            setIsUploading(true);
            
            // --- 1. IMGBB IMAGE UPLOAD HANDLING ---
            const imageFile = data.avatar[0];
            const formData = new FormData();
            formData.append('image', imageFile);

            // Replace 'YOUR_IMGBB_API_KEY' with your real ImgBB API key string
            const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY; 
            const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
                method: 'POST',
                body: formData,
            });
            
            const imgbbData = await imgbbResponse.json();
            
            if (!imgbbData.success) {
                toast.error("Failed to upload avatar image to ImgBB.");
                setIsUploading(false);
                return;
            }

            const uploadedPhotoUrl = imgbbData.data.url;

            // --- 2. AUTH CLIENT SIGN UP WITH EXTRA METADATA ---
            const { data: Res, error } = await authClient.signUp.email({
                  email: data.email,
    password: data.password,
    name: data.name,
    image: uploadedPhotoUrl,   // ✅ BA's built-in field name is `image`
    photoUrl: uploadedPhotoUrl, // optional: keep both if you want
    role: "donor",              // ✅ flat, not nested inside data:{}
    status: "active",
    bloodGroup: data.bloodGroup,
    district: data.district,
    upazila: data.upazila,
    callbackURL: "/login",
            });

            setIsUploading(false);

            if (Res) {
                toast.success("Registration successful! Welcome to the network.");
                router.push("/login");
            }

            if (error) {
                error.message && toast.error(error.message);
                return;
            }
        } catch (err) {
            console.error(err);
            toast.error("An unexpected error occurred during submission.");
            setIsUploading(false);
        }
    };

    return (
        <div className='container mx-auto min-h-[80vh] flex items-center justify-center flex-col gap-5 bg-slate-200 p-5 rounded-lg my-10 text-gray-800'>
            <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-2xl'>
                <h2 className='font-bold text-3xl mb-6 text-center'>Register your account</h2>
                
                <form className='space-y-4' onSubmit={handleSubmit(handleRegister)}>
                    
                    {/* Name */}
                    <fieldset className="fieldset flex flex-col">
                        <legend className="fieldset-legend font-semibold mb-1">Full Name</legend>
                        <input type="text" className="p-2 border border-gray-300 rounded-md focus:outline-red-500" placeholder="Type your name" {...register("name", { required: "Name is required" })} />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </fieldset>

                    {/* Avatar Upload */}
                    <fieldset className="fieldset flex flex-col">
                        <legend className="fieldset-legend font-semibold mb-1">Avatar Photo</legend>
                        <input type="file" accept="image/*" className="p-1 border border-gray-300 rounded-md file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-gray-100 file:text-sm" {...register("avatar", { required: "Please select an image file" })} />
                        {errors.avatar && <p className="text-red-500 text-sm mt-1">{errors.avatar.message}</p>}
                    </fieldset>

                    {/* E-mail */}
                    <fieldset className="fieldset flex flex-col">
                        <legend className="fieldset-legend font-semibold mb-1">E-mail</legend>
                        <input type="email" className="p-2 border border-gray-300 rounded-md focus:outline-red-500" placeholder="Type your E-mail" {...register("email", { required: "Email is required" })} />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </fieldset>

                    {/* Blood Group */}
                    <fieldset className="fieldset flex flex-col">
                        <legend className="fieldset-legend font-semibold mb-1">Blood Group</legend>
                        <select className="p-2 border border-gray-300 rounded-md bg-white focus:outline-red-500" {...register("bloodGroup", { required: "Blood group is required" })}>
                            <option value="">Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                        {errors.bloodGroup && <p className="text-red-500 text-sm mt-1">{errors.bloodGroup.message}</p>}
                    </fieldset>

                    {/* District & Upazila Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* District */}
                        <fieldset className="fieldset flex flex-col">
                            <legend className="fieldset-legend font-semibold mb-1">District</legend>
                            <select className="p-2 border border-gray-300 rounded-md bg-white focus:outline-red-500" {...register("district", { required: "District is required" })}>
                                <option value="">Select District</option>
                                {Object.keys(bdLocationData).map((district) => (
                                    <option key={district} value={district}>{district}</option>
                                ))}
                            </select>
                            {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district.message}</p>}
                        </fieldset>

                        {/* Upazila */}
                        <fieldset className="fieldset flex flex-col">
                            <legend className="fieldset-legend font-semibold mb-1">Upazila</legend>
                            <select disabled={!selectedDistrict} className="p-2 border border-gray-300 rounded-md bg-white disabled:bg-gray-100 focus:outline-red-500" {...register("upazila", { required: "Upazila is required" })}>
                                <option value="">Select Upazila</option>
                                {selectedDistrict && bdLocationData[selectedDistrict]?.map((upazila) => (
                                    <option key={upazila} value={upazila}>{upazila}</option>
                                ))}
                            </select>
                            {errors.upazila && <p className="text-red-500 text-sm mt-1">{errors.upazila.message}</p>}
                        </fieldset>
                    </div>

                    {/* Password */}
                    <fieldset className="fieldset flex flex-col">
                        <legend className="fieldset-legend font-semibold mb-1">Password</legend>
                        <input type={showPass ? "text" : "password"} className="p-2 border border-gray-300 rounded-md focus:outline-red-500" placeholder="Type Password" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })} />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </fieldset>

                    {/* Confirm Password */}
                    <fieldset className="fieldset flex flex-col">
                        <legend className="fieldset-legend font-semibold mb-1">Confirm Password</legend>
                        <input type={showPass ? "text" : "password"} className="p-2 border border-gray-300 rounded-md focus:outline-red-500" placeholder="Retype Password" {...register("confirm_password", { required: "Please confirm your password", validate: value => value === passwordValue || "Passwords do not match" })} />
                        {errors.confirm_password && <p className="text-red-500 text-sm mt-1">{errors.confirm_password.message}</p>}
                    </fieldset>

                    {/* Show Password Option */}
                    <div className='flex items-center'>
                        <input type="checkbox" id="showPass" className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" onChange={() => setShowPass(!showPass)} />
                        <label htmlFor="showPass" className='ml-2 text-sm font-medium text-gray-700 select-none cursor-pointer'>Show Passwords</label>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" disabled={isUploading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold p-3 rounded-md transition-colors disabled:bg-red-400 mt-2">
                        {isUploading ? "Uploading Avatar & Registering..." : "Register"}
                    </button>
                </form>

                <div className='text-center mt-4'>
                    <p className="text-sm"> Have an account? <Link href="/login" className="text-red-600 font-semibold hover:underline">Login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;