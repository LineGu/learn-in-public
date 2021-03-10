const dataBase = require('../initialize/dataBase.js');
const password = require('../utils/password.js');
const serverMassage = require('../massage/serverMassage.js');
const StatusCode = require('../massage/StatusCode.js');

const { createMsg } = serverMassage;
const { makePasswordHashed } = password;
const { pool } = dataBase.connectDataBase();

const authController = {
  createSession(session, isLogined, name, userId, loginMethod) {
    session.isLogined = isLogined;
    session.name = name;
    session.userId = userId;
    session.loginMethod = loginMethod;
  },

  destroySessionCookie(request, response) {
    request.session.destroy();
    response.clearCookie('loginCookie');
    response.status(StatusCode.OK).json(createMsg('LOGOUT SUCCESS'));
  },

  async getUserData(userID) {
    const queryToFindAccoutByID = `SELECT * FROM users WHERE email="${userID}"`;
    const resultOfAccount = await pool.query(queryToFindAccoutByID);
    const userData = resultOfAccount[0][0] ?? false;
    return userData;
  },

  async tryLocalLoginProcess(request, response) {
    try {
      const { id: idOfInput, password: plainPassword } = request.body;
      const isLogined = request.session.isLogined;
      if (isLogined) {
        response.status(StatusCode.OK).json(createMsg('ALEADY LOGIN'));
        return;
      }

      const userData = await authController.getUserData(idOfInput);
      if (!userData) {
        response.status(StatusCode.CLIENT_ERROR).json(createMsg('NO ID'));
        return;
      }

      const passwordHashed = await makePasswordHashed(plainPassword, userData.salt);
      const isValidPassword = userData.password === passwordHashed;
      if (!isValidPassword) {
        response.status(StatusCode.CLIENT_ERROR).json(createMsg('NO PASSWORD'));
        return;
      }

      authController.createSession(request.session, true, userData.name, userData.id, 'local');
      response.status(StatusCode.OK).json(createMsg('SUCCESS'));
    } catch (err) {
      response.status(StatusCode.SERVER_ERROR).json({ error: err });
    }
  },

  async trySocialLoginProcess(request, response) {
    try {
      const { id: userId, loginMethod } = request.body;
      const userData = await authController.getUserData(userId);
      if (!userData) {
        response.status(StatusCode.OK).json(createMsg('NOT USER'));
        return;
      }

      authController.createSession(request.session, true, userData.name, userData.id, loginMethod);
      response.status(StatusCode.OK).json(createMsg('LOGIN SUCCESS'));
    } catch (err) {
      response.status(StatusCode.SERVER_ERROR).json({ error: err });
    }
  },

  tryLogout(request, response) {
    const isSocialLogin = request.session.loginMethod !== 'local';
    if (isSocialLogin) {
      authController.tryLogoutForSocial();
    }
    authController.destroySessionCookie(request, response);
  },

  tryLogoutForSocial() {},
};

module.exports = authController;
