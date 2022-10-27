import passport from 'passport';
import googleStrategy from './googleStrategy.js';
import User from '../models/user.js';

export default () => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findOne({
            id: id,
        })
            .then((user) => done(null, user))
            .catch((err) => done(err));
    });

    googleStrategy();
};
