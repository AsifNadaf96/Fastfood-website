import express from "express";
import { register, login ,getProfile } from "../controller/usercontroller.js";
import { authenticate } from "../middleware/usermiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticate, getProfile);


export default router;
