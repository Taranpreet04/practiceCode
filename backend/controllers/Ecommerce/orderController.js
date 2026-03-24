import Order from "../../model/Ecommerce/order.js";
import OrderItems from "../../model/Ecommerce/orderItems.js";
import Customer from "../../model/Ecommerce/customers.js";
import mongoose from "mongoose";

const getCustomerOrderDetail = async (req, res) => {
    try {
        const { customerId } = req.params;
        const customer = req.customer;
        console.log("customerId, customer==", customerId, customer)
        const OrderDetail = await Order.aggregate([
            {
                $match: {
                    customerId: new mongoose.Types.ObjectId(customerId)
                }
            },
            // {
            //     $sort: {
            //         "orderDate": -1
            //     }
            // },
            // {
            //     $limit: 1
            // },
            {
                $lookup: {
                    from: "orderitems",
                    localField: "_id",
                    foreignField: "orderId",
                    as: "orderItems"
                }
            },
            {
                $unwind: "$orderItems"
            },
            {
                $lookup: {
                    from: "products",
                    localField: "orderItems.productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $unwind: "$product"
            },
            {
                $group: {
                    _id: "$_id",
                    totalAmount: { $first: "$orderAmount" },
                    sumOfAmount: {
                        $sum: {
                            $multiply: ["$orderItems.quantity", "$orderItems.price"]
                        }
                    },
                    orderItems: {
                        $push: {
                            _id: "$orderItems._id",
                            productId: "$orderItems.productId",
                            quantity: "$orderItems.quantity",
                            price: "$orderItems.price",
                            product: "$product"
                        }
                    }
                }
            }
        ])
        res.json({ success: true, data: { ...customer?.toObject(), OrderDetail } });
    } catch (error) {
        console.error("Error fetching order details:", error);
        res.status(500).json({ message: "Failed to fetch order details" });
    }
}

const createOrder = async (req, res) => {
    try {
        const { customerId, orderItems, totalAmount, customer } = req.body;
        const order = await Order.create({ customerId: customerId, orderStatus: "done", orderAmount: totalAmount });
        if (orderItems?.length > 0) {
            await Promise.all(orderItems.map(async (item) => {
                await OrderItems.create({ orderId: order._id, productId: item.productId, quantity: item.quantity, price: item.price });
            }));
        }
        res.json({ success: true, message: "Order created successfully" });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Failed to create order" });
    }
}

export { getCustomerOrderDetail, createOrder };