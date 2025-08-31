// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ===== In-memory store for demo purposes =====
// Replace with real DB in production
const passes = {}; // { token: { patient, doctor, status, expires, ... } }

// ===== Stripe Webhook Endpoint =====
app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  // TODO: Verify Stripe signature with your Stripe secret
  // Example: stripe.webhooks.constructEvent(req.body, signature, endpointSecret)

  // Parse event
  const event = JSON.parse(req.body);

  if (event.type === "payment_intent.succeeded") {
    // Payment succeeded, generate pass token & save metadata

    const paymentIntent = event.data.object;

    // Generate secure token (UUID or JWT)
    const token = uuidv4(); // or use jwt.sign(payload, secret)

    // Save pass info (replace with DB save)
    passes[token] = {
      patient: "John D.",
      doctor: "Dr. Smith",
      status: "active",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // expires in 30 days
    };

    // TODO: Trigger pass generation (Apple Wallet / Google Wallet) here

    console.log("Generated pass token:", token);
  }

  res.status(200).send("Webhook received");
});

// ===== Simulated Payment (for prototype) =====
app.post("/api/payment/simulate", (req, res) => {
  // Simulate successful payment & generate pass token

  const token = uuidv4();

  passes[token] = {
    patient: "Jane S.",
    doctor: "Dr. Who",
    status: "active",
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };

  res.json({ token });
});

// ===== Apple Wallet Pass Generation (stub) =====
app.get("/generate-pass/apple/:token", (req, res) => {
  const { token } = req.params;

  // TODO: Lookup pass info from DB
  const passInfo = passes[token];
  if (!passInfo) return res.status(404).send("Pass not found");

  // TODO: Use passkit-generator or node-pkpass to create .pkpass file
  // Here: send dummy response for prototype
  res.setHeader("Content-Type", "application/vnd.apple.pkpass");
  res.send(`Dummy Apple Wallet pass for token: ${token}`);
});

// ===== Google Wallet Pass JWT Generation (stub) =====
app.get("/generate-pass/google/:token", (req, res) => {
  const { token } = req.params;

  // TODO: Lookup pass info from DB
  const passInfo = passes[token];
  if (!passInfo) return res.status(404).send("Pass not found");

  // TODO: Create JWT with Google Wallet API credentials & pass info
  // For prototype, return dummy JWT string
  const dummyJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

  res.json({ jwt: dummyJwt });
});

// ===== Verification Endpoint =====
app.get("/api/verify/:token", (req, res) => {
  const { token } = req.params;

  const pass = passes[token];
  if (!pass) return res.status(404).json({ error: "Pass not found" });

  // Return pass info with status, patient initials, doctor, expiration, disclaimer
  res.json({
    status: pass.status,
    patient: pass.patient,
    doctor: pass.doctor,
    expires: pass.expires,
    disclaimer: "For authorized use only. Privacy protected.",
  });
});

// ===== Admin API: Revoke Pass =====
app.post("/admin/revoke", (req, res) => {
  const { token } = req.body;

  if (!passes[token]) return res.status(404).json({ error: "Pass not found" });

  passes[token].status = "revoked";

  res.json({ message: `Pass ${token} revoked` });
});

// ===== Admin API: Regenerate Pass =====
app.post("/admin/regenerate", (req, res) => {
  const { token } = req.body;

  if (!passes[token]) return res.status(404).json({ error: "Pass not found" });

  // For regeneration, you might want to create a new token or update pass info
  // Here, we'll simulate by extending expiry and reactivating status
  passes[token].status = "active";
  passes[token].expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  res.json({ message: `Pass ${token} regenerated` });
});

// ===== Email sending stub =====
app.post("/api/email/send", (req, res) => {
  // TODO: Integrate with SendGrid / MailerSend / Postmark
  // req.body should contain patient email, token, pass links, etc.

  console.log("Send email with pass add buttons:", req.body);

  res.json({ message: "Email sending simulated" });
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
