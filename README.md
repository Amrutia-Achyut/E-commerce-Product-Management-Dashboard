# E-commerce Product Management Dashboard

A server-side rendered (SSR) administrative dashboard for managing products in an e-commerce system built with Next.js.

## Features

- ✅ Server-side rendering using Next.js for improved performance and SEO
- ✅ **Authentication & Authorization** - Secure login system with session management
- ✅ **Beautiful Modern UI** - Mesmerizing gradient designs with glassmorphism effects
- ✅ Complete product management with CRUD operations
- ✅ Multi-step product creation forms with Yup validation
- ✅ Interactive data visualization for sales and stock metrics using Chart.js
- ✅ Secure image upload and storage using Cloudinary
- ✅ MongoDB database integration
- ✅ SWR for efficient data fetching

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Data Fetching**: SWR
- **Form Validation**: Yup
- **Data Visualization**: Chart.js
- **Image Storage**: Cloudinary
- **Database**: MongoDB with Mongoose

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB instance (local or MongoDB Atlas)
- Cloudinary account

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up environment variables:

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Update the following variables:
- `MONGODB_URI`: Your MongoDB connection string
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
- `ADMIN_USERNAME`: Admin username (default: `admin`)
- `ADMIN_PASSWORD`: Admin password (default: `admin123`)
- `AUTH_SECRET`: Secret key for JWT encryption (change in production)

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Login to the Dashboard:**
   - You will be redirected to the login page
   - Use the default credentials (or your custom ones from `.env.local`):
     - **Username**: `admin`
     - **Password**: `admin123`
   - After successful login, you'll be redirected to the dashboard

## Authentication

The dashboard is protected by authentication. Only authorized admins can access the dashboard and API routes.

### Default Credentials

- **Username**: `admin`
- **Password**: `admin123`


### Security Features

- JWT-based session management
- HttpOnly cookies for secure token storage
- Protected routes via middleware
- Automatic session expiration (24 hours)
- Logout functionality

### Changing Admin Credentials

To change the admin credentials, update your `.env.local` file:

```env
ADMIN_USERNAME=your_new_username
ADMIN_PASSWORD=your_new_password
```

For enhanced security in production, you can hash your password using bcrypt and set:

```env
ADMIN_PASSWORD_HASH=your_bcrypt_hashed_password
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── forms/            # Form components
│   ├── charts/           # Chart components
│   └── ui/               # UI components
├── lib/                   # Utility functions
│   ├── db/               # Database connection
│   └── validations/      # Yup schemas
└── models/               # Mongoose models
```

## Workflow

1. Admin requests the dashboard page
2. Server fetches product data from MongoDB
3. Page is rendered on the server and sent to the browser
4. Admin interacts with product forms and charts
5. Product data is created, updated, or deleted via API routes
6. UI refreshes by re-fetching the latest data using SWR

## License

MIT

