import express from "express"
import { userRegister } from "../routeControllers/userrouteController.js"
import { userLogin } from "../routeControllers/userrouteController.js";
import { userLogout } from "../routeControllers/userrouteController.js";

const router = express.Router()
// register page route
router.post('/register', userRegister);
//login page route
router.post('/login',userLogin)
// logout page route
router.post('/logout',userLogout)


export default router;