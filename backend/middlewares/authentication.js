import Customer from "../model/Ecommerce/customers.js";

const isCustomer = async (req, res, next) => {
    try {
        const customerId = req.params.customerId || req.body.customerId;
        if (!customerId) {
            return res.status(400).json({ success: false, message: "Customer ID is required" });
        }
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }
        req.customer = customer;
        next();
    } catch (error) {
        console.error("Error fetching customer:", error);
        res.status(500).json({ success: false, message: "Failed to fetch customer" });
    }
}
export { isCustomer };