import customer from "../../model/Ecommerce/customers.js";

const addCustomer = async (req, res) => {
    try {
        const { name, email, phone, address, city, state, zip, country } = req.body;
        const exist = await customer.findOne({ email });
        if (exist) {
            return res.status(400).json({ success: false, message: "Customer already exists" });
        }
        const newCustomer = await customer.create({ name, email, phone, address, city, state, zip, country });
        res.json({ success: true, message: "Customer added successfully", data: newCustomer });
    } catch (error) {
        console.error("Error adding customer:", error);
        res.status(500).json({ message: "Failed to add customer" });
    }
}

export { addCustomer };