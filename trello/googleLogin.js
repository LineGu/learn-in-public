import { loginPageController } from './controllers/loginPageController.mjs';

const btn = document.querySelector('#google');
btn.addEventListener('click', (event) => {
  init();
  event.stopPropagation();
  event.preventDefault();
});

function init() {
  gapi.load('auth2', function () {
    const googleAuth = gapi.auth2.init({
      client_id: '754093745043-1h4l8j77bhelph1u0c2vlsd6tnk8vggk.apps.googleusercontent.com',
      fetch_basic_profile: true,
      scope: 'profile',
    });

    googleAuth.then(
      (googleAuth) => googleLoginControll.logInWithGoogle(googleAuth),
      () => console.log('err'),
    );
  });
}

const googleLoginControll = {
  async logInWithGoogle(googleAuth) {
    if (googleAuth.isSignedIn.get()) {
      googleAuth.signOut();
    }
    await googleAuth.signIn();
    const resultOfGetUserLoginData = await googleLoginControll.postUserData(googleAuth);
    if (resultOfGetUserLoginData.msg === 'LOGIN SUCCESS') {
      window.location.href = 'index.html';
      return;
    }

    if (resultOfGetUserLoginData.msg === 'NOT USER') {
      const resultOfGetUserSignData = await googleLoginControll.signInForGoogle(googleAuth);
      if (resultOfGetUserSignData.msg === 'SIGNUP SUCCESS') {
        alert('첫 방문을 환영합니다.');
        googleLoginControll.logInWithGoogle(googleAuth);
      }
    }
  },

  async postUserData(googleAuth) {
    const googleUser = googleAuth.currentUser.get();
    const userProfile = googleUser.getBasicProfile();
    const userName = userProfile.getName();
    const userId = userProfile.getEmail();

    const result = await fetch('http://localhost:8080/socialLogin', {
      method: 'POST',
      body: JSON.stringify({
        id: userId,
        name: userName,
      }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((res) => JSON.parse(res))
      .catch((err) => alert(err));

    return result;
  },

  async signInForGoogle(googleAuth) {
    const googleUser = googleAuth.currentUser.get();
    const userProfile = googleUser.getBasicProfile();
    const userName = userProfile.getName();
    const userId = userProfile.getEmail();

    const result = await fetch('http://localhost:8080/socialSignIn', {
      method: 'POST',
      body: JSON.stringify({
        id: userId,
        name: userName,
      }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((res) => JSON.parse(res))
      .catch((err) => alert(err));

    const userIdOfDb = await loginPageController.getUserIdOfDataBaseTable(userName, userId);

    if (userIdOfDb === 'FAIL') {
      console.log('fail to get userID');
      return;
    }

    const resultOfCreatContainer = await loginPageController.createDefaultContainer(userIdOfDb);

    if (resultOfCreatContainer === 'FAIL') {
      console.log('fail to create container');
      return;
    }

    const containerId = await loginPageController.findDefaultContainer(userIdOfDb);

    const resultOfCreatCard = await loginPageController.createDefaultCard(userIdOfDb, containerId);

    if (resultOfCreatCard === 'FAIL') {
      console.log('fail to create card');
      return;
    }
    return result;
  },
};
