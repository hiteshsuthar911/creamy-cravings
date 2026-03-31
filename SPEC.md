# Creamy Cravings – Cheesecake Works

## 1. Concept & Vision

A luxury dessert e-commerce experience that feels like stepping into an upscale bakery. The website evokes warmth, indulgence, and artisanal craftsmanship. Every interaction should make users crave cheesecake—from the golden cream tones to smooth, buttery animations that mirror the texture of the desserts themselves.

**Personality:** Warm, luxurious, inviting, playful yet premium.

---

## 2. Design Language

### Aesthetic Direction
Inspired by high-end patisseries—think soft lighting, marble countertops, and golden accents. The design balances elegance with approachability: cream backgrounds, rich chocolate browns, and accents of strawberry pink and caramel gold.

### Color Palette
```
Primary:      #D4A574 (Warm Caramel)
Secondary:    #8B4513 (Saddle Brown - Chocolate)
Accent:       #E8B4B8 (Soft Strawberry Pink)
Background:   #FDF8F3 (Cream White)
Text Dark:    #3D2314 (Dark Chocolate)
Text Light:   #F5F0EB (Off-White)
Success:      #7CB342 (Fresh Green)
```

### Typography
- **Display:** Playfair Display (headings) — elegant serif for luxury feel
- **Body:** Inter (paragraphs) — clean, modern readability
- **Accent:** Cormorant Garamond (prices, quotes) — refined italic

### Spatial System
- Base unit: 4px
- Section padding: 80px vertical (desktop), 48px (mobile)
- Card border-radius: 16px
- Button border-radius: 8px

### Motion Philosophy
- **Entrance:** Fade-up with slight scale (0.95 → 1), 600ms ease-out, staggered 100ms
- **Hover:** Scale 1.02, shadow elevation, 200ms spring
- **Page transitions:** Smooth crossfade, 300ms
- **Scroll:** Parallax on hero, reveal on scroll for sections

### Visual Assets
- **Icons:** Lucide React (consistent stroke weight)
- **Images:** Unsplash cheesecake/dessert photography
- **Decorative:** Subtle grain texture overlay, curved dividers between sections

---

## 3. Layout & Structure

### Page Architecture

**Navbar (Fixed)**
- Logo (left)
- Navigation: Home | About | Favorites | Order | Testimonials | Contact
- Cart icon with badge (right)
- Mobile: Hamburger menu with slide-in drawer

**Footer**
- 4-column layout: Links, Links, Contact, Newsletter
- Social icons
- Copyright

### Pages

1. **Home** — Hero → Categories → Best Sellers → Why Us → Testimonials → CTA
2. **About** — Hero banner → Story → Chef → Kitchen gallery
3. **Favorites** — Featured grid with badges (Most Loved, Top Rated)
4. **Order** — Category tabs → Filters → Product grid → Cart sidebar
5. **Testimonials** — Carousel of reviews with photos
6. **Contact** — Form + Map + WhatsApp button

### Responsive Strategy
- Desktop: Full layouts, multi-column grids
- Tablet: 2-column grids, adjusted spacing
- Mobile: Single column, stacked sections, bottom sticky cart

---

## 4. Features & Interactions

