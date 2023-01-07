import User from '../models/user.js';

export default {
    getCoinSum: async (req, res) => {

        let coin = 0;
        const userList = await User.find();
        for (let user of userList) {
            console.log(`${user.name}: ${user.coin['bet']}`)
            coin += user.coin['bet'];
        }
        console.log(coin);
        res.end();

    }
}