export const DBcontroller = {
  async deleteContainer(idOfDeleteContainer) {
    try {
      const result = await fetch(`http://localhost:8080/user/container/${idOfDeleteContainer}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (result.status !== 200) {
        throw new Error(response.status);
      }
    } catch (err) {
      if (err === 400) {
        console.log('클라이언트 에러');
        return;
      }
      console.log('서버에러');
    }
  },
  async addContainer(idOfAddContainer, name, containerIndex, userId = 0) {
    try {
      const result = await fetch(`http://localhost:8080/user/container/${idOfAddContainer}`, {
        method: 'POST',
        body: JSON.stringify({
          name,
          containerIndex,
          userId,
        }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (result.status !== 200) {
        throw new Error(response.status);
      }
    } catch (err) {
      if (err === 400) {
        console.log('클라이언트 에러');
        return;
      }
      console.log('서버에러');
    }
  },
  async updateContainer(idOfContainerUpdated, name) {
    try {
      const result = await fetch(`http://localhost:8080/user/container/${idOfContainerUpdated}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name,
        }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (result.status !== 200) {
        throw new Error(response.status);
      }
    } catch (err) {
      if (err === 400) {
        console.log('클라이언트 에러');
        return;
      }
      console.log('서버에러');
    }
  },

  async moveContainer(idOfContainerMoved, indexOfStart, indexToGo) {
    try {
      const result = await fetch(
        `http://localhost:8080/user/container/index/${idOfContainerMoved}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            indexOfStart,
            indexToGo,
          }),
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        },
      );

      if (result.status !== 200) {
        throw new Error(response.status);
      }
    } catch (err) {
      if (err === 400) {
        console.log('클라이언트 에러');
        return;
      }
      console.log('서버에러');
    }
  },

  async deleteCard(idOfContainer, idOfCardToDelete) {
    try {
      const result = await fetch(
        `http://localhost:8080/user/card/${idOfContainer}/${idOfCardToDelete}`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
      );

      if (result.status !== 200) {
        throw new Error(response.status);
      }
    } catch (err) {
      if (err === 400) {
        console.log('클라이언트 에러');
        return;
      }
      console.log('서버에러');
    }
  },

  async addCard(idOfContainer, idOfCardToAdd, header, body, footer, cardIndex, userId = 0) {
    try {
      const result = await fetch(
        `http://localhost:8080/user/card/${idOfContainer}/${idOfCardToAdd}`,
        {
          method: 'POST',
          body: JSON.stringify({
            header,
            body,
            footer,
            cardIndex,
            userId,
          }),
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        },
      );

      if (result.status !== 200) {
        throw new Error(response.status);
      }
    } catch (err) {
      if (err === 400) {
        console.log('클라이언트 에러');
        return;
      }
      console.log('서버에러');
    }
  },

  async updateCard(idOfContainerUpdated, idOfCardUpdated, header, body) {
    try {
      const result = await fetch(
        `http://localhost:8080/user/card/${idOfContainerUpdated}/${idOfCardUpdated}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            header,
            body,
          }),
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        },
      );

      if (result.status !== 200) {
        throw new Error(response.status);
      }
    } catch (err) {
      if (err === 400) {
        console.log('클라이언트 에러');
        return;
      }
      console.log('서버에러');
    }
  },

  async moveCard(idOfContainerMoved, idOfCardMoved, indexsOfStart, indexsToGo) {
    try {
      const result = await fetch(
        `http://localhost:8080/user/card/index/${idOfContainerMoved}/${idOfCardMoved}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            indexsOfStart,
            indexsToGo,
          }),
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        },
      );

      if (result.status !== 200) {
        throw new Error(response.status);
      }
    } catch (err) {
      if (err === 400) {
        console.log('클라이언트 에러');
        return;
      }
      console.log('서버에러');
    }
  },
};
