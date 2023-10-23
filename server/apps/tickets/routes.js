import express from "express";
import { getAllTickets, createNewTicket, getOneTicket } from "./controllers.js";
import verifyToken from "../../middleware/verifytoken.js";

const ticketRouter = express.Router();

ticketRouter.get("/", verifyToken, getAllTickets);
ticketRouter.post("/create", verifyToken, createNewTicket);
ticketRouter.get("/:ticketId",verifyToken, getOneTicket);

export default ticketRouter;