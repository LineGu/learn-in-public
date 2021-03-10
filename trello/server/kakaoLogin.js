import { loginPageController } from '../controllers/loginPageController.mjs';

const kakaoLoginButtonElem = document.querySelector('#kakao');

kakaoLoginButtonElem.addEventListener('click', (event) => {
  kakaoLoginController.init();

  event.stopPropagation();
  event.preventDefault();
});

const kakaoLoginController = {
  async init() {
    await Kakao.init('a5b8f489bc24703b5d6155700b42e559');
    Kakao.Auth.login({
      scope: 'profile',
      success: () => {
        this.getUserData();
      },
    });
  },

  async loginForUser(userData) {
    const resultOfGetUserLoginData = await kakaoLoginController.postUserData(userData);

    if (resultOfGetUserLoginData.msg === 'LOGIN SUCCESS') {
      window.location.href = 'index.html';
      return;
    }

    if (resultOfGetUserLoginData.msg === 'NOT USER') {
      const resultOfGetUserSignData = await kakaoLoginController.signInForKakao(userData);
      if (resultOfGetUserSignData.msg === 'SUCCESS') {
        alert('첫 방문을 환영합니다.');
        kakaoLoginController.loginForUser(userData);
      }
    }
  },

  async getUserData() {
    Kakao.API.request({
      url: '/v2/user/me',
      success: (res) => {
        const userData = {
          id: res.id,
          loginMethod: 'kakao',
          pw: '',
          phoneNumber: '',
          name: res.properties.nickname,
        };
        kakaoLoginController.loginForUser(userData);
      },
      fail: function (error) {
        console.log(error);
      },
    });
  },

  async postUserData(userData) {
    const result = await fetch('http://localhost:8080/auth/socialLogin', {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((res) => JSON.parse(res))
      .catch((err) => alert(err));

    return result;
  },

  async signInForKakao(userData) {
    const result = await fetch('http://localhost:8080/signUp', {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((res) => JSON.parse(res))
      .catch((err) => alert(err));

    const userIdOfDb = await loginPageController.getUserIdOfDataBaseTable(
      userData.name,
      userData.id,
    );

    if (userIdOfDb === 'FAIL') {
      console.log('fail to get userID');
      return;
    }

    const resultOfCreatContainer = await loginPageController.createDefaultContainer(userIdOfDb);

    if (resultOfCreatContainer === 'FAIL') {
      console.log('fail to create container');
      return;
    }

    const resultOfCreatCard = await loginPageController.createDefaultCard(userIdOfDb);

    if (resultOfCreatCard === 'FAIL') {
      console.log('fail to create card');
      return;
    }

    return result;
  },
};
