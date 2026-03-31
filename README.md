# Creamy Cravings - Cheesecake Works

A luxury dessert e-commerce website featuring handcrafted cheesecakes, built with React, Node.js, Express, and MongoDB.

## Features

- **Home Page**: Hero section, category preview, best sellers, testimonials, and call-to-action
- **About Page**: Brand story, team members, and kitchen gallery
- **Favorites Page**: Filterable list of best-selling cheesecakes
- **Order Page**: Category tabs, filters, product grid, and cart functionality
- **Testimonials Page**: Customer reviews with star ratings
- **Contact Page**: Contact form, business info, and WhatsApp integration

## Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Framer Motion
- React Router
- Lucide React Icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
```bash
cd Cake
```

2. Install all dependencies:
```bash
npm run install:all
```

### Configuration

1. Create a `.env` file in the `server` directory:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/creamy-cravings
JWT_SECRET=replace_with_a_long_random_secret
ADMIN_EMAIL=admin@creamycravings.com
ADMIN_PASSWORD=change-me
```

2. (Optional) Create `client/.env` only if you want to override the default same-origin API path:
```env
VITE_API_URL=/api
```

### Running the Application

**Development Mode (runs both frontend and backend):**
```bash
npm run dev
```

**Frontend only:**
```bash
npm run client
```

**Backend only:**
```bash
npm run server
```

### Seeding the Database

To populate the database with sample products and testimonials:
```bash
npm run seed
```

## Deploy to Render

This repo is ready for a single-service Render deploy. The Express server serves the built Vite app in production, so the frontend and API can live on the same domain.

1. Push this project to GitHub or GitLab.
2. In Render, create a new Blueprint or Web Service from the repo.
3. If you use the included `render.yaml`, Render will create one Node web service with:
   - Build command: `npm run build:render`
   - Start command: `npm start`
   - Health check: `/api/health`
4. Set these environment variables in Render:
   - `MONGODB_URI`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `JWT_SECRET` (auto-generated if you use `render.yaml`)
5. After the first deploy, run `npm run seed` once against the production database from the Render Shell, or run it locally while pointed at your production `MONGODB_URI`.
6. Open the live site at your Render URL and sign in at `/admin/login`.

Notes:
- The included `render.yaml` assumes the `singapore` region. Change that before the first deploy if your customers are mainly elsewhere.
- The `free` Render plan is fine for a first launch, but it can sleep when idle. Upgrade if you want faster first-load times.

## Project Structure

```
cake/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/       # React context (Cart)
│   │   └── hooks/         # Custom hooks
│   └── public/             # Static assets
├── server/                 # Express backend
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   └── index.js           # Server entry
├── render.yaml            # Render deployment blueprint
├── SPEC.md                # Design specifications
└── package.json          # Root package.json
```

## API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/categories` - Get categories with counts
- `GET /api/products/:id` - Get single product

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id/status` - Update order status

### Testimonials
- `GET /api/testimonials` - List all testimonials
- `POST /api/testimonials` - Add testimonial

## Design System

### Colors
- Primary: `#D4A574` (Caramel)
- Secondary: `#8B4513` (Chocolate)
- Accent: `#E8B4B8` (Strawberry)
- Background: `#FDF8F3` (Cream)

### Fonts
- Display: Playfair Display
- Body: Inter
- Accent: Cormorant Garamond

## License

MIT
