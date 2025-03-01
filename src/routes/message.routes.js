import {Router} from 'express'
import {createFileMessage, createMessage,deleteMessage,fetchMessage} from '../controllers/message.controller.js'
import {upload} from "../middlewares/multer.middleware.js"

const router= Router()

router.route("/").post(createMessage)
router.route("/file").post(upload.single('file'),createFileMessage)
router.route("/:conversationId").get(fetchMessage)
router.route("/delete").post(deleteMessage)

export default router