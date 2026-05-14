
import mongoose from "mongoose";

const RolesPermissionsSchema = new mongoose.Schema({
    roleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Roles",
        required: true,
    },
    permissionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permissions",
        required: true,
    }
}, { timestamps: true })

export default mongoose.model("RolesPermissions", RolesPermissionsSchema)