import seedRoles from "./roles.js";
import connectDb from "../config/connectDb/connectMongoDb.js";
import { seedPermissions, addRolesAndPermissions } from "./permissions.js";

const addRoles = async () => {
    try {
        await seedRoles();
    } catch (error) {
        console.log(error);
    }
}
const addPermissions = async () => {
    try {
        await seedPermissions();
    } catch (error) {
        console.log(error);
    }
}
(async () => {
    await connectDb();
    await addRoles();
    await addPermissions();
    await addRolesAndPermissions();
})()
    .then(() => {
        console.log("All seeded successfully");
        process.exit(0);
    })
    .catch((error) => {
        console.log(error);
        process.exit(1);
    })