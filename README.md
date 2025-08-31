

# (Wallet Token Prototype)


# Wallet Token Prototype

This is a **prototype web app + backend** that demonstrates how a digital pass (e.g., medical or payment pass) can be issued to patients after a Stripe payment and then added to **Apple Wallet** or **Google Wallet**.

It was built for interview/demo purposes and is **not production-ready**.  

---

## 🚀 Features

- **React Web Frontend**
  - Patient/doctor interface for triggering a payment simulation.
  - Displays generated pass tokens.
  - Provides "Add to Apple Wallet" / "Add to Google Wallet" options.

- **Express Backend (Node.js)**
  - Stripe webhook to handle payment events.
  - Generates **secure token** (`UUID` / `JWT`) per successful payment.
  - API endpoints for:
    - Generating wallet passes
    - Verifying passes
    - Admin controls (revoke/regenerate)
    - Sending pass via email (stubbed)

- **Wallet Integration**
  - **Apple Wallet:** `.pkpass` file (currently stubbed with dummy pass).
  - **Google Wallet:** JWT object (currently stubbed with dummy JWT).

---

## 🛠️ Tech Stack

- **Frontend:** React + Tailwind (or standard CSS)
- **Backend:** Node.js (Express, CORS, Body-parser)
- **Payments:** Stripe API (webhook + simulation)
- **Wallets:** 
  - Apple Wallet (PassKit API / `.pkpass`)
  - Google Wallet API (JWT)
- **Utilities:** UUID, JWT, dotenv

---

## ⚙️ Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/your-username/wallet-prototype.git
cd wallet-prototype
````

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=4000
STRIPE_SECRET_KEY=your_stripe_secret
GOOGLE_WALLET_KEY=your_google_wallet_key
APPLE_WALLET_CERT=your_apple_wallet_certificate
```

Run server:

```bash
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📱 API Endpoints

### Payments

* `POST /api/payment/simulate` → Generate a fake token (demo payment).
* `POST /webhook` → Stripe webhook (listen for `payment_intent.succeeded`).

### Wallet Pass

* `GET /generate-pass/apple/:token` → Generate Apple Wallet `.pkpass` (stubbed).
* `GET /generate-pass/google/:token` → Generate Google Wallet JWT (stubbed).

### Verification

* `GET /api/verify/:token` → Verify token validity (status, doctor, expiry).

### Admin

* `POST /admin/revoke` → Revoke an existing pass.
* `POST /admin/regenerate` → Reactivate & extend a pass.

### Email (Stub)

* `POST /api/email/send` → Log simulated email delivery.

---

## 📂 Project Structure

```
.
├── frontend/               # React web app
├── backend/                # Express backend
│   └── server.js
├── package.json
└── README.md
```

---

## ⚠️ Disclaimer

* This project is a **prototype only**.
* Security checks (e.g., validating Stripe webhook signatures, using real DB, secure certificates) are not fully implemented.
* Wallet passes are currently **stubbed** (not real passes).
* For demo/interview use only.

---

## 👤 Author

**Zubair Hussain**
Full Stack Developer | Data Analyst | Video Editor
Portfolio: [zubair-hussain-portfolio-hpne.vercel.app](https://zubair-hussain-portfolio-hpne.vercel.app)
