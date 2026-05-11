import express from 'express';
import Stripe from 'stripe';
const router = express.Router();
import dotenv from 'dotenv';
import { createPlan } from '../controllers/Ecommerce/plans.js';
dotenv.config();
/**
 * @swagger
 * /api/stripe:
 *   get:
 *     summary: Health check
 *     tags: [Stripe]
 *     responses:
 *       200:
 *         description: Stripe API is working
 */
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Health check
router.get('/', (req, res) => {
  res.send({ success: true, message: 'Stripe API Working 🚀' });
});

// Create PaymentIntent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', metadata } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      automatic_payment_methods: { enabled: true },
      currency,
      metadata,
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('❌ Stripe Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Create Checkout Session--means for one time payment only
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { productName, amount, image, items } = req.body;

    let line_items = [];

    if (items && Array.isArray(items)) {
      // Handle multiple items from cart
      line_items = items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));
    } else {
      // Handle single product "Buy Now"
      line_items = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
              images: [image],
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ];
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.REACT_APP_FRONTEND_URL || 'http://localhost:4000'}/products?payment=success`,
      cancel_url: `${process.env.REACT_APP_FRONTEND_URL || 'http://localhost:4000'}/products?payment=cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('❌ Stripe Checkout Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Create Subscription Checkout Session
router.post('/create-subscription-checkout-session', async (req, res) => {
  try {
    const { productName, amount, image, priceId, interval = 'month' } = req.body;

    // Create Stripe Product and Price
    // const product = await stripe.products.create({
    //   name: productName,
    //   images: [image],
    // });

    // const price = await stripe.prices.create({
    //   product: product.id,
    //   unit_amount: Math.round(amount * 100),
    //   currency: 'usd',
    //   recurring: { interval },
    // });
    // const priceId=price?.id
    // Create Checkout Session for subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.REACT_APP_FRONTEND_URL || 'http://localhost:4000'}/plans?payment=success`,
      cancel_url: `${process.env.REACT_APP_FRONTEND_URL || 'http://localhost:4000'}/plans?payment=cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('❌ Stripe Subscription Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post("/create-plan", createPlan)
router.get("/plans", async (req, res) => {
  try {
    const prices = await stripe.prices.list({
      active: true,
      type: "recurring",
      expand: ["data.product"], // include product info
    });

    const plans = prices.data.map((price) => ({
      priceId: price.id,
      id: price.id, // Add id for frontend compatibility
      productId: price.product.id,
      name: price.product.name,
      images: price.product.images, // Include product images
      description: price.product.description,
      unit_amount: price.unit_amount,
      currency: price.currency,
      interval: price.recurring?.interval,
      interval_count: price.recurring?.interval_count,
    }));

    return res.json(plans);
  } catch (error) {
    console.error("Error fetching plans:", error);
    return res.status(500).json({ error: "Unable to fetch plans" });
  }
});

router.post("/webhook", (req, res) => {
  const sig = req.headers["stripe-signature"];
  console.log("🔔 Webhook context:", {
    hasSignature: !!sig,
    bodyType: typeof req.body,
    rawBodyLength: req.rawBody ? req.rawBody.length : 'undefined'
  });

  if (!req.rawBody) {
    console.error("❌ req.rawBody is missing! Verify app.js middleware.");
    return res.status(500).send("Webhook Error: Raw body missing");
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed":
      console.log("Payment successful for one time purchase");
      break;
    case "checkout.session.expired":
      console.log("Payment expired");
      break;
    case "payment_intent.succeeded":
      console.log("Payment successful for one time purchase");
      break;
    case "invoice.paid":
      console.log("Payment successful for renewal");
      break;

    case "invoice.payment_failed":
      console.log("Payment failed");
      break;

    case "customer.subscription.deleted":
      console.log("Subscription cancelled");
      break;

    default:
      console.log(`Unhandled event: ${event.type}`);
  }

  res.sendStatus(200);
});


export default router;


//  switch (event.type) {
//                 case 'invoice.payment_succeeded':
//                     await this.handleInvoicePaymentSucceeded(
//                         event.data.object as Stripe.Invoice,
//                     );
//                     break;

//                 case 'invoice.payment_failed':
//                     await this.handleInvoicePaymentFailed(
//                         event.data.object as Stripe.Invoice,
//                     );
//                     break;

//                 case 'customer.subscription.deleted':
//                     await this.handleSubscriptionCancelled(
//                         event.data.object as Stripe.Subscription,
//                     );
//                     break;
//             }
