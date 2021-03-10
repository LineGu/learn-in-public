const cors = require('cors');
const bodyParser = require('body-parser');
const sessionOptions = require('../options/session.js');
const corsOption = require('../options/cors.js');
const auth = require('../routes/auth');
const signUp = require('../routes/signUp');
const user = require('../routes/user');
const session = require('express-session');

const expressInitializer = {
  init(app) {
    app.use(cors(corsOption));
    app.use(bodyParser.json());
    app.use(session(sessionOptions));
    app.use('/auth', auth);
    app.use('/signUp', signUp);
    app.use('/user', user);
  },
};

module.exports = expressInitializer;
