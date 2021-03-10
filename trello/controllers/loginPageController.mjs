import { DBcontroller } from './DBcontroller.mjs';

export const loginPageController = {
  init() {
    this.openSignUpModalButtonElem = document.querySelector('.sign-up-button');
    this.signUpModalElem = document.querySelector('.signup-modal');
    this.closeModalButtonElems = document.querySelectorAll('.cancelbtn');
    this.inputNameElem = document.querySelector('#name');
    this.inputIdElem = document.querySelector('#signup-id');
    this.inputPwElem = document.querySelector('#signup-pw');
    this.inputRepeatPwElem = document.querySelector('#repeat-pw');
    this.inputPhoneNumberElem = document.querySelector('#phone-number');
    this.formForSignUpElem = document.querySelector('.signup-form');
    this.submitForSignUpElem = document.querySelector('.signupbtn');
    this.findingIdModalElem = document.querySelector('.find-id-modal');
    this.openFindingIdModalButtonElem = document.querySelector('.find-id-button');
    this.findingPwModalElem = document.querySelector('.find-pw-modal');
    this.openFindingPwModalButtonElem = document.querySelector('.find-pw-button');
    this.findIdConfirmButtonElem = document.querySelector('.find-id-btn');
    this.inputNameToFindIdElem = document.querySelector('#find-id-name');
    this.inputPhoneToFindIdElem = document.querySelector('#find-id-phone-number');
    this.elemOfShowingIdFound = document.querySelector('.show-finding-id');
    this.inputNameToFindPwElem = document.querySelector('#find-pw-name');
    this.inputPhoneToFindPwElem = document.querySelector('#find-pw-phone-number');
    this.inputEmailToFindPwElem = document.querySelector('#find-pw-id');
    this.buttonToFindPw = document.querySelector('.find-pw-btn');
    this.newPwModalElem = document.querySelector('.new-pw-box');
    this.newPwInputElem = document.querySelector('#new-pw');
    this.newPwRepeatInputElem = document.querySelector('#new-pw-repeat');

    this.attachOpenSignUpModal();
    this.attachCloseModal();
    this.checkOverlappingId();
    this.attachPreventFormActionHandler();
    this.createNewAccount();
    this.checkValidFormOfPhone();
    this.attachOpenFindingIdModal();
    this.attachOpenFindingPwModal();
    this.attachFindIdHandler();
    this.attachFindPwHandler();
  },

  attachOpenSignUpModal() {
    const { openSignUpModalButtonElem, signUpModalElem } = this;

    openSignUpModalButtonElem.addEventListener('click', (event) => {
      event.stopPropagation();

      signUpModalElem.classList.remove('hidden');
    });
  },
  attachOpenFindingIdModal() {
    const {
      findingIdModalElem,
      openFindingIdModalButtonElem,
      inputPwElem,
      inputRepeatPwElem,
    } = this;

    loginPageController.checkRepeatPw(inputPwElem, inputRepeatPwElem);
    openFindingIdModalButtonElem.addEventListener('click', (event) => {
      event.stopPropagation();
      findingIdModalElem.classList.remove('hidden');
    });
  },
  attachOpenFindingPwModal() {
    const { findingPwModalElem, openFindingPwModalButtonElem } = this;

    openFindingPwModalButtonElem.addEventListener('click', (event) => {
      event.stopPropagation();

      findingPwModalElem.classList.remove('hidden');
    });
  },

  attachCloseModal() {
    const { closeModalButtonElems, signUpModalElem } = this;

    closeModalButtonElems.forEach((closeModalButtonElem) => {
      closeModalButtonElem.addEventListener('click', (event) => {
        event.stopPropagation();
        window.location.href = 'login.html';
      });
    });
  },
  checkRepeatPw(inputPwElem, inputRepeatPwElem) {
    const showingValidPwElem = inputRepeatPwElem.parentNode.querySelector('.repeat-pw');
    const showingInvalidPwElem = inputRepeatPwElem.parentNode.querySelector('.invalid-repeat-pw');

    inputRepeatPwElem.addEventListener('input', (event) => {
      const checkPwTimer = setTimeout(() => {
        const isValidRepeat = inputPwElem.value === inputRepeatPwElem.value;
        if (!inputRepeatPwElem.value) {
          showingValidPwElem.classList.add('hidden');
          showingInvalidPwElem.classList.add('hidden');
          return;
        }

        if (!isValidRepeat) {
          showingValidPwElem.classList.add('hidden');
          showingInvalidPwElem.classList.remove('hidden');
          return;
        }
        showingInvalidPwElem.classList.add('hidden');
        showingValidPwElem.classList.remove('hidden');
      }, 500);

      inputRepeatPwElem.addEventListener('input', () => {
        clearTimeout(checkPwTimer);
      });
    });
  },

  checkValidFormOfPhone() {
    const { inputPhoneNumberElem } = this;

    inputPhoneNumberElem.addEventListener('input', (event) => {
      const checkPhoneTimer = setTimeout(() => {
        const inputPhoneNumber = inputPhoneNumberElem.value;
        if (!inputPhoneNumber) {
          document.querySelector('.invalid-phone').classList.add('hidden');
          document.querySelector('.phone-explan').classList.add('hidden');
          document.querySelector('.valid-phone').classList.add('hidden');
          return;
        }

        if (inputPhoneNumber.includes('-')) {
          document.querySelector('.invalid-phone').classList.add('hidden');
          document.querySelector('.phone-explan').classList.remove('hidden');
          document.querySelector('.valid-phone').classList.add('hidden');
          return;
        }

        if (inputPhoneNumber.length === 11 && Number(inputPhoneNumber) !== NaN) {
          document.querySelector('.invalid-phone').classList.add('hidden');
          document.querySelector('.phone-explan').classList.add('hidden');
          document.querySelector('.valid-phone').classList.remove('hidden');
          return;
        }
        document.querySelector('.invalid-phone').classList.remove('hidden');
        document.querySelector('.phone-explan').classList.add('hidden');
        document.querySelector('.valid-phone').classList.add('hidden');
      }, 500);

      inputPhoneNumberElem.addEventListener('input', () => {
        clearTimeout(checkPhoneTimer);
      });
    });
  },

  checkValidForm() {
    const isValidRepeat = !document.querySelector('.repeat-signup-pw').classList.contains('hidden');
    const isValidId = !document.querySelector('.available-id').classList.contains('hidden');
    const isValidPhone = !document
      .querySelector('.valid-signup-phone')
      .classList.contains('hidden');

    if (isValidRepeat && isValidId && isValidPhone) {
      return true;
    }
  },

  attachPreventFormActionHandler() {
    const { formForSignUpElem } = this;

    formForSignUpElem.addEventListener('submit', (event) => {
      event.stopPropagation();
      event.preventDefault();
    });
  },

  createNewAccount() {
    const {
      inputNameElem,
      inputIdElem,
      inputPwElem,
      inputPhoneNumberElem,
      submitForSignUpElem,
    } = this;

    submitForSignUpElem.addEventListener('click', async (event) => {
      if (!this.checkValidForm()) {
        alert('양식을 올바르게 입력하세요.');
        return;
      }

      await fetch('http://localhost:8080/signUp', {
        method: 'POST',
        body: JSON.stringify({
          name: inputNameElem.value,
          id: inputIdElem.value,
          pw: inputPwElem.value,
          phoneNumber: inputPhoneNumberElem.value,
          loginMethod: 'local',
        }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((res) => JSON.parse(res).msg)
        .then((res) => {
          if (res !== 'SUCCESS') {
            alert('회원가입에 실패했습니다.');
            return;
          }
        })
        .catch((err) => {
          alert('회원가입에 실패했습니다.');
          return;
        });

      const userId = await loginPageController.getUserIdOfDataBaseTable(
        inputNameElem.value,
        inputIdElem.value,
      );

      if (userId === 'FAIL') {
        console.log('fail to get userID');
        return;
      }

      const resultOfCreatContainer = await loginPageController.createDefaultContainer(userId);

      if (resultOfCreatContainer === 'FAIL') {
        console.log('fail to create container');
        return;
      }

      const resultOfCreatCard = await loginPageController.createDefaultCard(userId);

      if (resultOfCreatCard === 'FAIL') {
        console.log('fail to create card');
        return;
      }

      alert('회원가입에 성공했습니다.');
      window.location.href = 'login.html';
      return;
    });
  },

  async createDefaultCard(userId) {
    try {
      await DBcontroller.addCard(
        0,
        0,
        '해야할 일을 입력해보세요!',
        '구체적인 내용을 입력하세요! 그 후에 이 카드를 드래그해서 진행 중으로 옮겨보세요~',
        '사용자님의 닉네임이 들어갑니다!',
        0,
        userId,
      );
      return 'SUCCESS';
    } catch (err) {
      alert('회원가입에 실패했습니다.');
      return 'FAIL';
      //회원 아이디 지우기
    }
  },

  async createDefaultContainer(userId) {
    try {
      await DBcontroller.addContainer(0, '할 일', 0, userId);
      await DBcontroller.addContainer(1, '진행 중', 1, userId);
      await DBcontroller.addContainer(2, '완료', 2, userId);
      return 'SUCCESS';
    } catch (err) {
      alert('회원가입에 실패했습니다.');
      return 'FAIL';
      //회원 아이디 지우기
    }
  },

  async getUserIdOfDataBaseTable(name, id) {
    const userId = await fetch('http://localhost:8080/user/id', {
      method: 'POST',
      body: JSON.stringify({
        name,
        id,
      }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((res) => JSON.parse(res).msg)
      .catch((err) => {
        alert(err);
        return;
      });

    if (userId === 'INVAILD' || userId === 'ERROR') {
      alert('가입 후 정보를 가져오는 과정이 실패했습니다.');
      //이후에 계정 삭제 필요
      return 'FAIL';
    }

    return userId;
  },

  async checkOverlappingId() {
    const { inputIdElem } = this;

    inputIdElem.addEventListener('input', (event) => {
      const checkIdTimer = setTimeout(async () => {
        const inputId = inputIdElem.value;
        if (!inputId) {
          document.querySelector('.unavailable-id').classList.add('hidden');
          document.querySelector('.available-id').classList.add('hidden');
          document.querySelector('.invalid-id').classList.add('hidden');
          return;
        }

        if (inputId.length < 8) {
          document.querySelector('.invalid-id').classList.remove('hidden');
          document.querySelector('.unavailable-id').classList.add('hidden');
          document.querySelector('.available-id').classList.add('hidden');
          return;
        }

        if (!inputId.includes('@')) {
          document.querySelector('.invalid-id').classList.remove('hidden');
          document.querySelector('.unavailable-id').classList.add('hidden');
          document.querySelector('.available-id').classList.add('hidden');
          return;
        }

        const resultOfOverlapping = await fetch('http://localhost:8080/signUp/OverlappingId', {
          method: 'POST',
          body: JSON.stringify({
            id: inputId,
          }),
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        })
          .then((res) => res.json())
          .then((res) => JSON.parse(res).msg)
          .catch((err) => {
            document.querySelector('#signup-id').value = '다시 입력해주세요.';
          });

        switch (resultOfOverlapping) {
          case 'ERROR':
            document.querySelector('#signup-id').value = '다시 입력해주세요.';
            break;

          case 'AVAILABLE':
            document.querySelector('.invalid-id').classList.add('hidden');
            document.querySelector('.unavailable-id').classList.add('hidden');
            document.querySelector('.available-id').classList.remove('hidden');
            break;

          case 'UNAVAILABLE':
            document.querySelector('.invalid-id').classList.add('hidden');
            document.querySelector('.available-id').classList.add('hidden');
            document.querySelector('.unavailable-id').classList.remove('hidden');
            break;
        }
      }, 500);

      inputIdElem.addEventListener('input', () => {
        clearTimeout(checkIdTimer);
      });
    });
  },

  attachFindIdHandler() {
    const { findIdConfirmButtonElem } = this;

    findIdConfirmButtonElem.addEventListener('click', (event) => {
      this.findUserId();
      event.stopPropagation();
      event.preventDefault();
    });
  },

  async findUserId() {
    const { inputNameToFindIdElem, inputPhoneToFindIdElem, elemOfShowingIdFound } = this;

    const inputName = inputNameToFindIdElem.value;
    const inputPhone = inputPhoneToFindIdElem.value;

    const resultOfFindingId = await fetch('http://localhost:8080/user/email', {
      method: 'POST',
      body: JSON.stringify({
        name: inputName,
        phoneNumber: inputPhone,
      }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((res) => JSON.parse(res).msg)
      .catch((err) => {
        console.log(err);
      });
    if (resultOfFindingId === 'NO ID') {
      elemOfShowingIdFound.innerText = '일치하는 값이 없습니다.';
      elemOfShowingIdFound.classList.remove('hidden');
      elemOfShowingIdFound.classList.add('alert');
      inputNameToFindIdElem.value = '';
      inputPhoneToFindIdElem.value = '';
      return;
    }

    elemOfShowingIdFound.querySelector('.findind-id').innerText = `${resultOfFindingId}`;
    elemOfShowingIdFound.classList.remove('hidden');
    inputNameToFindIdElem.value = '';
    inputPhoneToFindIdElem.value = '';
  },

  attachFindPwHandler() {
    const { buttonToFindPw } = this;

    buttonToFindPw.addEventListener('click', async (event) => {
      event.preventDefault();

      window.userId = await loginPageController.findUserForChangindPw();
      if (!userId) return;

      loginPageController.openChangeUserPwModal();
    });

    buttonToFindPw.addEventListener('click', async (event) => {
      if (buttonToFindPw.classList.contains('change-btn')) {
        event.preventDefault();

        const resultOfChanging = await loginPageController.changeUserPw(window.userId);
        if (!resultOfChanging) {
          alert('변경 실패!');
          return;
        }
        alert('성공적으로 변경했습니다.');
        window.location.href = 'login.html';
      }
    });
  },

  async findUserForChangindPw() {
    const { inputNameToFindPwElem, inputEmailToFindPwElem } = this;

    const inputName = inputNameToFindPwElem.value;
    const inputEmail = inputEmailToFindPwElem.value;

    const resultOfFindUser = await fetch('http://localhost:8080/user/id', {
      method: 'POST',
      body: JSON.stringify({
        name: inputName,
        id: inputEmail,
      }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    const userIdJSON = await resultOfFindUser.json();
    const userId = JSON.parse(userIdJSON).msg;

    if (userId === 'INVALID') {
      alert('일치하는 정보가 없습니다.');
      return false;
    }

    return userId;
  },

  openChangeUserPwModal() {
    const {
      findingPwModalElem,
      newPwModalElem,
      newPwRepeatInputElem,
      newPwInputElem,
      buttonToFindPw,
    } = this;
    console.log(1);
    findingPwModalElem.classList.add('bigger');
    newPwModalElem.classList.remove('hidden');
    buttonToFindPw.innerText = '바꾸기';
    buttonToFindPw.classList.add('change-btn');
    loginPageController.checkRepeatPw(newPwInputElem, newPwRepeatInputElem);
  },

  async changeUserPw(userId) {
    const { newPwInputElem } = this;

    const newPw = newPwInputElem.value;

    const resultOfChangingPw = await fetch('http://localhost:8080/user/password', {
      method: 'PATCH',
      body: JSON.stringify({
        newPw,
        userId,
      }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    const resultOfChangingPwJSON = await resultOfChangingPw.json();
    const resultOfChagingPw = JSON.parse(resultOfChangingPwJSON).msg;

    if (resultOfChagingPw === 'SUCCESS') return true;

    return false;
  },
};
