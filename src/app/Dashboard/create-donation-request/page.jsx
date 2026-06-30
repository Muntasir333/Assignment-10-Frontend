'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { authClient } from '@/lib/auth-client';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

// Bangladesh Location dataset matching your registration schema
const bdLocationData = {
  "Chittagong": ["Feni", "Mirsharai", "Hathazari", "Sandwip", "Anwara"],
  "Dhaka": ["Dhanmondi", "Mirpur", "Savara", "Uttara", "Gulshan"],
  "Noakhali": ["Sadar", "Begumganj", "Chatkhil", "Senbagh", "Companiganj"],
  "Sylhet": ["Sadar", "Beanibazar", "Golapganj", "Fenchuganj"]
};

export default function CreateDonationRequest() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch the current user session data
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  // Watch district value to cascade the dynamic upazila values
  const selectedDistrict = watch("recipient_district");

  // Safety checks for blocked users
  const isBlocked = user?.status === 'blocked';

  const handleCreateRequest = async (data) => {
    if (isBlocked) {
      toast.error("Blocked accounts cannot create blood donation requests.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Consolidate payload values including read-only and default hidden configurations
      const payload = {
        requesterName: user?.name,
        requesterEmail: user?.email,
        recipientName: data.recipient_name,
        recipientDistrict: data.recipient_district,
        recipientUpazila: data.recipient_upazila,
        hospitalName: data.hospital_name,
        fullAddress: data.full_address,
        bloodGroup: data.blood_group,
        donationDate: data.donation_date,
        donationTime: data.donation_time,
        requestMessage: data.request_message,
        donationStatus: "pending" // Added under-the-hood automatically as instructed
      };

    const tokenResponse = await authClient.token();
  const token = tokenResponse?.data?.token;
  console.log("Auth Token:", token); // Debugging: Ensure token is retrieved

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/add-request`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (response.ok) {
        toast.success("Blood donation request generated successfully!");
        router.push('/Dashboard/my-donation-requests');
      } else {
        toast.error(resData.message || "Failed to create donation request.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during network transmission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending) {
    return <div className="text-center p-10 font-semibold text-gray-500">Loading profile records...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto text-gray-800">
      
      {/* Page Header Layout */}
      <div className="mb-8 border-b border-gray-100 pb-4">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Create Blood Donation Request 🩸
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Provide accurate emergency information to match with nearby active community donors immediately.
        </p>
      </div>

      {/* Blocked User Notice banner */}
      {isBlocked && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-sm rounded-xl font-medium">
          ⚠️ Your account status is currently flagged as <strong>Blocked</strong>. You are restricted from posting or creating new public medical emergency donation requests.
        </div>
      )}

      {/* Main Request Form */}
      <form onSubmit={handleSubmit(handleCreateRequest)} className="space-y-5">
        
        {/* Row 1: Requester Read-Only Profile Meta Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Requester Name</label>
            <input
              type="text"
              readOnly
              value={user?.name || ''}
              className="p-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 font-medium text-sm focus:outline-none cursor-not-allowed"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Requester Email</label>
            <input
              type="email"
              readOnly
              value={user?.email || ''}
              className="p-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 font-medium text-sm focus:outline-none cursor-not-allowed"
            />
          </div>
        </div>

        {/* Row 2: Recipient Name & Blood Group Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Recipient Name</label>
            <input
              type="text"
              disabled={isBlocked}
              placeholder="e.g. Adnan Karim"
              className="p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-red-500 text-gray-900"
              {...register("recipient_name", { required: "Recipient name is required" })}
            />
            {errors.recipient_name && <p className="text-red-500 text-xs mt-1">{errors.recipient_name.message}</p>}
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Required Blood Group</label>
            <select
              disabled={isBlocked}
              className="p-3 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:border-red-500 text-gray-900"
              {...register("blood_group", { required: "Please select target blood group" })}
            >
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
            {errors.blood_group && <p className="text-red-500 text-xs mt-1">{errors.blood_group.message}</p>}
          </div>
        </div>

        {/* Row 3: Recipient District & Upazila Cascading Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Recipient District</label>
            <select
              disabled={isBlocked}
              className="p-3 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:border-red-500 text-gray-900"
              {...register("recipient_district", { required: "Recipient district is required" })}
            >
              <option value="">Select District</option>
              {Object.keys(bdLocationData).map((dist) => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
            {errors.recipient_district && <p className="text-red-500 text-xs mt-1">{errors.recipient_district.message}</p>}
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Recipient Upazila</label>
            <select
              disabled={!selectedDistrict || isBlocked}
              className="p-3 border border-gray-300 rounded-xl text-sm bg-white disabled:bg-gray-50 focus:outline-none focus:border-red-500 text-gray-900"
              {...register("recipient_upazila", { required: "Recipient upazila is required" })}
            >
              <option value="">Select Upazila</option>
              {selectedDistrict && bdLocationData[selectedDistrict]?.map((upz) => (
                <option key={upz} value={upz}>{upz}</option>
              ))}
            </select>
            {errors.recipient_upazila && <p className="text-red-500 text-xs mt-1">{errors.recipient_upazila.message}</p>}
          </div>
        </div>

        {/* Row 4: Hospital Designation Details */}
        <div className="flex flex-col">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Hospital Name</label>
          <input
            type="text"
            disabled={isBlocked}
            placeholder="e.g. Dhaka Medical College Hospital"
            className="p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-red-500 text-gray-900"
            {...register("hospital_name", { required: "Hospital facility designation is required" })}
          />
          {errors.hospital_name && <p className="text-red-500 text-xs mt-1">{errors.hospital_name.message}</p>}
        </div>

        {/* Row 5: Detailed Address Line */}
        <div className="flex flex-col">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Full Address Line</label>
          <input
            type="text"
            disabled={isBlocked}
            placeholder="e.g. Zahir Raihan Rd, Dhaka"
            className="p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-red-500 text-gray-900"
            {...register("full_address", { required: "Full explicit map address line is required" })}
          />
          {errors.full_address && <p className="text-red-500 text-xs mt-1">{errors.full_address.message}</p>}
        </div>

        {/* Row 6: Schedule Timing Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Donation Date</label>
            <input
              type="date"
              disabled={isBlocked}
              className="p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-red-500 text-gray-900"
              {...register("donation_date", { required: "Donation date schedule target is required" })}
            />
            {errors.donation_date && <p className="text-red-500 text-xs mt-1">{errors.donation_date.message}</p>}
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Donation Time</label>
            <input
              type="time"
              disabled={isBlocked}
              className="p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-red-500 text-gray-900"
              {...register("donation_time", { required: "Donation time window target is required" })}
            />
            {errors.donation_time && <p className="text-red-500 text-xs mt-1">{errors.donation_time.message}</p>}
          </div>
        </div>

        {/* Row 7: Request Case Message Description */}
        <div className="flex flex-col">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Request Message Details</label>
          <textarea
            rows="4"
            disabled={isBlocked}
            placeholder="Explain context details: why blood units are needed, patient operation schedules, or point-of-contact details..."
            className="p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-red-500 resize-none text-gray-900"
            {...register("request_message", { required: "Please write operational reason details" })}
          />
          {errors.request_message && <p className="text-red-500 text-xs mt-1">{errors.request_message.message}</p>}
        </div>

        {/* Action Form Footer Submit Controls */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isBlocked || isSubmitting}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold px-8 py-3.5 rounded-xl text-sm shadow-md transition-all uppercase tracking-wider"
          >
            {isSubmitting ? "Generating Request..." : "Submit Blood Request"}
          </button>
        </div>

      </form>
    </div>
  );
}