import Stripe from 'stripe';
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import dotenv from "dotenv";
import Plan from "../../model/Ecommerce/stripe/plans.js";
import BuySubscription from "../../model/Ecommerce/stripe/buySubscription.js";
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

const getPlans = async (req, res) => {
    try {
        const userId = req.query.userId;
        console.log("userId==", userId)
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }
        // const prices = await stripe.prices.list({
        //   active: true,
        //   type: "recurring",
        //   expand: ["data.product"], // include product info
        // });

        // const plans = prices.data.map((price) => ({
        //   priceId: price.id,
        //   id: price.id, // Add id for frontend compatibility
        //   productId: price.product.id,
        //   name: price.product.name,
        //   images: price.product.images, // Include product images
        //   description: price.product.description,
        //   price: price.unit_amount,
        //   currency: price.currency,
        //   interval: price.recurring?.interval,
        //   interval_count: price.recurring?.interval_count,
        // }));
        const planData = await Plan.find()
        const activePlan =
            await BuySubscription.aggregate([
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(userId),
                        status: "active",
                    },
                },

                {
                    $lookup: {
                        from: "plans",

                        localField: "planId",

                        foreignField: "_id",

                        as: "plan",
                    },
                },

                {
                    $unwind: {
                        path: "$plan",
                        preserveNullAndEmptyArrays: true,
                    },
                },

                {
                    $project: {
                        planId: 1,

                        name: "$plan.name",

                        description:
                            "$plan.description",

                        price: "$plan.price",

                        interval:
                            "$plan.interval",

                        features:
                            "$plan.features",

                        currentPeriodEnd: 1,

                        currentPeriodStart: 1,

                        status: 1,

                        userId: 1,

                        createdAt: 1,

                        updatedAt: 1,
                    },
                },
            ]);
        return res.json({ planData, activePlan: activePlan[0] || null });
    } catch (error) {
        console.error("Error fetching plans:", error);
        return res.status(500).json({ error: "Unable to fetch plans" });
    }
}

