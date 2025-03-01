import { Router } from "express";
import {generateCode} from "../controllers/email.controller.js"

const router=Router()

router.route("/").post(generateCode)

export default router