import express from 'express';

const router = express.Router();
import { deleteuser, forgotpassword, login, register } from '../controller/usercontroller.js';

router.post('/register', register);
router.post('/login', login);
router.patch('/forgotpassword/:id', forgotpassword);
router.delete('/deleteuser/:id', deleteuser);


export default router;