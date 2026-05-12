import mongoose from 'mongoose';
const subscriptionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        planId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Plan",
        },

        stripeSubscriptionId: String,

        stripeCustomerId: String,

        stripePriceId: String,

        status: {
            type: String,
            enum: [
                "active",
                "trialing",
                "past_due",
                "canceled",
                "unpaid",
                "incomplete",
                "incomplete_expired",
                "paused",
                "open",
            ],
        },

        currentPeriodStart: Date,

        currentPeriodEnd: Date,

        cancelAtPeriodEnd: {
            type: Boolean,
            default: false,
        },

        canceledAt: Date,

        trialStart: Date,

        trialEnd: Date,
    },
    {
        timestamps: true,
    }
);

const BuySubscription = mongoose.model("BuySubscription", subscriptionSchema);
export default BuySubscription;