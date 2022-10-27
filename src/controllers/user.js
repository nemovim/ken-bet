import User from '../models/user.js';

export default {
    getInfo: (req, res) => {
        res.send(req.user);
    },
}