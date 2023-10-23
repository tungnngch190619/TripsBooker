import mongoose from "../../config/database.js";

const BlackListSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        ref: "User",
    },
},
{timestamps: true});

export default mongoose.model("Blacklist", BlackListSchema);