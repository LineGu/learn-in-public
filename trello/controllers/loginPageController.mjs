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

    this.attachOpenSignUpModal();
    this.attachCloseModal();
    this.checkOverlappingId();
    this.checkRepeatPw();
    this.attachPreventFormActionHandler();
    this.createNewAccount();
    this.checkValidFormOfPhone();
    this.attachOpenFindingIdModal();
    this.attachOpenFindingPwModal();
    this.attachFindIdHandler();
  },

  attachOpenSignUpModal() {
    const { openSignUpModalButtonElem, signUpModalElem } = this;

    openSignUpModalButtonElem.addEventListener('click', (event) => {
      event.stopPropagation();

      signUpModalElem.classList.remove('hidden');
    });
  },
  attachOpenFindingIdModal() {
    const { findingIdModalElem, openFindingIdModalButtonElem } = this;

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
  checkRepeatPw() {
    const { inputPwElem, inputRepeatPwElem } = this;

    inputRepeatPwElem.addEventListener('input', (event) => {
      const checkPwTimer = setTimeout(() => {
        const isValidRepeat = inputPwElem.value === inputRepeatPwElem.value;
        if (!inputRepeatPwElem.value) {
          document.querySelector('.repeat-pw').classList.add('hidden');
          document.querySelector('.invalid-repeat-pw').classList.add('hidden');
          return;
        }

        if (!isValidRepeat) {
          document.querySelector('.repeat-pw').classList.add('hidden');
          document.querySelector('.invalid-repeat-pw').classList.remove('hidden');
          return;
        }
        document.querySelector('.invalid-repeat-pw').classList.add('hidden');
        document.querySelector('.repeat-pw').classList.remove('hidden');
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
    const isValidRepeat = !document.querySelector('.repeat-pw').classList.contains('hidden');
    const isValidId = !document.querySelector('.available-id').classList.contains('hidden');
    const isValidPhone = !document.querySelector('.valid-phone').classList.contains('hidden');

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

      const containerId = await loginPageController.findDefaultContainer(userId);
      console.log(containerId);

      const resultOfCreatCard = await loginPageController.createDefaultCard(userId, containerId);

      if (resultOfCreatCard === 'FAIL') {
        console.log('fail to create card');
        return;
      }

      alert('회원가입에 성공했습니다.');
      window.location.href = 'login.html';
      return;
    });
  },

  async findDefaultContainer(userId) {
    const result = await fetch('http://localhost:8080/defaultContainerId', {
      method: 'POST',
      body: JSON.stringify({
        userId,
      }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((res) => JSON.parse(res).msg)
      .catch((err) => {
        alert('회원가입에 실패했습니다.');
        return;
      });

    return result;
  },

  async createDefaultCard(userId, containerId) {
    const result = await fetch('http://localhost:8080/defaultCard', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        containerId,
      }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((res) => JSON.parse(res).msg)
      .catch((err) => {
        alert('회원가입에 실패했습니다.');
        return;
      });

    if (result === 'SUCCESS') {
      return result;
    }
    return 'FAIL';
  },

  async createDefaultContainer(userId) {
    const result = await fetch('http://localhost:8080/defaultContianer', {
      method: 'POST',
      body: JSON.stringify({
        userId,
      }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((res) => JSON.parse(res).msg)
      .catch((err) => {
        alert('회원가입에 실패했습니다.');
        return;
      });

    if (result === 'SUCCESS') {
      return result;
    }

    return 'FAIL';
  },

  async getUserIdOfDataBaseTable(name, id) {
    const userId = await fetch('http://localhost:8080/userId', {
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

        const resultOfOverlapping = await fetch('http://localhost:8080/OverlappingId', {
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
    const { inputNameToFindIdElem, inputPhoneToFindIdElem } = this;

    const inputName = inputNameToFindIdElem.value;
    const inputPhone = inputPhoneToFindIdElem.value;

    const resultOfFindingId = await fetch('http://localhost:8080/findingId', {
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
      alert('입력하신 정보와 일치하는 아이디가 없습니다.');
      window.location.href = 'login.html';
      return;
    }
    alert(`회원님의 아이디는 ${resultOfFindingId} 입니다.`);
    window.location.href = 'login.html';
  },
};