const cancelSubscription = async (req, res) => {
    try {
        const { subscriptionId, userId } = req.body;
        const subscription = await BuySubscription.findOne({ userId: userId, _id: subscriptionId });
        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found",
            });
        }
        const cancelledSubscription = await stripe.subscriptions.cancel(
            subscription.stripeSubscriptionId
        );
        console.log("cancelledSubscription", cancelledSubscription);
        subscription.status = cancelledSubscription.status;
        subscription.cancelAtPeriodEnd = cancelledSubscription.cancel_at_period_end;
        await subscription.save();
        return res.status(200).json({
            success: true,
            message: "Subscription canceled successfully",
            data: subscription,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const upgradeSubscription = async (req, res) => {

    try {

        const {
            userId,
            newPlanId,
        } = req.body;

        // Find current subscription
        const subscription =
            await BuySubscription.findOne({
                userId,
                status: "active",
            });

        if (!subscription) {

            return res.status(404).json({
                success: false,
                message:
                    "Active subscription not found",
            });
        }

        // Find new plan
        const newPlan =
            await Plan.findById(newPlanId);

        if (!newPlan) {

            return res.status(404).json({
                success: false,
                message: "Plan not found",
            });
        }

        // Get old Stripe subscription
        const stripeSubscription =
            await stripe.subscriptions.retrieve(
                subscription.stripeSubscriptionId
            );

        // old subscription item id
        const subscriptionItemId =
            stripeSubscription.items.data[0]
                .id;

        // Upgrade subscription
        const updatedSubscription =
            await stripe.subscriptions.update(
                subscription.stripeSubscriptionId,
                {
                    items: [
                        {
                            id: subscriptionItemId,

                            price:
                                newPlan.stripePriceId,
                        },
                    ],

                    proration_behavior:
                        "create_prorations",
                }
            );

        // Update DB
        subscription.planId =
            newPlan._id;

        subscription.stripePriceId =
            newPlan.stripePriceId;

        subscription.status =
            updatedSubscription.status;

        await subscription.save();

        return res.status(200).json({
            success: true,
            message:
                "Subscription upgraded successfully",

            data: updatedSubscription,
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const webhooks = async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    console.log("inside wehook")
    // Verify webhook signature
    try {
        event = stripe.webhooks.constructEvent(
            req.rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error(
            "❌ Webhook signature verification failed:",
            err.message
        );

        return res
            .status(400)
            .send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {

            /**
             * CHECKOUT COMPLETED
             * First successful subscription purchase
             */
            case "checkout.session.completed": {

                const session = event.data.object;

                console.log(
                    "✅ Checkout session completed", session
                );

                // Only for subscriptions
                if (session.mode === "subscription") {

                    // Fetch full subscription from Stripe
                    const stripeSubscription =
                        await stripe.subscriptions.retrieve(
                            session.subscription
                        );

                    console.log("stripeSubscription", JSON.stringify(
                        stripeSubscription,
                        null,
                        2
                    ))
                    console.log("current_period_start",
                        stripeSubscription.items.data[0]
                            .current_period_start
                    );

                    console.log(
                        "current_period_end",
                        stripeSubscription.items.data[0]
                            .current_period_end
                    );

                    // Prevent duplicate save
                    const existingSubscription =
                        await BuySubscription.findOne({
                            stripeSubscriptionId:
                                stripeSubscription.id,
                        });

                    if (!existingSubscription) {

                        const subscription =
                            new BuySubscription({
                                userId:
                                    session.metadata.userId,

                                planId:
                                    session.metadata.planId,

                                stripeSubscriptionId:
                                    stripeSubscription.id,

                                stripeCustomerId:
                                    stripeSubscription.customer,

                                stripePriceId:
                                    stripeSubscription.items.data[0]
                                        .price.id,

                                status:
                                    stripeSubscription.status,

                                currentPeriodStart:
                                    new Date(
                                        stripeSubscription.items.data[0]
                                            .current_period_start *
                                        1000
                                    ),

                                currentPeriodEnd:
                                    new Date(
                                        stripeSubscription.items.data[0]
                                            .current_period_end *
                                        1000
                                    ),

                                cancelAtPeriodEnd:
                                    stripeSubscription.cancel_at_period_end,

                                canceledAt:
                                    stripeSubscription.canceled_at
                                        ? new Date(
                                            stripeSubscription.canceled_at *
                                            1000
                                        )
                                        : null,

                                trialStart:
                                    stripeSubscription.trial_start
                                        ? new Date(
                                            stripeSubscription.trial_start *
                                            1000
                                        )
                                        : null,

                                trialEnd:
                                    stripeSubscription.trial_end
                                        ? new Date(
                                            stripeSubscription.trial_end *
                                            1000
                                        )
                                        : null,
                            });

                        await subscription.save();

                        console.log(
                            "✅ Subscription saved in DB"
                        );
                    }
                }

                break;
            }

            /**
             * SUBSCRIPTION UPDATED
             * Upgrade / downgrade / renewals
             */
            case "customer.subscription.updated": {

                const subscription =
                    event.data.object;

                console.log(
                    "🔄 Subscription updated"
                );

                await BuySubscription.findOneAndUpdate(
                    {
                        stripeSubscriptionId:
                            subscription.id,
                    },
                    {
                        stripePriceId:
                            subscription.items.data[0].price.id,

                        status: subscription.status,

                        currentPeriodStart:
                            new Date(
                                subscription.current_period_start *
                                1000
                            ),

                        currentPeriodEnd:
                            new Date(
                                subscription.current_period_end *
                                1000
                            ),

                        cancelAtPeriodEnd:
                            subscription.cancel_at_period_end,

                        canceledAt:
                            subscription.canceled_at
                                ? new Date(
                                    subscription.canceled_at *
                                    1000
                                )
                                : null,
                    }
                );

                console.log(
                    "✅ Subscription updated in DB"
                );

                break;
            }

            /**
             * SUBSCRIPTION CANCELLED
             */
            case "customer.subscription.deleted": {

                const subscription =
                    event.data.object;

                console.log(
                    "❌ Subscription cancelled"
                );

                await BuySubscription.findOneAndUpdate(
                    {
                        stripeSubscriptionId:
                            subscription.id,
                    },
                    {
                        status: "canceled",

                        canceledAt: new Date(),
                    }
                );

                console.log(
                    "✅ Subscription marked canceled"
                );

                break;
            }

            /**
             * RENEWAL PAYMENT SUCCESS
             */
            case "invoice.paid": {

                const invoice = event.data.object;

                console.log(
                    "💰 Invoice paid"
                );

                break;
            }

            /**
             * PAYMENT FAILED
             */
            case "invoice.payment_failed": {

                const invoice = event.data.object;

                console.log(
                    "❌ Payment failed"
                );

                // Optional:
                // send email
                // notify user
                // mark status

                break;
            }

            /**
             * CHECKOUT EXPIRED
             */
            case "checkout.session.expired": {

                console.log(
                    "⌛ Checkout session expired"
                );

                break;
            }

            default:
                console.log(
                    `Unhandled event: ${event.type}`
                );
        }

        res.sendStatus(200);

    } catch (error) {

        console.error(
            "❌ Webhook handler error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export { createPlan, cancelSubscription, getPlans, upgradeSubscription, webhooks };