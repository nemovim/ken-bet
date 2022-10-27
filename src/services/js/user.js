const userFuncList = {
    watchChange: () => {
        setInterval(() => {
            userFuncList.getUserInfo();
        }, 3000);
    },
    getUserInfo: async () => {
        try {
            const res = await fetch('http://kentech.tk/user');
            const data = await res.json();
            userFuncList.changeDOM(data);
            return data;
        } catch (err) {
            console.error(err);
            userFuncList.changeDOM(null);
            return null;
        }
    },
    changeDOM: (userData) => {
        if (userData === null) {
            if (
                document.getElementById('loginNav').classList.contains('hidden')
            ) {
                document
                    .getElementById('loginBtn')
                    .addEventListener('click', () => {
                        document.location.href = '/login';
                    });
            } else {
                alert('로그아웃 되었습니다.');
                document.location.href = '/';
            }
        } else {
            document.getElementById('logoutNav').classList.add('hidden');
            document.getElementById('loginNav').classList.remove('hidden');
            document.getElementById(
                'betP'
            ).innerText = `Coin: ${userData.coin.bet}`;
            document.getElementById('idP').innerText = `ID: ${userData.id}`;
        }
    },
};

export default userFuncList;
