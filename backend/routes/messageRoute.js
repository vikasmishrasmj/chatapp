import express from "express";
import { sendMessage } from "../routeControllers/messagerouteController.js";
import { getMessages } from "../routeControllers/messagerouteController.js";
import isLogin from "../middleware/isLogin.js";

const router = express.Router();

router.post('/send/:id',isLogin,sendMessage);
router.get('/:id',isLogin,getMessages);


export default router