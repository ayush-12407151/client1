# Modern Study Center - EdTech Platform

A premium, production-ready SaaS learning platform built with Next.js 15, Tailwind CSS, ShadCN UI, MongoDB, and NextAuth.

## Features

- **Modern UI/UX**: Premium aesthetic design using ShadCN UI and Framer Motion.
- **Authentication**: Secure JWT-based authentication using Auth.js (NextAuth) with Credentials and Google OAuth.
- **Role-Based Access Control**: Protected routes for Students, Instructors, and Admins via Next.js Middleware.
- **Video Hosting**: Embedded YouTube Unlisted video player to save server bandwidth and storage.
- **Payments**: Razorpay integration for secure checkout.
- **Admin Dashboard**: Comprehensive analytics and user/course management.
- **Instructor Dashboard**: Custom course creation wizard.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS, ShadCN UI, Framer Motion
- **Backend**: Next.js API Routes, Server Actions
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: NextAuth.js (Auth.js)
- **Payments**: Razorpay Node SDK

## Getting Started

### 1. Clone the repository and install dependencies

```bash
npm install
```

### 2. Set up Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
MONGODB_URI="your_mongodb_connection_string"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_random_secret_key"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
RAZORPAY_KEY_ID="your_razorpay_key"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment to Vercel

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and import your repository.
3. Add the Environment Variables from your `.env.local` file to the Vercel project settings.
4. Click **Deploy**. Vercel will automatically detect the Next.js framework and build your project.

## Admin Access

By default, the first user who logs in via Google is assigned the `STUDENT` role. 
To gain Admin access, you must connect to your MongoDB Atlas cluster and manually change the user's `role` to `ADMIN` in the `users` collection.
