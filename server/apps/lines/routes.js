import express from "express";
import { getAllLines, createNewLine, deleteOneLine, updateOneLine, getOneLine, getAllLinesWithoutRefs } from "./controllers.js";
import verifyToken from "../../middleware/verifytoken.js";

const lineRouter = express.Router();

lineRouter.get("/", verifyToken, getAllLines);
lineRouter.get("/getAllLinesWithoutRefs", verifyToken, getAllLinesWithoutRefs)
lineRouter.get("/:lineId", verifyToken, getOneLine);
lineRouter.post("/", verifyToken, createNewLine);
lineRouter.put("/:lineId",verifyToken, updateOneLine);
lineRouter.delete("/:lineId", verifyToken, deleteOneLine);

export default lineRouter;