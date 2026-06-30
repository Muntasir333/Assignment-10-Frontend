🩸 Bloody - Blood Donation & Funding Management System

A full-stack web application that helps connect blood donors with people who need blood. It provides separate dashboards for donors, volunteers, and admins, making blood donation management simple, secure, and efficient.

🚀 Live Demo
Website: https://bloody-donation-network.vercel.app (Replace with your actual deployed URL if different.)
Backend API: http://localhost:5000 (Development)
🎯 Purpose

Finding a blood donor during an emergency can be difficult and time-sensitive.

Bloody helps patients quickly find suitable blood donors. It also allows volunteers and administrators to manage blood requests while keeping the system secure through role-based access.

✨ Features
👤 Role-Based Dashboard

The application provides different dashboards based on the user's role.

🛡️ Admin Dashboard
View overall website statistics
Manage all users
Block or unblock users
Change user roles
Delete blood requests
Track total donations and blood requests
🤝 Volunteer Dashboard
View all blood requests
Update request status (Completed or Cancelled)
Filter requests
Cannot delete requests or manage users
❤️ Donor Dashboard
View personal blood donation requests
Track request status
Manage their own donation activities
🩸 Blood Request System
View active blood requests
Blood group badges and request status
See hospital and patient information
Open request details in a modal
Donate by submitting contact information
🔒 Secure Authentication & Authorization
Protected routes for logged-in users
Role-based dashboard access
Backend authorization checks
Unauthorized users receive 403 Forbidden responses
🛠️ Technologies Used
Frontend
Next.js – React framework
React – User Interface
Better Auth / Custom Authentication
React Toastify – Notifications
Gravity UI Icons – Icons
Backend
Node.js
Express.js
MongoDB
CORS
dotenv
📦 Main Packages
Frontend
React
Next.js
Better Auth
React Toastify
Gravity UI Icons
Backend
Express
MongoDB
CORS
dotenv
🔐 Security Features
Role-based authorization
Protected API routes
Protected dashboard pages
Admin-only management features
Secure MongoDB database operations
