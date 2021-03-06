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

      const resultJSON = await result.json();
      const resultMSG = await JSON.parse(resultJSON).msg;

      return resultMSG;
    } catch (err) {
      if (err === 400) {
        console.log('클라이언트 에러');
        return;
      }
      console.log('서버에러');
    }
  },
};
