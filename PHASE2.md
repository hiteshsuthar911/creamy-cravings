# Creamy Cravings - Phase 2 (Next Features)

This doc outlines the recommended implementation plan after the MVP is working.

## 1) Coupon System

### Data model
- `Coupon`
  - `code` (unique, uppercase)
  - `discountType` (`percent` | `fixed`)
  - `discountValue` (number)
  - `minSubtotal` (number, optional)
  - `startsAt`, `endsAt` (dates)
  - `usageLimit` (number, optional)
  - `usedCount` (number)

### Backend API
- `POST /api/coupons/validate`
  - body: `{ code, subtotal }`
  - returns: `{ valid: boolean, discountAmount, appliedCode, error? }`
- Optional: `POST /api/orders/apply-coupon`
  - to atomically reserve usage and store coupon on the order.

### Frontend UI
- Add a “Coupon code” input in `CartSidebar`
- Show “applied” state + recalculated total (before placing order)

### Order integration
- Extend `Order` schema to store `coupon` and `discountAmount` and update `total` accordingly.

## 2) Live Availability (Today / Tomorrow)

### Recommended approach
Instead of a boolean `available`, use pickup slot availability.

#### Data model
- `AvailabilitySlot`
  - `date` (YYYY-MM-DD)
  - `time` (e.g. `10:00 AM`)
  - `maxPoppers`, `maxBambinos`, `maxNineInch` (or a generalized `maxByCategory`)

#### Backend API
- `GET /api/availability?date=YYYY-MM-DD`
  - returns enabled/disabled slots for each category (or global slot enablement).

### Frontend behavior
- On Order page: when selecting date/time, show enabled slots only
- In ProductCard: show “Available Today” / “Tomorrow” badge based on the chosen pickup date

## 3) Order Tracking Page

### UX
- Customer can open `/order-tracking`
- Enter:
  - `orderId`
  - and either `phone` (recommended) or `email`
- Show current status timeline: `pending -> confirmed -> ready -> completed`

### Backend API
- `POST /api/orders/track`
  - body: `{ orderId, customerPhone }`
  - returns: `{ order, statusTimeline }` (public-safe)

### Implementation note
The existing public `GET /api/orders/:id` is admin-friendly but not customer-safe.
Prefer a dedicated “track” endpoint that validates the customer’s phone.

## 4) Build Your Own Cheesecake Wizard

### UX steps (MVP for configurator)
1. Choose size (Popper / Bambino / 9")
2. Choose base flavor
3. Choose toppings (multi-select)
4. Review price + ingredients summary
5. Add to cart as a customizable item

### Data / Pricing
Since the `Order` model already supports `customizations: Mixed`, we can store:
- `customizations.size`
- `customizations.baseFlavor`
- `customizations.toppings[]`
- `customizations.priceBreakdown` (optional)

Add a `CustomRecipe` collection (optional) if you want toppings to be DB-managed.
Otherwise, start with seed data + compute price on the frontend for MVP, and validate server-side on checkout.

### Backend integration
- When placing an order, preserve `customizations` on each item.
- For totals:
  - Either compute totals server-side from a product/topping mapping
  - Or accept `customItemTotal` but validate against server rules (recommended)

## 5) Razorpay (Post-MVP)

### Flow
1. Checkout creates a Razorpay order: `POST /api/payments/create`
2. Frontend uses Razorpay checkout UI
3. Backend verifies payment signature
4. Backend updates order status based on payment success (e.g. `pending -> confirmed`)

### Backend endpoints
- `POST /api/payments/create`
  - body: `{ orderId, amount, currency }`
- `POST /api/payments/verify`
  - body: `{ razorpayPaymentId, razorpayOrderId, razorpaySignature }`

### Order status mapping
- Payment success: set `status = confirmed`
- Then admin sets `ready/completed`

