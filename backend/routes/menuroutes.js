import express from "express";
import { getMenuItems } from "../controller/menucontroller.js";

const router = express.Router();

router.get("/", getMenuItems);

export default router
