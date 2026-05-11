import mongoose from 'mongoose';

const planSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        description: String,

        features: [String],

        price: {
            type: Number,
            required: true,
        },

        currency: {
            type: String,
            default: "usd",
        },

        interval: {
            type: String,
            enum: ["month", "year"],
            required: true,
        },

        stripeProductId: {
            type: String,
            required: true,
        },

        stripePriceId: {
            type: String,
            required: true,
            index: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Plan = mongoose.model("Plan", planSchema);
export default Plan;