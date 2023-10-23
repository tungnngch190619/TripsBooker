import mongoose from "../../config/database.js";

const driverSchema = new mongoose.Schema({
    _id: Number,
    fullName: String,
    phone: String,
    shift: {
        type: String,
        enum: ["Ngày", "Đêm"]
    },
    line_id: {type: Number, ref: "Line"}
},{timestamps: true})

export default mongoose.model("Driver", driverSchema);