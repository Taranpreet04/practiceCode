import mongoose from "mongoose";
import RolesPermissions from "../model/RolesPermissions.js";


const fetchPermisionsByRoleId = async (req, res) => {
    const { roleId } = req.params;
    console.log(roleId)
    try {
        // const permisions = await RolesPermissions.find({ roleId }).populate("roleId").populate("permissionId");
        const permisions = await RolesPermissions.aggregate([
            {
                $match: {
                    roleId: new mongoose.Types.ObjectId(roleId)
                }
            },
            {
                $lookup: {
                    from: "permissions",
                    localField: "permissionId",
                    foreignField: "_id",
                    as: "permissions"
                }
            },
            {
                $unwind: "$permissions"
            },
            {
                $lookup: {
                    from: "roles",
                    localField: "roleId",
                    foreignField: "_id",
                    as: "roles"
                }
            },
            {
                $unwind: "$roles"
            },
            {
                $group: {
                    _id: "$roles._id",
                    roleName: { $first: "$roles.name" },
                    permissions: { $push: "$permissions.name" }
                }
            }
        ])


        res.json({ permisions });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export { fetchPermisionsByRoleId }