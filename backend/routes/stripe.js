const express = require('express');
const Stripe = require('stripe');
const router = express.Router();
require('dotenv').config();

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

module.exports = router;

