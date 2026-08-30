# Mama Joy's Cosmetics and Collections

A full online store for **Mama Joy's Cosmetics and Collections** (Bantima, Kumasi).
The owner can upload products (name, price, description, images, category, stock),
and customers can browse, add to bag, and pay securely in Ghana cedis (GHS) with
**Paystack**.

The project is split into two independent apps so you can deploy them separately:

```
mama-joys-cosmetics/
├── backend/    Node.js + Express + PostgreSQL API, deploys to Render
└── frontend/   React (Vite) storefront + admin dashboard, deploys to Vercel
```

Product photos are stored directly on a **Render persistent disk** attached to
the backend service, and served from the API at `/uploads/<filename>`. The
database is **PostgreSQL**, via Render's managed Postgres.

---

## A cost note before you start

> **Persistent disks on Render require a paid instance** — they are not
> available on Render's free web service tier. This project's `render.yaml`
> uses the **Starter** instance (~$7/month at time of writing), which is the
> smallest instance that supports a disk, plus a small monthly fee for the disk
> itself. Render's managed Postgres also has a free tier with limited storage
> (check Render's current pricing page, as free-tier terms change).
>
> If you'd rather keep everything free, the alternative is to store images in
> a third-party service like Cloudinary instead of a Render disk — happy to
> switch this back if the cost becomes a concern.

---

## 1. What you'll need before you start

| Service | What it's for | Sign up |
|---|---|---|
| **GitHub** | Store your code | https://github.com |
| **Paystack** | Collects payments in GHS | https://dashboard.paystack.com/#/signup |
| **Render** | Hosts the backend API, database, and file storage | https://render.com |
| **Vercel** | Hosts the storefront website | https://vercel.com |

---

## 2. Push the code to GitHub

```bash
cd mama-joys-cosmetics
git init
git add .
git commit -m "Initial commit: Mama Joy's Cosmetics and Collections"
```

Create a new empty repository on GitHub (no README/license), then:

```bash
git remote add origin https://github.com/<your-username>/<your-repo>.git
git branch -M main
git push -u origin main
```

---

## 3. Set up Paystack (GHS payments)

1. Sign up and complete your business profile.
2. Go to **Settings > API Keys & Webhooks**.
3. Copy your **Secret Key** (starts with `sk_test_...` for testing, `sk_live_...`
   once approved for live payments).
4. Once you have your frontend URL (from step 6), come back and set the
   **Webhook URL** to: `https://your-backend.onrender.com/api/payment/webhook`

---

## 4. Deploy the backend to Render (API + Postgres + Disk)

The included `backend/render.yaml` blueprint sets up the web service, the
persistent disk for product photos, and a managed Postgres database together.

1. On Render, click **New > Blueprint** and connect your GitHub repo. Render
   will read `backend/render.yaml` automatically.
2. Review the plan: it creates a **Starter** web service (required for the
   disk), a **1GB persistent disk** mounted at `/var/data/uploads`, and a
   Postgres database.
3. After it provisions, fill in the environment variables Render leaves blank:

   | Key | Value |
   |---|---|
   | `CLIENT_ORIGIN` | your Vercel URL, e.g. `https://mama-joys-cosmetics.vercel.app` |
   | `PAYSTACK_SECRET_KEY` | from Paystack |
   | `PAYSTACK_CALLBACK_URL` | `https://your-vercel-site.vercel.app/payment/callback` |

   (`DATABASE_URL`, `DB_SSL`, `UPLOAD_DIR`, and `JWT_SECRET` are wired up
   automatically by the blueprint.)

4. Deploy. Once live, note your backend URL, e.g.
   `https://mama-joys-cosmetics-api.onrender.com`.

   **Prefer manual setup instead of a Blueprint?** Create a Postgres instance
   and a Starter web service by hand, set **Root Directory** to `backend`,
   build command `npm install`, start command `npm start`, add a **1GB disk**
   mounted at `/var/data/uploads`, and set the environment variables listed in
   `backend/.env.example`.

5. **Create the first admin login.** From your local machine, copy
   `backend/.env.example` to `backend/.env`, fill in your real
   `DATABASE_URL` (the "External Database URL" shown on your Render Postgres
   instance) and `DB_SSL=true`, then run:

   ```bash
   cd backend
   npm install
   npm run seed:admin
   ```

   This creates the login the business owner will use at `/admin/login`.

---

## 5. Deploy the frontend to Vercel

1. On Vercel, click **Add New > Project** and import the same GitHub repo.
2. Set **Root Directory** to `frontend`.
3. Framework preset: **Vite** (auto-detected).
4. Add an Environment Variable:

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://your-backend.onrender.com/api` |

5. Deploy. Your storefront will be live at `https://<your-project>.vercel.app`.
6. Go back to Render and Paystack and make sure `CLIENT_ORIGIN` and
   `PAYSTACK_CALLBACK_URL` match this exact Vercel URL, then redeploy the
   backend so the change takes effect.

`frontend/vercel.json` is already included so client-side routing (React
Router) works correctly on refresh/direct links.

---

## 6. Using the site

- **Customers:** visit your Vercel URL, browse `/shop`, add products to their
  bag, and check out. Payment happens on Paystack's secure page; GHS amounts
  are shown throughout.
- **Business owner (admin):** visit `https://your-site.vercel.app/admin/login`
  and sign in with the email/password you set in `ADMIN_EMAIL` /
  `ADMIN_PASSWORD` when running `npm run seed:admin`. From the dashboard you
  can add products (with up to 5 photos), edit or hide products, and
  track/update orders.

---

## 7. Running locally (for development)

You'll need a local PostgreSQL server running (e.g. via
[Postgres.app](https://postgresapp.com/) on Mac, or Docker: `docker run --name
mjc-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16`), with
a database created for the project (e.g. `createdb mama_joys_cosmetics`).

**Backend:**
```bash
cd backend
cp .env.example .env   # fill in your real DATABASE_URL (DB_SSL=false locally)
npm install
npm run seed:admin      # first time only
npm run dev
```

Uploaded images are saved locally to `backend/uploads/` (created
automatically) when `UPLOAD_DIR` is left as `./uploads`.

**Frontend** (in a separate terminal):
```bash
cd frontend
cp .env.example .env    # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

Visit `http://localhost:5173`.

> Note: Paystack test cards/mobile money numbers can be used in test mode —
> see Paystack's documentation for current test credentials.

---

## 8. Business details baked into the site

- **Name:** Mama Joy's Cosmetics and Collections
- **Location:** Bantima, Kumasi
- **Phone / WhatsApp:** 0244948390
- **Currency:** Ghana Cedis (GHS)
- **Theme:** Gold, White, and Black

To change any of these (delivery fees, categories, contact info), edit
`frontend/src/config/site.js`.

---

## 9. Favicon, SEO, and launch checklist

The frontend now ships with:

- **Favicons** for every context: browser tab (`favicon.ico`, 16x16, 32x32),
  iOS home screen (`apple-touch-icon.png`), and Android/PWA (`android-chrome-*.png`
  + `site.webmanifest`) — all generated from your logo.
- **Per-page SEO titles/descriptions** — the browser tab title and meta
  description update for Home, Shop (and per category), each Product page,
  About, Contact, Checkout, and the order confirmation page.
- **Open Graph + Twitter Card tags** so links shared on WhatsApp, Facebook,
  and X/Twitter show a proper preview card with `frontend/public/social-preview.jpg`.
- **Structured data (JSON-LD)** — a `Store`/`LocalBusiness` schema site-wide
  (name, phone, address) for Google's local search/knowledge panel, plus a
  `Product` schema on every product page (name, price, currency, stock
  status) so products are eligible for Google's rich product results.
- **`robots.txt`** allowing crawling of the storefront while blocking
  `/admin`, `/checkout`, and `/payment/callback`.
- **`sitemap.xml`** listing the static pages (Home, Shop, About, Contact).

### One thing you must do after deploying

All of the above reference a placeholder domain: `https://your-domain.example.com`.
Once your site has a real address (your Vercel URL, or a custom domain if you
buy one), replace every occurrence of `your-domain.example.com` with it in:

- `frontend/index.html` (canonical link, `og:url`, `og:image`, `twitter:image`)
- `frontend/public/robots.txt`
- `frontend/public/sitemap.xml`

A quick way to find them all:
```bash
grep -rl "your-domain.example.com" frontend/
```

### An honest limitation worth knowing

This storefront is a client-side rendered React app (no server-side
rendering). Google's crawler does execute JavaScript and can generally index
pages like this, but other search engines and some social-media link
scrapers are less reliable at it, and product pages won't be indexed until
Google's crawler actually loads and runs the page. For a small local
business this is usually fine — but if search ranking for individual
products becomes a priority later, the typical next step is migrating the
storefront to a framework with server-side rendering or static generation
(e.g. Next.js), so pages arrive pre-rendered with content search engines can
read immediately. Happy to help with that migration if/when it's worth it.

### Optional additions you may want later (not included)

- **Legal pages** — done. The site now has a **Return & Refund Policy**
  (`/returns`), **Privacy Policy** (`/privacy-policy`), and **Terms of
  Service** (`/terms`), linked from the footer and referenced at checkout.
  The return policy includes the rule you gave us: customers must contact
  the business immediately upon receiving their order if something is
  wrong, and requests made more than 2 days after delivery aren't accepted.
  **Note:** this content was drafted by Claude, not a lawyer — it's a
  reasonable starting point for a small retail store, but it's worth having
  someone review it against Ghana's consumer protection rules before you
  rely on it for anything contentious.
- **Analytics** (Google Analytics, Meta Pixel, etc.) — still not added,
  since it needs a choice of tool (and a cookie-consent banner in some
  cases). Let me know which tool you'd like and I'll wire it in.
- **Google Search Console / Bing Webmaster verification** — once you have a
  domain, you can verify ownership (usually a meta tag or DNS record) to
  submit your sitemap and monitor indexing directly.

## 10. Technical notes

- The database tables are created/updated automatically on server startup
  (`sequelize.sync({ alter: true })` in `backend/server.js`). This keeps setup
  simple for a site this size. If the project grows significantly, consider
  switching to versioned Sequelize migrations instead.
- Product images, order records, and admin credentials all live in Postgres
  and on the attached disk — back up your Render Postgres instance
  periodically (Render takes automatic daily snapshots of paid databases and
  disks, but it's worth knowing where your data lives).
- If you ever need to move the backend to a different host that doesn't
  support persistent disks, the cleanest swap is back to a service like
  Cloudinary for image storage — only `backend/middleware/upload.js` and
  `backend/utils/fileStorage.js` would need to change.
