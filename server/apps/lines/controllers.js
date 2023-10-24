import getIncrementId from "../../config/AutoIncrement.js";
import { LINE_COL } from "../../constants/collections.js";
import { MISSING_REQUIRED_FIELD, SUCCESS, UNKNOWN_ERROR } from "../../constants/messages.js";
import Line from "./models.js";

export function getAllLines (req, res) {
    Line.find({}, {
        createdAt: 0,
        updatedAt: 0,
        drivers: 0,
        trips: 0,
        __v: 0,
    })
    .then(result => {
        return res.status(200).send(result);
    }).catch(err => {
        return res.status(500).json({
            message: UNKNOWN_ERROR
        });
    });
};
export function getAllLinesWithoutRefs (req, res) {
    Line.find({}, {
        createdAt: 0,
        updatedAt: 0,
        drivers: 0,
        trips: 0,
        __v: 0,
    })
    .then(result => {
        return res.status(200).send(result);
    }).catch(err => {
        return res.status(500).json({
            message: UNKNOWN_ERROR
        });
    });
};

export async function getOneLine ( req, res ) {
    const foundLine = await Line.findById(req.params.lineId)
    .populate("drivers");
    if(!foundLine) {
        return res.status(500)
        .json({
            message: UNKNOWN_ERROR
        })
    }
    return res.status(200)
    .send(foundLine);
}

export async function createNewLine (req, res) {
    const lineId = await getIncrementId(LINE_COL);
    console.log(lineId);
    const newLine = new Line({
        _id: lineId,
        departure: req.body.departure,
        arrival: req.body.arrival,
        frequency: req.body.frequency,
        busType: req.body.busType,
        numberOfSeat: req.body.numberOfSeat,
        plateNumber: req.body.plateNumber,
        drivers: req.body.driverIds,
        price: req.body.price,
    });
    if(!newLine.departure || !newLine.arrival || !newLine.frequency || !newLine.busType || !newLine.numberOfSeat ) {
        return res.status(403).json({
            message: MISSING_REQUIRED_FIELD
        })
    }
    try {
        const line = await newLine.save();
        if(!line) throw "Thêm tuyến không thành công";
        console.log("Create new line successfully");
        return res.status(200)
        .json({
            message: SUCCESS,
            data: line
        })
    } catch(err) {
        return res.status(500).json({
            message: err
        })
    }
    
};

export function updateOneLine (req, res) {
    Line.findByIdAndUpdate({_id: req.params.lineId}, {$set: {
        departure: req.body.departure,
        arrival: req.body.arrival,
        frequency: req.body.frequency,
        busType: req.body.busType,
        numberOfSeat: req.body.numberOfSeat,
        plateNumber: req.body.plateNumber,
        drivers: req.body.driverIds,
    }}, {new: true}).then ( result => {
        return res.status(200).json({
            message: SUCCESS,
            line: result
        });
    }).catch( err => {
        return res.status(500).json({
            message: UNKNOWN_ERROR,
            error: err
        });
    });
};

export function deleteOneLine (req, res) {
    Line.findByIdAndDelete({_id: req.params.lineId})
    .then( result =>  {
        res.status(200).json({
            message: SUCCESS,
            data: result
        });
    });
};