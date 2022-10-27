const betFuncList = {
    changeDOM: (gameList) => {
        if (document.getElementById('betSection').innerHTML === '') {
            betFuncList.createBetBtn(gameList);
        }
    },
    // modifyDOM: (gameData) => {
    //     if (gameData.state === 'open') {
    //         betFuncList.createBetBtn(gameData);
    //     } else {
    //         betFuncList.removeBetBtn(gameData);
    //     }
    // },
    removeBetBtn: () => {
        document.querySelectorAll('button[id^=betBtn-]').forEach(betBtn => {
            betBtn.remove();
        });
    },
    createBetBtn: (gameList) => {
        for (let gameData of gameList) {
            if (gameData.state === 'open') {
                let betBtn = document.getElementById(`betBtn-${gameData._id}`);

                if (betBtn === null) {
                    betBtn = document.createElement('button');
                    betBtn.setAttribute('id', `betBtn-${gameData._id}`);
                    betBtn.innerText = '베팅하기';
                    betBtn.addEventListener('click', () => {
                        betFuncList.createBetDiv(gameList, gameData);
                        betFuncList.removeBetBtn();
                    });

                    document
                        .getElementById(`result-${gameData._id}`)
                        .append(betBtn);
                }
            }
        }
    },
    createBetDiv: (gameList, gameData) => {
        const betDiv = document.createElement('div');
        betDiv.setAttribute('id', `bet-${gameData._id}`);
        betDiv.classList.add('container');
        betDiv.classList.add('card');

        const choiceSelect = document.createElement('select');
        choiceSelect.setAttribute('name', 'choice');

        let choiceList = [];
        gameData.choiceList.forEach((choice, index) => {
            const choiceOption = document.createElement('option');
            choiceOption.setAttribute('value', index);
            choiceOption.innerText = choice.title;
            choiceSelect.append(choiceOption);

            choiceList.push(choice.title);
        });

        betDiv.append(choiceSelect);

        const betInput = document.createElement('input');
        betInput.setAttribute('type', 'number');
        betInput.setAttribute('value', 0);

        betDiv.append(betInput);

        const cancelBtn = document.createElement('button');
        cancelBtn.classList.add('primary-red');
        cancelBtn.innerText = '취소';
        cancelBtn.addEventListener('click', () => {
            betFuncList.createBetBtn(gameList);
            betDiv.remove();
        });

        betDiv.append(cancelBtn);

        const submitBtn = document.createElement('button');
        submitBtn.classList.add('primary-green');
        submitBtn.innerText = '베팅';

        submitBtn.addEventListener('click', () => {
            if (Number(betInput.value) <= 0) {
                alert('1개 이상의 코인을 베팅해 주세요.');
            } else if (
                confirm(
                    `${choiceList[Number(choiceSelect.value)]}에게 ${
                        betInput.value
                    }코인을 베팅하시겠습니까?`
                )
            ) {
                betFuncList.doBetting({
                    gameId: gameData._id,
                    choice: Number(choiceSelect.value),
                    bet: Number(betInput.value),
                });
                betFuncList.createBetBtn(gameList);
                betDiv.remove();
            }
        });

        betDiv.append(submitBtn);

        document.getElementById('betSection').append(betDiv);
        // document.getElementById(`game-${gameData._id}`).after(betDiv);
    },
    doBetting: async (betData) => {
        const data = await fetch('http://kentech.tk/user');
        const userData = await data.json();

        betData.userId = userData._id;

        if (userData.coin['bet'] >= betData.bet) {
            try {
                await fetch('http://kentech.tk/bet', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify(betData),
                });

                alert('베팅이 정상적으로 처리되었습니다.');
            } catch {
                alert('베팅 처리에 실패했습니다! 다시 시도해 주세요.');
            }
        } else {
            alert('코인이 부족합니다!');
        }
    },
};

export default betFuncList;
