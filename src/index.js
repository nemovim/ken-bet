import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';
import helmet from 'helmet';


import loginRouter from './routes/login.js';
import userRouter from './routes/user.js';
import gameRouter from './routes/game.js';
import betRouter from './routes/bet.js';
import coinRouter from './routes/coin.js';

import passportIndex from './passport/index.js';
passportIndex();

const { PORT, MONGO_URI, SESSION_SECRET } = process.env;

console.log(PORT, MONGO_URI);

const app = express();

app.use(express.json());
// app.use(helmet());
app.use(
    session({
        secret: SESSION_SECRET,
        resave: true,
        saveUninitialized: false,
    })
);
app.use(express.static('src/services'));

mongoose.connect(MONGO_URI).then(() => {
    console.log('[MONGODB IS CONNECTED]');
});

app.use(passport.initialize());
app.use(passport.session());

app.use('/login', loginRouter);
app.use('/user', userRouter);
app.use('/game', gameRouter);
app.use('/bet', betRouter);
app.use('/coin', coinRouter);

app.listen(PORT, () => {
    console.log('[Start Server]');
});
