import mongoose from "../../config/database.js";

const lineSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    departure: {
        type: String,
        required: true
    },
    arrival: {
        type: String,
        required: true
    },
    frequency: {
        type: String,
        required: true,
        enum: ["15'", "30'", "1h", "2h", "3h", "4h", "5h"]
    },
    busType: {
        type: String,
        required: true,
        enum: ["Limousin", "Xe khách"]
    },
    numberOfSeat: {
        type: Number,
        required: true
    },
    plateNumber: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    assistant: {
        type: String,
    },
    drivers: [{type: Number, ref: "Driver"}],
    trips: [{type: Number, ref: "Trip"}]
},{timestamps: true})

export default mongoose.model("Line", lineSchema);