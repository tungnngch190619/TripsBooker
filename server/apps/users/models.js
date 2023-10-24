import mongoose from "../../config/database.js";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();
//User schema
const userSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowerCase: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String
    },
    active: {
        type: Boolean,
        required: true,
    },
    role: {
        type: String,
        enum: ["Admin", "Staff"],
        default: "Admin"
    }
},
{timestamps: true})

userSchema.methods.generateAccessJWT = function () {
     console.log(this._id);
    let payload = {
      id: this._id,
    };
    return jwt.sign(payload, process.env.SECRET_ACCESS_TOKEN, {
      expiresIn: '20m',
    });
  };

export default mongoose.model("User", userSchema);