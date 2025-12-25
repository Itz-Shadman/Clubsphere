Membership & Event Management Platform for Local Clubs

📌 Project Purpose

ClubSphere is a full-stack MERN web application designed to help people discover, join, and manage local clubs and events.
It enables Club Managers to manage clubs and events, Members to join clubs and register for events (free or paid), and Admins to oversee the entire platform including users, clubs, and payments.

This project demonstrates role-based access control, secure authentication, Stripe payment integration, and scalable CRUD operations with a modern UI.

🌐 Live Site

🔗 Live URL:
👉 

🧑‍💼 Admin Credentials (For Testing)

Admin Email:
chowdhuryshadman707@gmail.com
Admin Password:
shadman1122

🛠️  Technology Stack
Frontend

React 18

React Router DOM

Firebase Authentication

TanStack Query (React Query)

React Hook Form

Tailwind CSS

DaisyUI

Framer Motion

Axios

SweetAlert2 / React Hot Toast

Backend

Node.js

Express.js

MongoDB

Firebase Admin SDK (Token Verification)

Stripe (Test Mode)

JWT

CORS

dotenv

🔐 Authentication & Security

Firebase Authentication (Email/Password + Google)

Firebase Token verification on backend

JWT-based secure API access

Role-based route protection (Admin / Club Manager / Member)

Environment variables used for:

Firebase config

MongoDB URI

Stripe Secret Key

JWT Secret

👥 User Roles

Admin

Club Manager

Member

Each role has a separate dashboard with different permissions and routes.

✨ Key Features
🌍 Public Features

Browse all approved clubs

View upcoming events

Search clubs by name

Filter clubs by category

Sort clubs by membership fee or creation date

Responsive design for mobile, tablet, and desktop

🧑‍🎓 Member Features

Register & login (Email/Password + Google)

Join free or paid clubs

Stripe payment for paid memberships

View joined clubs

Register for events

View registered events

Payment history dashboard

🏢 Club Manager Features

Create & manage clubs

Set free or paid membership fees

Create, update, delete events

View club members

View event registrations

Track club-specific payments and statistics

🛡️ Admin Features

Admin dashboard overview

Approve / reject club creation requests

Manage all users & change roles

View all clubs and events

Monitor all payments

Platform-level statistics with charts

📊 Database Collections
users

name

email

photoURL

role (admin | clubManager | member)

createdAt

clubs

clubName

description

category

location

bannerImage

membershipFee

status (pending | approved | rejected)

managerEmail

createdAt

updatedAt

memberships

userEmail

clubId

status

paymentId

joinedAt

expiresAt

events

clubId

title

description

eventDate

location

isPaid

eventFee

maxAttendees

createdAt

eventRegistrations

eventId

clubId

userEmail

status

paymentId

registeredAt

payments

userEmail

amount

type (membership | event)

clubId

eventId

stripePaymentIntentId

status

createdAt

💳 Stripe Payment Integration

Stripe test mode enabled

Secure backend payment intent creation

Paid memberships & paid events supported

Membership/event created only after successful payment

🎨 UI & UX Highlights

Clean, modern, recruiter-friendly design

Consistent color theme

Equal height cards for clubs & events

Framer Motion animations

Skeleton loaders during data fetching

Friendly error & 404 pages

Fully responsive dashboard layout

🚀 Deployment

Frontend deployed on Netlify

Backend deployed on Vercel

Firebase authorized domains configured

Private routes preserved on reload

No CORS, 404, or reload issues

📦 NPM Packages Used (Important)
Client

react

react-router-dom

@tanstack/react-query

react-hook-form

firebase

axios

framer-motion

sweetalert2

tailwindcss

daisyui

Server

express

mongodb

cors

dotenv

jsonwebtoken

stripe

firebase-admin

📁 GitHub Repositories

Client Repository:


Server Repository:
