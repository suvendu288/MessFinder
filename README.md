# MessFinder

MessFinder is a full-stack MERN application that connects students who are
admitted to nearby colleges with mess and room owners. Students can search,
filter, and view mess/room listings and contact owners directly. Owners can
register, create listings with images, and manage their listings from a
dedicated dashboard.

---

## Features

### For Students
- Register and log in as a student
- Search and filter listings by keyword, location, and room type
- View detailed listing pages with images, facilities, rent, and description
- Contact owners directly (view phone/email from the listing page)
- View and manage their profile

### For Owners
- Register and log in as an owner
- Add new mess/room listings with multiple images
- Edit and delete their own listings
- View all their listings from an Owner Dashboard
- View and manage their profile

### General
- JWT-based authentication with hashed passwords (bcryptjs)
- Role-based access control (student / owner)
- Protected routes on both frontend and backend
- Image upload with Multer, served statically from the backend
- Fully responsive, modern blue-and-white UI built with plain CSS

---

## Tech Stack

**Frontend:** React.js (Vite), React Router DOM, Axios, Context API, CSS

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Multer,
dotenv, CORS

---

## Folder Structure

```
MessFinder/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── listingController.js
│   │   └── uploadController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Listing.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── listingRoutes.js
│   │   └── uploadRoutes.js
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── ListingCard.jsx
    │   │   ├── SearchBar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── Loading.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── StudentDashboard.jsx
    │   │   ├── OwnerDashboard.jsx
    │   │   ├── AddListing.jsx
    │   │   ├── EditListing.jsx
    │   │   ├── ListingDetails.jsx
    │   │   └── Profile.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   └── listingService.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

---

## Prerequisites

- Node.js (v18 or later recommended)
- MongoDB installed and running locally (or a MongoDB Atlas connection string)
- npm (comes with Node.js)

---

## Installation & Setup

### 1. Clone / Open the Project

Open the `MessFinder` folder in VS Code.

### 2. Backend Setup

```bash
cd backend
npm install
```

The `.env` file is already created in `backend/.env` with the following
variables:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/messfinder
JWT_SECRET=messfinder_secret_key
```

Make sure MongoDB is running locally on port `27017` (or update
`MONGO_URI` to point to your MongoDB Atlas cluster).

Start the backend server:

```bash
npm run dev
```

The backend will run at `http://localhost:5001`.

### 3. Frontend Setup

Open a **new terminal window/tab**:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at `http://localhost:5173`.
The Vite dev server is configured to proxy `/api` and `/uploads` requests
to `http://localhost:500`, so the frontend and backend work together
seamlessly during development.

### 4. Open the App

Visit `http://localhost:5173` in your browser.

---

## Environment Variables (backend/.env)

| Variable     | Description                              | Example                                   |
|--------------|-------------------------------------------|--------------------------------------------|
| PORT         | Port the backend server runs on           | 5000                                        |
| MONGO_URI    | MongoDB connection string                 | mongodb://127.0.0.1:27017/messfinder        |
| JWT_SECRET   | Secret key used to sign JWT tokens        | messfinder_secret_key                       |

---

## API Documentation

Base URL: `http://localhost:50001/api`

### Auth Routes (`/api/auth`)

| Method | Endpoint          | Access   | Description                          |
|--------|-------------------|----------|--------------------------------------|
| POST   | `/register`       | Public   | Register a new user (student/owner)  |
| POST   | `/login`          | Public   | Log in and receive a JWT token       |
| GET    | `/profile`        | Private  | Get the logged-in user's profile     |

**Register Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123",
  "role": "student"
}
```

**Login Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Listing Routes (`/api/listings`)

| Method | Endpoint                     | Access          | Description                                 |
|--------|-------------------------------|-----------------|----------------------------------------------|
| GET    | `/`                           | Public          | Get all listings (supports query filters)     |
| GET    | `/:id`                        | Public          | Get a single listing by ID                    |
| GET    | `/owner/my-listings`          | Private (Owner) | Get listings created by the logged-in owner   |
| POST   | `/`                           | Private (Owner) | Create a new listing                          |
| PUT    | `/:id`                        | Private (Owner) | Update a listing (must be the owner)          |
| DELETE | `/:id`                        | Private (Owner) | Delete a listing (must be the owner)          |

**Query Filters for GET `/api/listings`:**
`location`, `collegeNearby`, `roomType`, `minRent`, `maxRent`, `search`

**Create/Update Listing Request Body:**
```json
{
  "title": "Cozy Single Room near ABC College",
  "description": "A well-furnished single room with attached mess facility.",
  "location": "Sector 12, Delhi",
  "collegeNearby": "ABC College of Engineering",
  "rent": 6000,
  "roomType": "Single",
  "facilities": ["WiFi", "AC", "Laundry"],
  "foodAvailable": true,
  "images": ["/uploads/images-12345.jpg"]
}
```

### Upload Route (`/api/upload`)

| Method | Endpoint | Access   | Description                                  |
|--------|----------|----------|-----------------------------------------------|
| POST   | `/`      | Private  | Upload up to 6 images (multipart/form-data)   |

Uploaded images are stored in `backend/uploads/` and served publicly at
`http://localhost:50001/uploads/<filename>`.

**Form field name:** `images` (supports multiple files)

---

## User Roles

1. **Student** — Can browse, search, and view listings, and contact owners.
2. **Owner** — Can create, edit, delete, and manage their own listings.

---

## Notes

- All passwords are hashed using bcryptjs before being stored.
- JWT tokens are stored in the browser's `localStorage` on the frontend and
  attached to protected API requests automatically via an Axios interceptor.
- Protected routes on the frontend redirect unauthenticated users to the
  login page, and redirect users without the correct role to the home page.
- The listing images are uploaded through the `/api/upload` endpoint first,
  then the returned image URLs are included in the listing creation/update
  request.

---

## License

This project was created for educational purposes.
