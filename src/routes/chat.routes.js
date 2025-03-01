import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {createChat, deleteChat, fetchChats, getCoversationId} from "../controllers/chat.controller.js" 
import { clearChat } from "../controllers/message.controller.js";

const router= Router()
 
 router.route("/").post(createChat)
 router.route("/fetchconversation/:userId").get(fetchChats)
 router.route("/conversationid/").get(getCoversationId)
 router.route('/clear').post(clearChat)
 router.route('/delete').post(deleteChat)
// router.route("/renameGroup").put(verifyJWT,renameGroup)
// router.route("removefromgroup").put(verifyJWT,removeFromGroup)
// router.route("addtogroup").put(verifyJWT,addToGroup)
// router.route("leavegroup").put(verifyJWT,leaveGroup)

export default router