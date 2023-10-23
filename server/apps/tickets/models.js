import mongoose from "../../config/database.js";

const ticketSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    customer: {type:Number, ref: "Customer"},
    trip: {type: Number, ref: "Trip"},
    createdDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        default: "Mở",
        enum: ["Mở", "Đóng"]
    }
},{timestamps: true})

export default mongoose.model("Ticket", ticketSchema);