import User from '../models/user.js';
import Game from '../models/game.js';
import Bet from '../models/bet.js';

export default {
    doBetting: async (req, res) => {
        const betData = req.body;

        const userData = await User.findById(betData.userId);

        userData.coin['bet'] -= betData.bet;

        await userData.save();

        const gameData = await Game.findById(betData.gameId);

        if (gameData.state !== 'open') {
            res.error();
        } else {
            gameData.pot += betData.bet;
            gameData.bettor += 1;
            gameData.choiceList[betData.choice].pot += betData.bet;
            gameData.choiceList[betData.choice].bettor += 1;

            await gameData.save();

            const newBet = new Bet(betData);
            await newBet.save();

            res.end();
        }

    },
};
