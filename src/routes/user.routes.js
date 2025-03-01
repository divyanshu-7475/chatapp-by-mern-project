import { Router } from "express";
import { allUsers, changeCurrentPassword, dpUpdate, getCurrentUser, loginUser, refreshAccessToken, registerUser, resetPassword, updatedEmail, updatedFullname } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router= Router()

router.route("/register").post(upload.fields([
    {
        name: "dp",
        maxCount:1
    }
]),registerUser)
router.route("/login").post(loginUser)

router.route("/refresh-token").post(refreshAccessToken)
router.route("/email").post(updatedEmail)
router.route('/fullname').post(updatedFullname)
router.route('/password').post(changeCurrentPassword)
router.route("/password/reset").post(resetPassword)
router.route('/update/dp').post(upload.single('dp'),dpUpdate)
router.route('/current/:incomingRefreshToken').get(getCurrentUser)
router.route('/search').get(allUsers)


export default router