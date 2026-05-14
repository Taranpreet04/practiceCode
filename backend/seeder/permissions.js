import Permissions from "../model/Permissions.js";
import Roles from "../model/Role.js";
import RolesPermissions from "../model/RolesPermissions.js";

const permissions = [
    {
        name: "create-user",
        description: "Create user",
    },
    {
        name: "read-user",
        description: "Read user",
    },
    {
        name: "update-user",
        description: "Update user",
    },
    {
        name: "delete-user",
        description: "Delete user",
    },
    {
        name: "create-role",
        description: "Create role",
    },
    {
        name: "read-role",
        description: "Read role",
    },
    {
        name: "update-role",
        description: "Update role",
    },
    {
        name: "delete-role",
        description: "Delete role",
    },
    {
        name: "create-permission",
        description: "Create permission",
    },
    {
        name: "read-permission",
        description: "Read permission",
    },
    {
        name: "update-permission",
        description: "Update permission",
    },
    {
        name: "delete-permission",
        description: "Delete permission",
    },
    {
        name: "approve-leaves",
        description: "Approve leaves",
    },
    {
        name: "reject-leaves",
        description: "Reject leaves",
    }
]

const seedPermissions = async () => {
    try {
        await Permissions.deleteMany();
        await Permissions.insertMany(permissions);
        console.log("Permissions seeded successfully");
    } catch (error) {
        console.log(error);
    }
}

const rolemap = [
    {
        roleName: "admin",
        permissions: ["create-user", "read-user", "update-user", "delete-user", "create-role", "read-role", "update-role", "delete-role", "create-permission", "read-permission", "update-permission", "delete-permission", "approve-leaves", "reject-leaves"],
    },
    {
        roleName: "manager",
        permissions: ["create-user", "read-user", "update-user", "delete-user", "approve-leaves", "reject-leaves"],
    },
    {
        roleName: "employee",
        permissions: ["create-user", "read-user", "update-user", "delete-user"],
    },
    {
        roleName: "client",
        permissions: [],
    },
]

const addRolesAndPermissions = async () => {
    try {
        await RolesPermissions.deleteMany();

        for (const roleEntry of rolemap) {
            if (roleEntry?.permissions) {
                for (const permissionName of roleEntry.permissions) {
                    const role = await Roles.findOne({ name: roleEntry.roleName });
                    const permission = await Permissions.findOne({ name: permissionName });

                    if (role && permission) {
                        const rolePermission = new RolesPermissions({
                            roleId: role._id,
                            permissionId: permission._id,
                        });
                        await rolePermission.save();
                    }
                }
            }
        }
        console.log("Roles and Permissions seeded successfully");
    } catch (error) {
        console.log(error);
    }
}

export { seedPermissions, addRolesAndPermissions }