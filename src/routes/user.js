import express from 'express';
import userController from '../controllers/user.js';

const router = express.Router()

router.get('/', userController.getInfo);

router.post('/give', userController.giveCoin)

export default router;