import express from 'express';
import gameController from '../controllers/game.js';

const router = express.Router()

router.get('/list', gameController.getGameList);

router.post('/add', gameController.addGame);

router.get('/watch', gameController.watchGame);

router.post('/modify', gameController.modifyGame);

router.post('/end', gameController.endGame);

export default router;