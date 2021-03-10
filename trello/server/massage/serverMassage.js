const serverMassage = {
  createMsg(msg) {
    const msgObject = { msg: msg };
    const msgJson = JSON.stringify(msgObject);
    return msgJson;
  },
};

module.exports = serverMassage;
