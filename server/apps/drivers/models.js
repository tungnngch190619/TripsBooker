import mongoose from "../../config/database.js";

const driverSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    shift: {
        type: String,
        enum: ["Day", "Night"]
    },
    line_id: {type: Number, ref: "Line"}
},{timestamps: true})

export default mongoose.model("Driver", driverSchema);