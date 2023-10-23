import mongoose from "../../config/database.js";
import date from "date-and-time";

const tripSchema = mongoose.Schema({
    _id: Number,
    startTime: {
        type: Date,
        required: true
    },
    tickets: [{type: Number, ref: "Ticket"}],
    remainingSeats: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["CHƯA ĐI", "ĐÓN KHÁCH", "ĐANG ĐI", "TRẢ KHÁCH", "ĐÃ ĐẾN", "HUỶ"]
    },
    line: {type: Number, ref: "Line"}
},{timestamps: true})

export default mongoose.model("Trip", tripSchema);