import express from "express";
import bodyParser from "body-parser";
import customerRouter from "./apps/customers/routes.js";
import userRouter from "./apps/users/routes.js";
import lineRouter from "./apps/lines/routes.js";
import driverRouter from "./apps/drivers/routes.js";
import ticketRouter from "./apps/tickets/routes.js";
import { serverLogger } from "./config/logger.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import tripRouter from "./apps/trips/routes.js";


const app = express();

//=======Config Body-parser
app.use(bodyParser.json());
app.use(cookieParser());
// app.use(cors());
// app.disable("x-powered-by");
// app.use(express.urlencoded({extended: true}));
// old: 
//app.use(express.static("public"));
app.use(express.static("client"));
app.set("view engine", "ejs");

app.use("/api/customers", customerRouter);
serverLogger.info("Customer service started");
app.use("/api/users", userRouter);
serverLogger.info("User service started");
app.use("/api/lines", lineRouter);
serverLogger.info("Line service started");
app.use("/api/drivers", driverRouter);
serverLogger.info("Driver service started");
app.use("/api/tickets", ticketRouter);
serverLogger.info("Ticket service started");
app.use("/api/trips", tripRouter)
serverLogger.info("Trip service started");

app.listen(4000, function() {
    serverLogger.info("Server started on port 4000");
});


export default app;