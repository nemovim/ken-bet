import express from 'express';
import betController from '../controllers/bet.js';

const router = express.Router()

router.post('/', betController.doBetting);

export default router;