### Home Page
- **Hero:** Full-viewport, parallax cheesecake image, animated text reveal, CTA button with hover glow
- **Categories Preview:** 4 cards (Poppers, Bambinos, 9" Cakes, Seasonal), hover lift effect
- **Best Sellers:** Horizontal scroll on mobile, 4-column grid on desktop
- **Why Choose Us:** Icon + text cards with staggered entrance
- **Testimonials Preview:** Single featured review with auto-rotation

### Order Page (Core Feature)
- **Category Tabs:** Poppers | Bambinos | 9" Cakes | Special | Seasonal
- **Filters:** Dropdown for flavor, price range slider, availability toggle
- **Product Cards:** Image, name, price, flavor badges, "Add to Cart" button
- **Cart Sidebar:** Slide-in from right, shows items, quantity controls, subtotal, checkout button
- **Pickup Selector:** Date picker (today/tomorrow) + time slots
- **Availability:** Real-time badge showing "Available Today" or next available date

### Build Your Own (Future Feature)
- Step 1: Choose size (Popper/Bambino/9")
- Step 2: Choose flavor (base)
- Step 3: Choose toppings
- Step 4: Review & add to cart

### Error/Empty States
- Empty cart: Illustration + "Your cart is empty" + CTA to browse
- No results: "No cheesecakes match your filters" + reset button
- Form errors: Inline red text below fields, shake animation

---

## 5. Component Inventory

### Navbar
- States: Default (transparent on hero), Scrolled (solid bg + shadow), Mobile (drawer open/closed)
- Cart badge: Red circle with count, pulse animation on add

### Hero Section
- Background: Gradient overlay on image
- Text: Animated word-by-word reveal
- CTA: Primary button with shimmer effect on hover

### Product Card
- Default: Image, name, price, flavor tag, "Add" button
- Hover: Image zoom 1.05, shadow elevation, button highlight
- In Cart: Checkmark overlay, "Added" state
- Out of Stock: Grayscale image, "Notify Me" button

### Category Card
- Default: Icon, name, count, subtle border
- Hover: Background fill, icon scale, shadow

### Cart Sidebar
- Closed: Hidden
- Open: 400px width slide-in, backdrop blur behind
- Item: Image thumbnail, name, quantity controls, remove button
- Footer: Subtotal, "Checkout" button (sticky)

### Testimonial Card
- Avatar, name, star rating, quote text
- Navigation dots for carousel

### Form Inputs
- Default: Light border, placeholder text
- Focus: Primary color border, subtle glow
- Error: Red border, shake, error message below
- Success: Green checkmark icon

### Buttons
- Primary: Caramel bg, dark text, hover darken + scale
- Secondary: Outline style, hover fill
- Ghost: Text only, hover underline

---

## 6. Technical Approach

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **State:** React Context for cart, local state for UI

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **API Style:** RESTful

### Data Models

**Product**
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: Enum['poppers', 'bambinos', '9inch', 'special', 'seasonal'],
  flavors: [String],
  image: String,
  badge: Enum['most-loved', 'top-rated', 'new', null],
  available: Boolean,
  calories: Number,
  ingredients: [String],
  featured: Boolean,
  createdAt: Date
}
```

**Order**
```javascript
{
  items: [{
    product: ObjectId,
    quantity: Number,
    customizations: Object
  }],
  pickupDate: Date,
  pickupTime: String,
  customerName: String,
  customerPhone: String,
  customerEmail: String,
  status: Enum['pending', 'confirmed', 'ready', 'completed'],
  total: Number,
  createdAt: Date
}
```

**Testimonial**
```javascript
{
  name: String,
  avatar: String,
  rating: Number (1-5),
  quote: String,
  product: String,
  createdAt: Date
}
```

### API Endpoints

**Products**
- `GET /api/products` — List all (with filters: category, flavor, minPrice, maxPrice)
- `GET /api/products/:id` — Single product
- `GET /api/products/featured` — Featured/best sellers
- `GET /api/products/categories` — All categories with counts

**Orders**
- `POST /api/orders` — Create order
- `GET /api/orders/:id` — Get order status
- `GET /api/orders` — List orders (admin)

**Testimonials**
- `GET /api/testimonials` — List all
- `POST /api/testimonials` — Add new (admin)

### Folder Structure
```
cake/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Helper functions
│   │   └── assets/         # Static assets
│   └── index.html
├── server/                 # Express backend
│   ├── models/            # Mongoose models
│   ├── routes/             # API routes
│   ├── controllers/        # Route handlers
│   └── index.js            # Server entry
├── package.json            # Root package.json
└── SPEC.md
```

---

## 7. Content

### Hero Text
- Headline: "Handcrafted Cheesecakes Made With Love"
- Subheadline: "Indulge in our award-winning recipes, made fresh daily with premium ingredients"
- CTA: "Order Now"

### Why Choose Us
1. **Fresh Ingredients** — Locally sourced dairy and premium toppings
2. **Handmade Daily** — Each cheesecake crafted with care
3. **Same Day Pickup** — Order today, pickup today

### Sample Products
- Classic New York (9") — $45
- Strawberry Swirl (Bambino) — $12
- Chocolate Truffle Poppers (6-pack) — $18
- Mango Tango (9") — $48
- Salted Caramel (Bambino) — $14

---

## 8. Performance & Accessibility

- Lazy load images below the fold
- Preload hero image
- Semantic HTML (nav, main, section, article)
- ARIA labels on interactive elements
- Keyboard navigation for cart and modals
- Color contrast ratio 4.5:1 minimum
