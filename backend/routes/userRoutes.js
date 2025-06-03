import express from 'express'
import { getUserDetails, googleLogin, login, logoutUser,  registerUser} from '../controllers/userController.js';
import { verifyJwt } from '../middleware/authMiddleware.js';

const router=express.Router();

router.route('/signup').post(registerUser)
router.route('/login').post(login)
router.route('/google').get(googleLogin)

router.use(verifyJwt)
router.route('/getUser').get(getUserDetails)
router.route('/logout').post(logoutUser)

export default router