import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/', passport.authenticate('google',  {scope: ['profile', 'email']}));

router.get('/callback', passport.authenticate('google', {failureRedirect: '/'}), (req, res) => {
    res.redirect('/');
});

export default router;