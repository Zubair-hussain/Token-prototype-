import express from "express";
import cors from "cors";    // <-- import cors
import Stripe from "stripe";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Allow CORS from frontend origin
app.use(cors({
  origin: 'http://localhost:5173',  // allow your frontend origin
  methods: ['GET', 'POST', 'OPTIONS'],
}));

// Parse JSON normally
app.use(express.json());

// Parse raw body for Stripe webhook
app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
      console.log("💰 Payment succeeded:", event.data.object.id);
    }

    res.json({ received: true });
  }
);

app.post("/create-payment-intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 2000, // 20.00 USD
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    res.status(400).send({ error: { message: err.message } });
  }
});



app.listen(4242, () => console.log("Server running on port 4242"));
