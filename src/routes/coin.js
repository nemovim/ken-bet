import express from 'express';
import coinController from '../controllers/coin.js';

const router = express.Router()

router.get('/sum', coinController.getCoinSum);

export default router;