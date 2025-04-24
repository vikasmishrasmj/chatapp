import express from 'express'
import isLogin from '../middleware/isLogin.js';
import { getUserBySearch } from '../routeControllers/userhandlerController.js';
import { getCurrentChats } from '../routeControllers/userhandlerController.js';

const router = express.Router()


router.get('/search',isLogin,getUserBySearch);
router.get('/currentchats',isLogin,getCurrentChats)



export default router;