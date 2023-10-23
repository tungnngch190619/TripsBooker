import express from "express";
import {getAllCustomers, getOneCustomer, deleteOneCustomer, updateOneCustomer, createNewCustomer} from "./controllers.js";
import verifyToken from"../../middleware/verifytoken.js";

const customerRouter = express.Router();

customerRouter.get("/", verifyToken, getAllCustomers);
customerRouter.post("/", verifyToken, createNewCustomer);

customerRouter.get("/:customerId", verifyToken, getOneCustomer);

// router.post("/", verifyToken, controller.createNewCustomer);

customerRouter.put("/:customerId", verifyToken, updateOneCustomer);

customerRouter.delete("/:customerId", verifyToken, deleteOneCustomer);

export default customerRouter;