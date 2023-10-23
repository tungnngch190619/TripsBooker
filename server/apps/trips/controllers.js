import { TRIP_COL } from "../../constants/collections.js";
import Trip from "./models.js";
import AutoIncrement from "../../config/AutoIncrement.js"
import { SUCCESS, UNKNOWN_ERROR } from "../../constants/messages.js";
import { tripLogger } from "../../config/logger.js";
import Line from "../lines/models.js";

export async function createNewTrip(req, res) {
    const newId = await AutoIncrement(TRIP_COL);
    const line = await Line.findById(req.body.lineId);
    const availableSeat = line.numberOfSeat;
    const newTrip = new Trip ({
        _id: newId,
        startTime: req.body.startTime,
        line: req.body.lineId,
        remainingSeats: availableSeat,
        status: req.body.status
    });
    try {
        const trip = await newTrip.save();
        tripLogger.info("Successfully create new trip");
        return res.status(200).json({
            message: SUCCESS,
            data: trip
        });
    } catch (err) {
        tripLogger.error(err);
        return res.status(200).json({
            message: UNKNOWN_ERROR
        });
    };
};

export async function getOneTrip( req, res ) {
    try {
        const trip = await Trip.findById(req.params.tripId).populate("line").populate("tickets");
        return res.status(200).send(trip);
    } catch (err) {
        tripLogger.error(err);
        return res.status(500).json({
            message: UNKNOWN_ERROR
        });
    };
};

export async function getAllTrips( req, res ) {
    try {
        const trips = await Trip.find().populate('line').populate("tickets");
        return res.status(200).send(trips);
    } catch (err) {
        tripLogger.error(err);
        return res.status(500).json({
            message: UNKNOWN_ERROR
        });
    };
};