import { loginController } from './loginController.mjs';
import { currentUser } from '../models/user_data.mjs';
import { cardContainersView } from '../views/view.mjs';

export const authController = {
  init() {
    this.loginButtonElem = document.querySelector('#login');
    this.formForLoginElem = document.querySelector('.login-button');

    this.attachLoginHandler();
    this.attachPreventFormActionHandler();
  },

  attachLoginHandler() {
    const { loginButtonElem } = this;

    loginButtonElem.addEventListener('click', async (event) => {
      event.stopPropagation();
      const inputId = document.querySelector('#id').value;
      const inputPassword = document.querySelector('#pw').value;

      if (inputId === '' || inputPassword === '') {
        return;
      }

      const { msg } = await this.postIdAndPassword(inputId, inputPassword);

      if (msg === 'ALEADY LOGIN') {
        const userWantToLogout = confirm('이미 로그인이 된 계정이 있습니다. 로그아웃하시겠습니까?');

        if (userWantToLogout) {
          loginController.logOut();
          return;
        }

        window.location.href = 'index.html';
        return;
      }

      if (msg === 'SUCCESS') {
        cardContainersView.loadIndexHTMLAfterLogin();
        return;
      }
      if (msg === 'NO ID') {
        alert('일치하는 아이디가 없습니다.');
        this.resetIdInputValue();
        this.resetPasswordInputValue();
        document.querySelector('#id').focus();
        return;
      }
      if (msg === 'NO PASSWORD') {
        alert('패스워드가 다릅니다.');
        this.resetPasswordInputValue();
        return;
      }
      alert('알 수 없는 형식의 입력입니다.');
      this.resetIdInputValue();
      this.resetPasswordInputValue();
    });
  },

  attachPreventFormActionHandler() {
    const { formForLoginElem } = this;

    formForLoginElem.addEventListener('submit', (event) => {
      event.stopPropagation();
      event.preventDefault();
    });
  },

  resetIdInputValue() {
    document.querySelector('#id').value = '';
  },

  resetPasswordInputValue() {
    document.querySelector('#pw').value = '';
  },

  async postIdAndPassword(inputId, inputPassword) {
    const result = await fetch('http://localhost:8080/login', {
      method: 'POST',
      body: JSON.stringify({
        id: inputId,
        password: inputPassword,
      }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((res) => JSON.parse(res))
      .catch((err) => alert(err));

    return result;
  },
};
