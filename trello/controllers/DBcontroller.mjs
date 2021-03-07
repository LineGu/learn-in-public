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
  async addContainer(idOfAddContainer, name, containerIndex) {
    try {
      const result = await fetch(`http://localhost:8080/user/container/${idOfAddContainer}`, {
        method: 'POST',
        body: JSON.stringify({
          name,
          containerIndex,
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

  async updateMaxContainerId(idOfAddContainer) {
    try {
      const result = await fetch(`http://localhost:8080/user/maxContainerId`, {
        method: 'PATCH',
        body: JSON.stringify({
          containerId: idOfAddContainer,
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

  async updateMaxCardId(idOfAddCard) {
    try {
      const result = await fetch(`http://localhost:8080/user/maxCardId`, {
        method: 'PATCH',
        body: JSON.stringify({
          cardId: idOfAddCard,
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

  async deleteCard(idOfContainer, idOfCardToDelete) {
    try {
      const result = await fetch(
        `http://localhost:8080/user/container/${idOfContainer}/card/${idOfCardToDelete}`,
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

  async addCard(idOfContainer, idOfCardToAdd, containerIdOfDB, header, body, footer, cardIndex) {
    try {
      const result = await fetch(
        `http://localhost:8080/user/container/${idOfContainer}/card/${idOfCardToAdd}`,
        {
          method: 'POST',
          body: JSON.stringify({
            containerIdOfDB,
            header,
            body,
            footer,
            cardIndex,
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
        `http://localhost:8080/user/container/${idOfContainerUpdated}/card/${idOfCardUpdated}`,
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
        `http://localhost:8080/user/container/${idOfContainerMoved}/card/index/${idOfCardMoved}`,
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

  async findContainerIdOfDB(idOfContainer) {
    try {
      const result = await fetch(`http://localhost:8080/user/containerIdOfDB/${idOfContainer}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (result.status !== 200) {
        throw new Error(response.status);
      }

      const ContainerIdOfDBForJSON = await result.json();
      const ContainerIdOfDB = await JSON.parse(ContainerIdOfDBForJSON).msg;

      return ContainerIdOfDB;
    } catch (err) {
      if (err === 400) {
        console.log('클라이언트 에러');
        return;
      }
      console.log('서버에러');
    }
  },

  async updateCount(idOfContainer, newCount) {
    try {
      const result = await fetch(`http://localhost:8080/user/container/${idOfContainer}/count`, {
        method: 'PATCH',
        body: JSON.stringify({
          newCount,
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
};
