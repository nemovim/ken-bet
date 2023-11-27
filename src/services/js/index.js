import userScript from './user.js';
import gameScript from './game.js';
import betScript from './bet.js';

(async function () {
    const userData = await userScript.getUserInfo();


    await fetch('/coin/sum');

    if (userData !== null) {
        userScript.watchChange();
        gameScript.getGameList(userData.level);
        gameScript.watchChange(userData.level);
        if (userData.level === 9) {
            gameScript.createGiveCoinBtn();
            gameScript.createAddGameBtn();
        }
    } else {
        gameScript.getGameList(-1);
        gameScript.watchChange(-1);
    }
})();
