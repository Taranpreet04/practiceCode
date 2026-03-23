const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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

    // orderItems: {
    //     type: Array,
    //     required: true
    // }
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;