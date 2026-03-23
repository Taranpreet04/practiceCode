import User from "../../model/users";

const getOrderDetail = async (req, res) => {
    try {
        const { userId } = req.params;
        // const order = await Order.find({ userId });
        const OrderDetail = await User?.aggregate([
            {
                $match: {
                    _id: userId
                }
            },
            {
                $lookup: {
                    from: "orders",
                    localField: "_id",
                    foreignField: "userId",
                    as: "order"
                }
            },
            {
                $unwind: "$order"
            },
            {
                $sort: {
                    "order.orderDate": -1
                }
            },
            {
                $limit: 1
            },
            {
                $lookup: {
                    from: "orderItems",
                    localField: "order._id",
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
                    userName: { $first: "$userName" },
                    order: { $first: "$order" },
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
        res.json(OrderDetail);
    } catch (error) {
        console.error("Error fetching order details:", error);
        res.status(500).json({ message: "Failed to fetch order details" });
    }
}