import passport from 'passport';
import googleOAuth from 'passport-google-oauth20';

const GoogleStrategy = googleOAuth.Strategy;

import User from '../models/user.js';

export default () => {
    passport.use(
        new GoogleStrategy({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_PW,
            callbackURL: '/login/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const exUser = await User.findOne({
                    num:profile.id
                });

                console.log(profile);
                console.log(exUser);

                if (exUser) {
                    done(null, exUser);
                } else {
                    const newUser = new User({
                        num: profile.id,
                        id: profile._json.email.split('@')[0],
                        email: profile._json.email,
                        name: profile._json.name,
                    });
                    newUser.save();
                    done(null, newUser);
                }
            } catch (err) {
                console.error(err);
                done(err);
            }
        })
    );
};
