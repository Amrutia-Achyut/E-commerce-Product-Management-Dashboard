# Setup Guide

Follow these steps to get your E-commerce Product Management Dashboard up and running.

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/ecommerce-dashboard
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce-dashboard

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Authentication (Optional - defaults shown)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
AUTH_SECRET=your-secret-key-change-in-production

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### MongoDB Setup

**Option 1: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. Use: `mongodb://localhost:27017/ecommerce-dashboard`

**Option 2: MongoDB Atlas (Recommended)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace `<username>` and `<password>` in the connection string

### Cloudinary Setup

1. Sign up for a free account at [Cloudinary](https://cloudinary.com/)
2. Go to your Dashboard
3. Copy your:
   - Cloud Name
   - API Key
   - API Secret

## Step 3: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 4: Login to the Dashboard

1. Open [http://localhost:3000](http://localhost:3000) - You will be redirected to the login page
2. Use the default credentials:
   - **Username**: `admin`
   - **Password**: `admin123`
3. After successful login, you'll be redirected to the dashboard

## Step 5: Test the Application

1. You should see the dashboard with empty stats
2. Click "Add New Product" to create your first product
3. Fill out the multi-step form
4. Upload product images
5. View your products on the dashboard
6. Use the "Logout" button in the navigation to log out

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes (CRUD operations)
│   ├── dashboard/         # Dashboard pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── charts/           # Chart components (Chart.js)
│   ├── dashboard/        # Dashboard UI components
│   ├── forms/            # Form components with validation
│   └── products/         # Product list components
├── lib/                   # Utilities
│   ├── db/               # MongoDB connection
│   ├── cloudinary.ts     # Cloudinary config
│   └── validations/      # Yup schemas
└── models/               # Mongoose models
```

## Features Implemented

✅ Server-side rendering (SSR) with Next.js
✅ **Authentication & Authorization** - Secure login with session management
✅ Complete CRUD operations for products
✅ Multi-step form with Yup validation
✅ Image upload with Cloudinary
✅ Interactive charts (Chart.js)
✅ Real-time data updates with SWR
✅ Responsive design
✅ TypeScript support

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running (if using local)
- Check your connection string format
- Verify network access (if using Atlas)

### Cloudinary Upload Issues
- Verify your API credentials
- Check file size limits (max 5MB)
- Ensure image format is supported

### Build Errors
- Run `npm install` again
- Clear `.next` folder: `rm -rf .next`
- Check Node.js version (requires 18+)

## Authentication

The dashboard is protected by authentication. Default credentials:
- **Username**: `admin`
- **Password**: `admin123`

To change credentials, update `ADMIN_USERNAME` and `ADMIN_PASSWORD` in your `.env.local` file.

## Next Steps

- Implement product search and filtering
- Add pagination for product list
- Export data functionality
- Add more chart types
- Implement bulk operations

