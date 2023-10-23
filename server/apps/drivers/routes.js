import express from "express";
import verifyToken from "../../middleware/verifytoken.js"
import { createNewDriver, deleteOneDriver, getAllDrivers, getOneDriver, updateOneDriver } from "./controllers.js";

const driverRouter = express.Router();

driverRouter.get("/", verifyToken, getAllDrivers);
driverRouter.put("/:driverId", verifyToken, updateOneDriver);
driverRouter.post("/", verifyToken, createNewDriver);
driverRouter.get("/:driverId", verifyToken, getOneDriver);
driverRouter.delete("/:driverId", verifyToken, deleteOneDriver);

export default driverRouter;