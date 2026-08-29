# Kurti Store — Myntra-style E-commerce Starter

A working full-stack starter for your kurti clothing brand: React frontend + Node/Express
backend + MongoDB + Razorpay payments + Cloudinary image uploads.

## 🚀 Quick start

Every service auto-detects: if real keys are filled into `backend/.env`, the
real service is used. If a service's keys are left blank, a safe simulated
fallback kicks in automatically — no flag to toggle, just fill in keys as you
get each account set up.

```bash
# Terminal 1
cd backend
npm install
npm run dev

# Terminal 2
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. On first run, 4 sample kurti products and a
demo admin account are auto-seeded into whichever database is connected
(real or in-memory).

**Demo admin login**: `admin@demo.com` / `admin123` — use this account's token
to add/edit/delete products via the admin API routes.

If `MONGO_URI` is blank, an in-memory database is used instead (data resets
on restart). If Razorpay keys are blank, checkout uses a simulated payment
that auto-succeeds, so you can still test the full cart → checkout → order
flow before Razorpay is set up.

## Real setup (for going live with real payments)

## Adding your real products (Admin Panel)

No Postman/curl needed — there's a proper admin panel in the browser now:

1. Sign up on the website normally (creates a regular customer account)
2. In MongoDB Atlas, open your cluster → Browse Collections → `kurti-store` →
   `users` collection → find your user → change `role` from `"customer"` to
   `"admin"` → save
3. Log out and log back in on the website
4. You'll now see an **"Admin"** link in the navbar → click it
5. Click **"+ Add Product"** and fill in the form: name, description,
   category, price, photos (upload from your device, or paste an image URL
   if Cloudinary isn't set up yet), and sizes/colors/stock
6. Save — your product is live on the store immediately

You can edit or remove any product (including the 4 sample ones) from the
same Admin panel.

## What's already built
- Product catalog with filters, sorting, search (backend + frontend)
- Product detail page with size/color selection
- Cart (persisted in browser) and multi-step checkout
- User signup/login (JWT auth)
- Order placement with **real Razorpay payment integration** (test mode ready)
- Order history page
- Admin-only routes to add/edit products and manage orders
- Image upload to Cloudinary
- Review system on products

When you're ready for real customers and real payments:
1. **Get free/test API keys** (all have free tiers to start):
   - MongoDB Atlas (free cluster): https://www.mongodb.com/cloud/atlas ✅ already connected
   - Razorpay (test mode, no KYC needed to start): https://dashboard.razorpay.com/
   - Cloudinary (free tier): https://cloudinary.com/
2. In `backend/.env`, fill in `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and the `CLOUDINARY_*` values as you get them
3. In `frontend/.env`, set `VITE_RAZORPAY_KEY_ID` to your real Razorpay key once you have it
4. Restart the backend after adding any new keys — it auto-detects and switches from simulated to real for that service
5. Customize colors/branding in `frontend/tailwind.config.js` (currently pink `#d6336c` — change to your brand color)
6. Deploy (see Deployment section)

### Creating your admin account
1. Sign up normally through the website (creates a `customer` role user)
2. In MongoDB Atlas, open the `users` collection and manually change that user's
   `role` field from `"customer"` to `"admin"`
3. Now you can call the admin-only product routes (POST/PUT/DELETE `/api/products`)
   using that account's JWT token — e.g. with Postman, or build a simple admin
   dashboard page later.

### Adding your first product (example, via Postman/curl with admin token)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Floral Anarkali Kurti",
    "slug": "floral-anarkali-kurti",
    "description": "Cotton anarkali kurti with floral print, perfect for daily wear.",
    "category": "Kurti",
    "fabric": "Cotton",
    "occasion": "Casual",
    "price": 1299,
    "discountPrice": 999,
    "images": ["https://your-cloudinary-url.jpg"],
    "variants": [
      { "size": "M", "color": "Blue", "stock": 10, "sku": "KRT-001-M-BLU" },
      { "size": "L", "color": "Blue", "stock": 8, "sku": "KRT-001-L-BLU" }
    ]
  }'
```

## Deployment (when ready to go live)
- **Backend**: Render, Railway, or AWS EC2/Elastic Beanstalk
- **Frontend**: Vercel or Netlify (just point it at your deployed backend's URL)
- **Database**: MongoDB Atlas (already cloud-hosted)
- **Images**: Cloudinary (already cloud-hosted)
- Update `CLIENT_URL` in backend `.env` and `VITE_API_URL` in frontend `.env` to
  your real deployed URLs before going live.
- Switch Razorpay from test mode to live mode (requires business KYC on Razorpay).

## Next features to build (in priority order)
1. Admin dashboard UI (currently API-only — a simple React admin panel to add
   products without Postman)
2. Wishlist page (backend already supports it on the User model)
3. Product reviews UI on the product detail page (API already exists)
4. Order tracking/shipping integration (Shiprocket or Delhivery API)
5. SMS/email order notifications (MSG91 or SendGrid — env vars already scaffolded)
6. Search autocomplete
7. Coupon/discount codes

## Continuing this build in Claude Code
Open this folder in Claude Code and use a prompt like:

> This is a Myntra-style e-commerce project for my kurti clothing brand (Node/Express
> backend, React/Tailwind frontend, MongoDB, Razorpay). I've already built [X feature].
> Next, help me build [next feature from the README's "Next features" list]. Keep the
> existing code style and folder structure.
