const dataBase = require('../initialize/dataBase.js');
const password = require('../utils/password.js');
const serverMassage = require('../massage/serverMassage.js');
const StatusCode = require('../massage/StatusCode.js');

const { createMsg } = serverMassage;
const { createHashedPassword } = password;
const { pool } = dataBase.connectDataBase();

const signUpController = {
  async signUp(request, response) {
    try {
      const { name, id, pw, phoneNumber, loginMethod } = request.body;
      const { password: passwordHashed, salt } = await createHashedPassword(pw);
      const defaultMaxContainerId = 2;
      const defaultMaxCardId = 0;

      const queryToSignUp = `INSERT INTO users 
      (name, email, password, salt, phoneNumber, LoginMethod, maxContainerId, maxCardId) 
      VALUES ('${name}', '${id}', '${passwordHashed}','${salt}' ,'${phoneNumber}', '${loginMethod}', ${defaultMaxContainerId}, ${defaultMaxCardId})`;

      await pool.query(queryToSignUp);
      response.status(StatusCode.OK).json(createMsg('SUCCESS'));
    } catch (err) {
      response.status(StatusCode.SERVER_ERROR).json({ error: err });
    }
  },

  async checkOverlapOfId(request, response) {
    try {
      const inputId = request.body.id;
      const queryToCheckAccoutByID = `SELECT * FROM users WHERE email="${inputId}"`;

      const resultOfAccount = await pool.query(queryToCheckAccoutByID);
      const user = resultOfAccount[0][0] ?? false;
      if (!user) {
        response.status(StatusCode.OK).json(createMsg('AVAILABLE'));
        return;
      }

      response.status(StatusCode.OK).json(createMsg('UNAVAILABLE'));
    } catch (err) {
      response.status(StatusCode.SERVER_ERROR).json({ error: err });
    }
  },
};

module.exports = signUpController;
