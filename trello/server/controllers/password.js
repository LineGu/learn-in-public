const dataBase = require('../initialize/dataBase.js');
const password = require('../utils/password.js');
const serverMassage = require('../massage/serverMassage.js');
const StatusCode = require('../massage/StatusCode.js');
const errorHandler = require('../utils/errorHandler');

const { createMsg } = serverMassage;
const { createHashedPassword } = password;
const { pool } = dataBase.connectDataBase();

const passwordController = {
  async changePassword(request, response) {
    try {
      const { newPw, userId } = request.body;

      const { password, salt } = await createHashedPassword(newPw);

      const queryToChangePw = `update users set password = '${password}', salt = '${salt}' where id=${userId}`;
      await pool.query(queryToChangePw);

      response.status(StatusCode.OK).json(createMsg(`SUCCESS`));
    } catch (err) {
      errorHandler(err, response, 'ERROR');
    }
  },
};

module.exports = passwordController;
