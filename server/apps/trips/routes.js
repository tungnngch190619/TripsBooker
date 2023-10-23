import { Router } from "express";
import verifyToken from "../../middleware/verifytoken.js"
import { createNewTrip, getAllTrips, getOneTrip } from "./controllers.js";

const tripRouter  = new Router();

tripRouter.post("/create", verifyToken, createNewTrip);
tripRouter.get("/", verifyToken, getAllTrips);
tripRouter.get("/:tripId", verifyToken, getOneTrip);

export default tripRouter;