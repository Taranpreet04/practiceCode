import connectDb from "../config/connectDb.js";
import Customer from "../model/Ecommerce/customers.js";

const customers = [
    {
        "name": "John Doe",
        "email": "john@yopmail.com",
        "phone": "1234567890",
        "address": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zip": "10001",
        "country": "USA"
    },
    {
        "name": "micheal",
        "email": "micheal",
        "phone": "1234567809",
        "address": "123 Main St",
        "city": "Lucknow",
        "state": "UP",
        "zip": "226001",
        "country": "India"
    }
]

const seedCustomers = async () => {
    try {
        await Customer.deleteMany({});
        await Customer.insertMany(customers);
        console.log("Customers seeded successfully");
        process.exit();
    } catch (error) {
        console.error("Error seeding customers:", error);
        process.exit();
    }
}

(async () => {
    await connectDb();
    await seedCustomers();
})();