import express from "express";
import bodyParser from "body-parser";
import userRouter from "./apps/users/routes.js";
import lineRouter from "./apps/lines/routes.js";
import driverRouter from "./apps/drivers/routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";


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

app.use("/api/users", userRouter);
app.use("/api/lines", lineRouter);
app.use("/api/drivers", driverRouter);

app.listen(4000, function() {
    console.log("Server started on port 4000");
});


export default app;