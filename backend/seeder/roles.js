import Roles from "../model/Role.js";

const roles = [
    {
        name: "admin",
        description: "Admin role",
    },
    {
        name: "manager",
        description: "manager role",
    },
    {
        name: "employee",
        description: "employee role",
    },
    {
        name: "client",
        description: "client role",
    },
]

const seedRoles = async () => {
    try {
        await Roles.deleteMany();
        await Roles.insertMany(roles);
        console.log("Roles seeded successfully");
    } catch (error) {
        console.log(error);
    }
}
export default seedRoles;