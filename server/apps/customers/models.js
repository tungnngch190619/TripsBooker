import mongoose from "../../config/database.js";

//Customer Schema
const customerSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    name: String,
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowerCase: true,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?      ^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/],
    },
    Phone: Number,
    tickets: [{type: Number, ref: "Ticket"}],
},{timestamps: true});

export default mongoose.model("Customer", customerSchema);