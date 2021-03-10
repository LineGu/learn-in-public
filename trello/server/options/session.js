const dataBase = require('../initialize/dataBase.js');

const { sessionStore } = dataBase.connectDataBase();

const sessionOptions = {
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  resave: process.env.SESSION_RESAVE,
  saveUninitialized: process.env.SESSION_ISINITIALIZE,
  store: sessionStore,
  cookie: {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30 * 1000,
    secure: false,
  },
};

module.exports = sessionOptions;
