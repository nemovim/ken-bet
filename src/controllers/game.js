import Game from '../models/game.js';
import Bet from '../models/bet.js';
import User from '../models/user.js';

const gameFuncList = {
    watchGame: (req, res) => {
        Game.find({
            where: {
                state: {
                    $not: 'end',
                },
            },
        }).then((data) => {
            res.send(data);
        });
    },
    getGameList: (req, res) => {
        Game.find().then((data) => {
            res.send(data);
        });
    },
    addGame: (req, res) => {
        const data = req.body;
        console.log(data);

        let gameData = {
            title: data.title,
            content: data.content,
            choiceList: [],
            state: 'wait',
        };

        for (let choice of data.choice.split(/ *, */)) {
            gameData.choiceList.push({
                title: choice,
            });
        }

        const newGame = new Game(gameData);
        newGame.save();
        res.end();
    },
    modifyGame: (req, res) => {
        const data = req.body;
        console.log(data);

        Game.findById(data.gameId).then((gameData) => {
            gameData.state = data.value;
            gameData.save();
        });

        res.end();
    },
    endGame: async (req, res) => {
        const data = req.body;
        console.log(data);

        const gameData = await Game.findById(data.gameId);
        gameData.state = 'end';
        gameData.result = data.result;
        await gameData.save();

        const dividend = gameData.pot / gameData.choiceList[data.result].pot;

        const betDataList = await Bet.find({
            $and: [{ gameId: data.gameId }, { choice: data.result }],
        });

        for(let betData of betDataList) {
            await gameFuncList.changeUser(betData, dividend);
        }

        res.end();
    },
    changeUser: (betData, dividend) => {
        return new Promise(async (resolve) => {
            console.log(betData);
            const userData = await User.findById(betData.userId);
            console.log(userData.coin);
            userData.coin['bet'] += Math.floor(dividend * betData.bet);
            console.log(userData.coin);
            await userData.save();
            resolve();
        });
    }
};

export default gameFuncList;