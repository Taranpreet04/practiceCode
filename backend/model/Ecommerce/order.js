import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    orderStatus: {
        type: String,
        required: true
    },
    orderAmount: {
        type: Number,
        required: true
    },

});

const Order = mongoose.model("Order", OrderSchema);

export default Order;