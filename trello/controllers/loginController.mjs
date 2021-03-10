import { cardContainersView } from '../views/view.mjs';
import { currentUser } from '../models/user_data.mjs';

export const loginController = {
  async getUserData() {
    const userData = await fetch('http://localhost:8080/user', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((res) => JSON.parse(res))
      .catch((err) => {
        alert('페이지를 받아오는 과정에서 오류가 생겨, 새로고침합니다.');
        window.location.href = 'index.html';
      });

    if (userData.msg === 'INVALID USER') {
      return false;
    }

    return userData;
  },

  async getContainerData(containerId) {
    try {
      const response = await fetch(`http://localhost:8080/user/container/${containerId}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.status === 200) {
        const containerJSON = await response.json();
        const container = await JSON.parse(containerJSON);

        return container;
      }

      throw new Error(response.status);
    } catch (err) {
      console.log(err);
    }
  },

  async getCardData(containerId, cardId) {
    try {
      const response = await fetch(`http://localhost:8080/user/card/${containerId}/${cardId}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.status === 200) {
        const cardJSON = await response.json();
        const card = await JSON.parse(cardJSON);

        return card;
      }

      throw new Error(response.status);
    } catch (err) {
      console.log(err);
    }
  },

  async logout() {
    const result = await fetch('http://localhost:8080/auth/logout', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((res) => JSON.parse(res))
      .catch((err) => {
        console.log(err);
      });

    if (result.msg === 'LOGOUT SUCCESS') {
      window.location.href = 'login.html';
    }
  },
};
