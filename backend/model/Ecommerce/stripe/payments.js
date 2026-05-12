import mongoose from 'mongoose';
const paymentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        subscriptionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BuySubscription",
        },

        stripeInvoiceId: String,

        stripePaymentIntentId: String,

        amount: Number,

        currency: String,

        status: String,

        paidAt: Date,

        invoiceUrl: String,
    },
    {
        timestamps: true,
    }
);
const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;