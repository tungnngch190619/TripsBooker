import Driver from "./models.js";
import getIncrementId from "../../config/AutoIncrement.js";
import { DRIVER_COL } from "../../constants/collections.js";
import { SUCCESS, UNKNOWN_ERROR } from "../../constants/messages.js";

export async function createNewDriver( req, res ) {
    const newId = await getIncrementId(DRIVER_COL);
    const newDriver = new Driver({
        _id: newId,
        fullName: req.body.fullName,
        phone: req.body.phone,
        shift: req.body.shift
    });
    const driver = await newDriver.save();
    return res.status(200)
    .json({
        message: SUCCESS,
        data: driver
    })
};

export function getOneDriver (req, res) {
    Driver.findOne({_id: req.params.driverId}, {_id: 0})
    .then( result => {
        res.status(200).send(result);
    });
};

export function getAllDrivers( req, res ) {
    Driver.find({}, {
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
    })
    .then( result => {
        res.status(200).send(result);
    }).catch(err => {
        res.status(500).json({
            message: "Có lỗi xảy ra",
            error: err
        });
    });
}

export function updateOneDriver ( req, res) {
    let {fullName, phone, shift} = req.body
    Driver.findByIdAndUpdate({_id: req.params.driverId}, {
        fullName: fullName,
        phone: phone,
        shift: shift
    })
    .then( result => {
        res.status(200).json({
            message: SUCCESS,
            data: result
        });
    }).catch(err => {
        res.status(500).json({
            message: UNKNOWN_ERROR,
            error: err
        });
    });
};

export function deleteOneDriver ( req, res ) {
    Driver.findByIdAndDelete({_id: req.params.driverId})
    .then( result =>  {
        res.status(200).json({
            message: SUCCESS,
            data: result
        });
    });
};