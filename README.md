# SparrowLMS — Learning Management System

A modern, full-stack Learning Management System built for online education. SparrowLMS supports course management, video learning with HLS streaming, assessments, progress tracking, and role-based dashboards for students, instructors, and admins.

---

## Features

### Student
- Role-based dashboard with stats, progress, upcoming classes, and activity feed
- My Courses with progress tracking and resume learning
- Browse and enroll in courses
- Assignment submission and tracking
- Notifications, calendar, profile, and settings pages

### Instructor
- Course creation and management
- Content upload with chunked/resumable video uploads
- Student analytics and progress monitoring

### Admin
- Platform-wide analytics and user management
- Course and enrollment oversight

### Platform
- JWT-based authentication with OTP email verification
- Password reset flow
- Theme toolbox (light/dark mode + color palette)
- HLS video streaming with FFmpeg transcoding and multi-resolution support
- Background job processing via Bull + Redis
- Secure media delivery via Cloudinary and AWS S3
- Stripe payment integration
- Rate limiting, XSS protection, and MongoDB sanitization

---

## Tech Stack

### Client
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite | Build tool and dev server |
| React Router v6 | Client-side routing |
| Tailwind CSS | Utility-first styling |
| Lucide React | Icon library |
| Axios | HTTP client |
| React Hook Form | Form management |
| React Hot Toast | Notifications |
| Zustand | Global state management |

### Server
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Primary database |
| JWT + bcryptjs | Authentication |
| Nodemailer | Email delivery |
| Cloudinary | Image and media storage |
| AWS S3 | Video file storage |
| FFmpeg (fluent-ffmpeg) | Video transcoding and HLS |
| Bull + Redis | Background job queues |
| Stripe | Payment processing |
| Winston | Structured logging |
| Helmet, HPP, xss-clean | Security middleware |

---

## Project Structure

```
SparrowLMS-Learning-Management-System/
├── client/                         # React + Vite frontend
│   ├── src/
│   │   ├── assets/styles/          # Global CSS and design tokens
│   │   ├── components/             # Reusable UI components
│   │   │   ├── auth/               # Auth form components
│   │   │   ├── browse/             # Browse courses components
│   │   │   ├── calendar/           # Calendar grid and event list
│   │   │   ├── classroom/          # Course learning components
│   │   │   ├── common/             # ThemeToolbox, shared UI
│   │   │   ├── courses/            # Student course card components
│   │   │   ├── dashboard/          # Student dashboard widgets
│   │   │   ├── assignments/        # Assignment components
│   │   │   ├── notifications/      # Notification components
│   │   │   ├── profile/            # Student profile components
│   │   │   ├── settings/           # Settings section components
│   │   │   └── layout/             # MainLayout, StudentLayout
│   │   ├── context/                # AuthContext, ThemeContext
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── pages/                  # Route-level page components
│   │   │   ├── auth/               # Login, Register, OTP, Forgot Password
│   │   │   ├── landing/            # Public home page
│   │   │   └── user/               # Student workspace pages
│   │   ├── routes/                 # AppRoutes, PrivateRoute, role guards
│   │   ├── services/               # Axios API service functions
│   │   └── utils/                  # Utility helpers
│   ├── .env.example
│   └── vercel.json
│
└── server/                         # Node.js + Express backend
    └── src/
        ├── config/                 # DB, Redis, Cloudinary config
        ├── middleware/             # Auth, error, rate limit, upload
        ├── modules/                # Feature modules (auth, course, user, ...)
        │   ├── auth/
        │   ├── course/
        │   ├── enrollment/
        │   ├── assessment/
        │   ├── video/
        │   ├── payment/
        │   ├── analytics/
        │   ├── instructor/
        │   ├── admin/
        │   └── user/
        ├── utils/                  # Logger, email, helpers
        └── app.js / server.js
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9
- MongoDB (local or Atlas)
- Redis (for background jobs)

### 1. Clone the repository

```bash
git clone https://github.com/mahendramahara/SparrowLMS-Learning-Management-System.git
cd SparrowLMS-Learning-Management-System
```

### 2. Set up the server

```bash
cd server
cp .env.example .env
# Fill in your environment variables in .env
npm install
npm run dev
```

### 3. Set up the client

```bash
cd client
cp .env.example .env
# Set VITE_API_BASE_URL to your server URL
npm install
npm run dev
```

The client runs at `http://localhost:5173` and the server at `http://localhost:5000`.

---

## Environment Variables

### Client (`client/.env`)

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL |
| `VITE_APP_NAME` | Application name |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe publishable key |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID |

See `client/.env.example` for the full list.

### Server (`server/.env`)

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `SMTP_*` | SMTP credentials for email |
| `CLOUDINARY_*` | Cloudinary API credentials |
| `AWS_*` | AWS S3 credentials for video storage |
| `REDIS_*` | Redis connection config |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `CLIENT_URL` | Frontend URL for CORS |

See `server/.env.example` for the full list.

---

## Deployment

### Client — Vercel

The client includes a `vercel.json` that configures SPA routing and build settings.

1. Push the repository to GitHub.
2. Import the project in [Vercel](https://vercel.com), selecting the `client/` directory as the root.
3. Add all required environment variables from `client/.env.example` in the Vercel dashboard.
4. Deploy — Vercel will run `npm run build` and serve the `dist/` output.

> **Important:** Set `VITE_API_BASE_URL` to your deployed server URL in the Vercel environment variables.

### Server — Railway / Render / VPS

1. Deploy to any Node.js-compatible host (Railway, Render, or a VPS).
2. Set all environment variables from `server/.env.example`.
3. Ensure MongoDB and Redis are accessible from the host.
4. The start command is: `npm start` (runs `node -r dotenv/config src/server.js`).

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Login and receive JWT |
| POST | `/api/v1/auth/logout` | Logout user |
| POST | `/api/v1/auth/send-otp` | Send email OTP |
| POST | `/api/v1/auth/verify-otp` | Verify OTP |
| POST | `/api/v1/auth/forgot-password` | Request password reset |
| POST | `/api/v1/auth/reset-password` | Reset password |
| GET | `/api/v1/auth/me` | Get authenticated user profile |
| GET | `/api/v1/courses` | List available courses |
| POST | `/api/v1/courses` | Create course (instructor) |
| POST | `/api/v1/enrollments` | Enroll in a course |
| GET | `/api/v1/analytics` | Platform analytics (admin) |

---

## Scripts

### Client

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm test` | Run tests with Vitest |

### Server

| Script | Description |
|---|---|
| `npm run dev` | Start with Nodemon (hot reload) |
| `npm start` | Start for production |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm test` | Run tests with Vitest |

---

## License

MIT — see [LICENSE](./LICENSE) for details.
