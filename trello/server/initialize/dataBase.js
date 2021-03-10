const mysql = require('mysql2/promise');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const DBoptions = require('../options/dataBase.js');

const dataBaseInitializer = {
  connectDataBase() {
    const pool = mysql.createPool(DBoptions);
    const sessionStore = new MySQLStore(DBoptions);

    return { pool, sessionStore };
  },
};

module.exports = dataBaseInitializer;
