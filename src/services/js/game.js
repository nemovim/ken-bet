import betScript from './bet.js';

const gameFuncList = {
    watchChange: (userLevel) => {
        setInterval(async () => {
            try {
                const res = await fetch('http://kentech.tk/game/watch');
                const data = await res.json();

                data.forEach((gameData) => {
                    const gameArticle = document.querySelector(`#game-${gameData._id}`);
                    if (gameArticle !== null) {
                        gameArticle.remove();
                    }
                });
                gameFuncList.changeDOM(data, userLevel);
            } catch (err) {
                console.error(err);
            }
        }, 3000);
    },
    getGameList: async (userLevel) => {
        try {
            const res = await fetch('http://kentech.tk/game/list');
            const data = await res.json();
            document.getElementById('gameSection').innerHTML = '';
            gameFuncList.changeDOM(data, userLevel);
        } catch (err) {
            console.error(err);
            return null;
        }
    },
    changeDOM: (gameList, userLevel) => {
        for (let gameData of gameList) {
            gameFuncList.createGameArticle(gameData);
            gameFuncList.createGameState(gameData, userLevel);
        }

        if (userLevel !== -1) {
            betScript.changeDOM(gameList);
        }

    },
    createGameArticle: (gameData) => {
        // const {primary, sub} = gameFuncList.getColor(gameData.state);

        const gameArticle = document.createElement('article');
        gameArticle.setAttribute('id', `game-${gameData._id}`);
        gameArticle.classList.add('container-col');
        gameArticle.classList.add('card');
        gameArticle.classList.add(`state-${gameData.state}`);

        const gameHeader = document.createElement('div');
        gameHeader.classList.add('gameHeader');
        gameHeader.classList.add('container-col');

        const gameTitle = document.createElement('h1');
        gameTitle.innerText = gameData.title;

        const gameContent = document.createElement('p');
        gameContent.innerText = gameData.content;

        gameHeader.append(gameTitle);
        gameHeader.append(gameContent);

        gameArticle.append(gameHeader);

        for (let choice of gameData.choiceList) {
            const choiceDiv = document.createElement('div');
            choiceDiv.setAttribute(
                'id',
                `choice-${gameData._id}-${choice._id}`
            );
            choiceDiv.classList.add('container');

            if (gameData.choiceList[gameData.result] === choice) {
                choiceDiv.classList.add('resultChoice');
            }

            const choiceTitle = document.createElement('p');
            choiceTitle.innerText = choice.title;

            const potProgress = document.createElement('progress');
            potProgress.setAttribute('value', choice.pot);
            potProgress.setAttribute('max', gameData.pot);

            const choicePotPercent = document.createElement('p');
            let potPercent = ((choice.pot / gameData.pot) * 100).toFixed(0);
            if (isNaN(potPercent)) {
                potPercent = 0;
            }
            choicePotPercent.innerText = `${potPercent}%`;

            const choiceBettor = document.createElement('p');
            choiceBettor.innerText = `${choice.bettor}건`;

            const choiceDividend = document.createElement('p');
            let dividend = (gameData.pot / choice.pot).toFixed(2);
            if (isNaN(dividend) || !isFinite(dividend)) {
                dividend = '?';
            }

            choiceDividend.innerText = `${dividend}배`;

            choiceDiv.append(choiceTitle);
            choiceDiv.append(potProgress);
            choiceDiv.append(choicePotPercent);
            choiceDiv.append(choiceBettor);
            choiceDiv.append(choiceDividend);

            gameArticle.append(choiceDiv);
        }

        const gameResult = document.createElement('div');
        gameResult.setAttribute('id', `result-${gameData._id}`);
        gameResult.classList.add('container');

        const gamePot = document.createElement('p');
        gamePot.innerText = `총 ${gameData.pot}코인`;

        const gameBettor = document.createElement('p');
        gameBettor.innerText = `총 ${gameData.bettor}건`;

        gameResult.append(gamePot);
        gameResult.append(gameBettor);

        gameArticle.append(gameResult);

        document.getElementById('gameSection').prepend(gameArticle);
    },
    removeGameState: (gameData) => {
        document.querySelector(`#game-${gameData._id} .gameState`).remove();
    },
    createGameState: (gameData, userLevel) => {
        const stateText = {
            wait: '준비 중',
            open: '진행 중',
            close: '결과 대기 중',
            end: '종료',
        };

        const gameState = document.createElement('div');
        gameState.classList.add('container');
        gameState.classList.add('gameState');

        for (let state of ['wait', 'open', 'close', 'end']) {
            if (state === gameData.state) {
                const stateP = document.createElement('p');
                stateP.classList.add(`stateP-${state}`);
                stateP.classList.add('nowState');
                stateP.innerText = stateText[state];
                gameState.append(stateP);
            } else if (userLevel === 9 && gameData.state !== 'end') {
                const stateP = document.createElement('p');
                stateP.classList.add(`stateP-${state}`);
                stateP.innerText = stateText[state];

                const cbFunc = () => {
                    if (state === 'end') {
                        gameFuncList.endGame(gameData, userLevel);
                    } else {
                        gameFuncList.changeState(gameData, state, userLevel);
                        stateP.removeEventListener('click', cbFunc);
                    }
                };

                stateP.addEventListener('click', cbFunc);

                gameState.append(stateP);
            }
        }

        document.getElementById(`game-${gameData._id}`).prepend(gameState);
    },
    changeState: async (gameData, newState, userLevel) => {

        await fetch('http://kentech.tk/game/modify', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                target: 'state',
                gameId: gameData._id,
                value: newState,
            }),
        }).then(() => {
            gameData.state = newState;
            document.querySelector(`#game-${gameData._id}`).remove();
            gameFuncList.createGameArticle(gameData);
            gameFuncList.createGameState(gameData, userLevel);
        });
    },
    createAddGameBtn: () => {
        const addGameBtn = document.createElement('button');
        addGameBtn.innerText = '+게임 추가+';
        addGameBtn.setAttribute('id', 'addGameBtn');
        addGameBtn.classList.add('card');
        addGameBtn.classList.add('container');

        addGameBtn.addEventListener('click', () => {
            gameFuncList.createAddGameArticle();
            addGameBtn.classList.add('hidden');
        });
        document.getElementById('addSection').append(addGameBtn);
    },
    createAddGameArticle: () => {
        document.getElementById('addGameBtn').classList.add('hidden');

        const addGameArticle = document.createElement('article');
        addGameArticle.setAttribute('id', 'addGameArticle');
        addGameArticle.classList.add('container-col');
        addGameArticle.classList.add('card');

        const titleP = document.createElement('p');
        titleP.innerText = '제목';
        const titleInput = document.createElement('input');
        titleInput.setAttribute('type', 'text');

        const contentP = document.createElement('p');
        contentP.innerText = '설명';
        const contentInput = document.createElement('input');
        contentInput.setAttribute('type', 'text');

        const choiceP = document.createElement('p');
        choiceP.innerText = '선택지 (,로 구분해서 입력해 주세요.)';
        const choiceInput = document.createElement('input');
        choiceInput.setAttribute('type', 'text');

        const btnDiv = document.createElement('div');
        btnDiv.classList.add('container');

        const submitBtn = document.createElement('button');
        submitBtn.classList.add('primary-blue');
        submitBtn.innerText = '제출';
        submitBtn.addEventListener('click', () => {
            if (confirm('새 게임을 이렇게 추가하시겠습니까?')) {
                gameFuncList.addGame(
                    titleInput.value,
                    contentInput.value,
                    choiceInput.value
                );
            }
        });

        const cancelBtn = document.createElement('button');
        cancelBtn.classList.add('primary-red');
        cancelBtn.innerText = '취소';
        cancelBtn.addEventListener('click', () => {
            document.getElementById('addGameBtn').classList.remove('hidden');
            addGameArticle.remove();
        });

        btnDiv.append(cancelBtn);
        btnDiv.append(submitBtn);

        addGameArticle.append(titleP);
        addGameArticle.append(titleInput);
        addGameArticle.append(contentP);
        addGameArticle.append(contentInput);
        addGameArticle.append(choiceP);
        addGameArticle.append(choiceInput);
        addGameArticle.append(btnDiv);

        document.getElementById('addSection').append(addGameArticle);
    },
    addGame: (title, content, choice) => {
        fetch('http://kentech.tk/game/add', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                content: content,
                choice: choice,
            }),
        })
            .then(() => {
                alert('정상적으로 추가되었습니다.');
                document.getElementById('addGameArticle').remove();
                document.getElementById('addGameBtn').classList.remove('hidden');
            })
            .catch(() => {
                alert('추가 중에 오류가 발생했습니다.');
            });
    },
    endGame: (gameData) => {
        let choiceTitleList = [];
        let msg = '결과의 번호를 입력하세요\n';
        gameData.choiceList.forEach((choice, index) => {
            choiceTitleList.push(choice.title);
            msg += `${index}. ${choice.title}\n`;
        });

        const answer = parseInt(prompt(msg));

        if (!isNaN(answer) && choiceTitleList.length > answer) {
            fetch('http://kentech.tk/game/end', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    gameId: gameData._id,
                    result: answer,
                }),
            }).then(() => {
                alert('정상적으로 처리되었습니다.');
            });
        } else {
            alert('선택지의 번호를 정확히 입력하세요.');
        }
    },
};

export default gameFuncList;
