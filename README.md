# Baby Power – Wholesale Baby Clothing Website

A modern, SEO-friendly, mobile-responsive wholesale baby clothing website built with Next.js, Express.js, and MongoDB.

## Tech Stack

- **Frontend:** Next.js 15, React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Admin:** JWT Authentication, Role-based Access

## Features

- Public website with Home, Shop, Product Detail, About, Contact, FAQ, and policy pages (Return, Shipping, Terms, Privacy)
- Product catalog with category filtering, search, sort, and pagination
- Quotation request system (no cart/checkout)
- Lead management (contact + quotation leads)
- Admin panel with full CRUD for products, categories, FAQs, and pages
- Admin dashboard with statistics and charts
- SEO optimized (meta tags, Open Graph, Twitter cards, sitemap, robots.txt, schema markup)

## Prerequisites

- Node.js 18+
- MongoDB is **optional** for local dev (in-memory DB is used automatically)

## Quick Start

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure environment (optional)

```bash
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
```

### 3. Start everything (recommended)

```bash
npm run dev
```

This automatically:
- Starts an in-memory MongoDB (no install required)
- Seeds sample data
- Starts the API and frontend

| Service | URL |
|---------|-----|
| Website | http://localhost:3000 |
| Admin | http://localhost:3000/admin |
| API | http://localhost:5001 |

**Default admin credentials:**
- Email: `admin@babypower.com`
- Password: `Admin@123456`

### MongoDB options

| Command | When to use |
|---------|-------------|
| `npm run dev` | No MongoDB installed — uses in-memory DB + auto-seed (data resets on each restart) |
| `npm run seed:memory` | Test seed only (data not persisted) |
| `npm run seed` | When you have MongoDB running on `localhost:27017` |
| `npm run dev:local` | When using local/Docker MongoDB after seeding |
| `npm run mongo:docker` | Start MongoDB via Docker (if Docker is installed) |

For persistent data, use Docker (`docker compose up -d` then `npm run seed` && `npm run dev:local`) or set `MONGODB_URI` in `backend/.env` to a [MongoDB Atlas](https://www.mongodb.com/atlas) connection string.

**macOS note:** Port 5000 is often used by AirPlay Receiver. The API defaults to port `5001` to avoid conflicts.

**Important:** Always run `npm run dev` from the **project root** (`baby_power/`), not from `frontend/` alone. Running only the frontend dev server will leave the API offline and the site will show empty catalogue data.

## Project Structure

```
baby_power/
├── backend/          # Express.js API
│   ├── src/
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Route handlers
│   │   └── middleware/   # Auth, upload, error handling
│   └── uploads/      # Uploaded images
├── frontend/         # Next.js website
│   └── src/
│       ├── app/          # Pages (App Router)
│       ├── components/   # React components
│       └── lib/          # API client, types, utils
└── package.json      # Root scripts
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products |
| GET | `/api/products/slug/:slug` | Get product by slug |
| GET | `/api/categories` | List categories |
| POST | `/api/leads/contact` | Submit contact form |
| POST | `/api/leads/quotation` | Submit quotation request |
| POST | `/api/auth/login` | Admin login |
| GET | `/api/dashboard/stats` | Dashboard statistics (auth) |

## Design

- **Primary:** #01C7FC
- **Secondary:** #001C23
- **Fonts:** Poppins (headings), Inter (body)

## Security

- JWT authentication for admin
- bcrypt password hashing
- Rate limiting on API and form submissions
- Helmet security headers
- Secure file upload validation

## License

Private – All rights reserved.
