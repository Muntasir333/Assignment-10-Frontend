'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';
import { FaPhoneFlip, FaEnvelope, FaLocationDot, FaPaperPlane } from 'react-icons/fa6';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Connect your custom API routes or backend service handling here
    console.log('Contact form payload submitted:', formData);
    alert('Thank you for reaching out! Our medical desk will respond shortly.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section className="bg-slate-50 text-gray-900 py-20 container mx-auto">
      <div className="container mx-auto px-5">
        
        {/* --- SECTION HEADER --- */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-red-600 font-bold text-sm tracking-widest uppercase block mb-2">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            We are here to assist you
          </h2>
          <p className="text-gray-500 mt-3">
            Have questions about donor eligibility, matching requests, or facility accounts? Drop us a message or call our 24/7 hotline.
          </p>
        </div>

        {/* --- GRID BODY --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
          
          {/* --- LEFT SIDE: CONTACT INFO --- */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-neutral text-white p-8 sm:p-10 rounded-2xl shadow-sm">
            <div>
              <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                If you are facing an urgent medical emergency or need immediate blood dispatch approvals, please reach us directly via the emergency line below.
              </p>

              <div className="space-y-6">
                {/* 📞 Contact Number Element */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center shrink-0 shadow-md">
                    <FaPhoneFlip className="text-white text-lg" />
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400 font-medium uppercase tracking-wider">24/7 Emergency Line</span>
                    <a href="tel:+18005553569" className="text-xl font-bold text-white hover:text-red-400 transition-colors">
                      +1 (800) 555-FLOW
                    </a>
                  </div>
                </div>

                {/* Email Info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center shrink-0">
                    <FaEnvelope className="text-gray-300 text-lg" />
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400 font-medium uppercase tracking-wider">Support Desk</span>
                    <a href="mailto:support@bloody.org" className="text-base font-semibold text-gray-200 hover:text-red-400 transition-colors">
                      support@bloody.org
                    </a>
                  </div>
                </div>

                {/* Physical Location */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center shrink-0">
                    <FaLocationDot className="text-gray-300 text-lg" />
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400 font-medium uppercase tracking-wider">HQ Center</span>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      742 Evergreen Terrace,<br />Medical District, NY 10001
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Minor Operating Tag */}
            <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-gray-400">
              Average response window for standard online inquiries is under 2 hours.
            </div>
          </div>

          {/* --- RIGHT SIDE: CONTACT FORM --- */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200/60">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:bg-white transition-all text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:bg-white transition-all text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:bg-white transition-all text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  required
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message or detailing requirements here..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:bg-white transition-all text-gray-900 resize-none"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  color="danger"
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-6 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-base"
                >
                  <FaPaperPlane size={14} />
                  Send Message
                </Button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}