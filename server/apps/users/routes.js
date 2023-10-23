import express from "express";
import { login, createNewUser, getOneUser, getAllUsers, resetPassword, changePassword, logout, editUser, toggleActive} from "./controllers.js";
import verifyToken from "../../middleware/verifytoken.js"

const userRouter = express.Router();

userRouter.get("/", verifyToken, getAllUsers);
userRouter.post("/login", login);
userRouter.post("/register", verifyToken, createNewUser);
userRouter.get("/:userId", verifyToken, getOneUser);
userRouter.post("/reset-password/:userId", verifyToken, resetPassword);
userRouter.post("/change-password", verifyToken, changePassword);
userRouter.post("/logout", logout);
userRouter.post("/editUser", verifyToken, editUser)
userRouter.post("/toggleActive", verifyToken, toggleActive)

export default userRouter;