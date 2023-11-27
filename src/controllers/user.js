import User from '../models/user.js';

export default {
    getInfo: (req, res) => {
        res.send(req.user);
    },
    giveCoin: async (req, res) => {
        const data = req.body;
        await User.updateMany({}, { $inc: { coin: data.delta }});
        res.end();
    }
}