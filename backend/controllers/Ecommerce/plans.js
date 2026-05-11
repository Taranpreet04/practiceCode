import Plan from "../../model/Ecommerce/stripe/plans.js";
import Stripe from 'stripe';
import dotenv from "dotenv";
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const createPlan = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            interval,
            features,
            currency,
        } = req.body;
        console.log("req.body", req.body);
        // Create slug
        // const slug = slugify(name, {
        //     lower: true,
        //     strict: true,
        // });
        const slug = name.toLowerCase().replaceAll(" ", "-");
        // Check existing plan
        const existingPlan = await Plan.findOne({ slug });

        if (existingPlan) {
            return res.status(400).json({
                success: false,
                message: "Plan already exists",
            });
        }

        // Create Stripe Product
        const product = await stripe.products.create({
            name,
            description,
        });

        // Create Stripe Price
        const stripePrice = await stripe.prices.create({
            unit_amount: price * 100,
            currency: currency || "usd",

            recurring: {
                interval,
            },

            product: product.id,
        });

        // Save in MongoDB
        const plan = await Plan.create({
            name,
            slug,
            description,
            features,
            price,
            currency: currency || "usd",
            interval,

            stripeProductId: product.id,
            stripePriceId: stripePrice.id,
        });

        return res.status(201).json({
            success: true,
            message: "Plan created successfully",
            data: plan,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export { createPlan };