const StatusCode = require('../massage/StatusCode.js');
const serverMassage = require('../massage/serverMassage.js');

const { createMsg } = serverMassage;

const errorHandler = (err, response, clientErrMsg) => {
  if (err instanceof TypeError) {
    response.status(StatusCode.CLIENT_ERROR).json(createMsg(clientErrMsg));
    return;
  }
  response.status(StatusCode.SERVER_ERROR).json({ error: err });
};

module.exports = errorHandler;
