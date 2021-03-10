const expressInitializer = require('./express');
const dataBaseInitializer = require('./dataBase');

const initializer = (app) => {
  expressInitializer.init(app);
  dataBaseInitializer.connectDataBase();
};

module.exports = initializer;
