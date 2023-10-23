import getIncrementId from "../../config/AutoIncrement.js";
import { TICKET_COL } from "../../constants/collections.js";
import { DOC_NOT_FOUND, MISSING_REQUIRED_FIELD, OUT_OF_SEAT, SUCCESS, UNKNOWN_ERROR } from "../../constants/messages.js";
import Ticket from "./models.js";
import Trip from "../trips/models.js";
import { ticketLogger } from "../../config/logger.js";
import Customer from "../customers/models.js";

export async function createNewTicket ( req, res ) {
    const newId = await getIncrementId(TICKET_COL);
    const tripId = req.body.tripId;
    const custoemrId = req.body.customerId;
    const ticket = new Ticket({
        _id: newId,
        customer: custoemrId,
        trip: tripId,
        createdDate: new Date()
    });
    if(!ticket._id || !ticket.customer || !ticket.trip) {
        return res.status(400).json({
            message: MISSING_REQUIRED_FIELD
        });
    };
    const trip = await Trip.findById(tripId);
    const customer = await Customer.findById(custoemrId);
    //check if seat of trip is available
    if(trip.remainingSeats !== 0) {
        try{
            Trip.findByIdAndUpdate(tripId, {$inc: {remainingSeats: -1}});
            const result = await ticket.save();
            trip.tickets.push(result);
            await trip.save();
            customer.tickets.push(result);
            await customer.save();
            return res.status(200).json({
                meesage: SUCCESS,
                data: result
            });
        } catch (err) {
            ticketLogger.error(err);
            return res.status(500).json({
                meesage: UNKNOWN_ERROR
            });
        };
    };
    return res.status(401).json({
        message: OUT_OF_SEAT
    });
};

export function getOneTicket ( req, res ) {
    Ticket.findOne({ticket_id: req.params.ticketId})
    .then( result => {
        return res.status(200).send(result);
    }).catch(err => {
        return res.status(500).json({
            message: DOC_NOT_FOUND,
            error: err
        });
    });
};

export async function getAllTickets( req, res) {
    try {
        const tickets = await Ticket.find().populate("customer").populate("trip");
        return res.status(200).send(tickets);
    } catch (err) {
        ticketLogger.error(err);
        return res.status(400).json({
            message: UNKNOWN_ERROR
        });
    };
};