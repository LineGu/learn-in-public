const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const MySQLStore = require('express-mysql-session')(session);
const mysql = require('mysql');
const cors = require('cors');
const { request, response } = require('express');
const crypto = require('crypto');

const corsOption = {
  origin: true,
  credentials: true,
};

const app = express();

app.listen(8080, () => {
  console.log('Example app listening on port 8080!');
});

app.use(cors(corsOption));
app.use(bodyParser.json());
const options = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'HyunGu12',
  database: 'trello',
};

const connection = mysql.createConnection(options);
const sessionStore = new MySQLStore({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'HyunGu12',
  database: 'trello',
});
connection.connect();

app.use(
  session({
    name: 'loginCookie',
    secret: 'fsodfnoen@EJ@RUJFdsjkgnO#',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30 * 1000,
      secure: false,
    },
  }),
);

const createMsg = (msg) => {
  return { msg: msg };
};

const makePasswordHashed = (plainPassword, salt) =>
  new Promise(async (resolve, reject) => {
    crypto.pbkdf2(plainPassword, salt, 9999, 64, 'sha512', (err, key) => {
      if (err) reject(err);
      resolve(key.toString('base64'));
    });
  });

app.post('/login', (request, response) => {
  const post = request.body;
  const inputId = post.id;
  const inputPw = post.password;
  const isLogined = request.session.isLogined;
  if (isLogined) {
    response.json(JSON.stringify(createMsg('ALEADY LOGIN')));
    return;
  }

  const queryToFindAccoutByID = `SELECT * FROM users WHERE email="${inputId}"`;
  connection.query(queryToFindAccoutByID, async function (err, result, fields) {
    if (err) {
      response.json(JSON.stringify(createMsg('ERROR')));
      return;
    }

    const user = result[0] ?? false;

    if (!user) {
      response.json(JSON.stringify(createMsg('NO ID')));
      return;
    }
    const password = await makePasswordHashed(inputPw, user.salt);

    if (user.password !== password) {
      response.json(JSON.stringify(createMsg('NO PASSWORD')));
      return;
    }
    request.session.isLogined = true;
    request.session.name = user.name;
    request.session.userId = user.id;
    request.session.maxContainerId = user.maxContainerId;
    request.session.maxCardId = user.maxCardId;
    request.session.loginMethod = 'local';
    response.json(JSON.stringify(createMsg('SUCCESS')));
  });
});

const createUserData = (isLogined, name, maxContainerId, maxCardId) => {
  return { isLogined, name, maxContainerId, maxCardId };
};

const createSalt = () =>
  new Promise((resolve, reject) => {
    crypto.randomBytes(64, (err, buf) => {
      if (err) reject(err);
      resolve(buf.toString('base64'));
    });
  });

const createHashedPassword = (plainPassword) =>
  new Promise(async (resolve, reject) => {
    const salt = await createSalt();
    crypto.pbkdf2(plainPassword, salt, 9999, 64, 'sha512', (err, key) => {
      if (err) reject(err);
      resolve({ password: key.toString('base64'), salt });
    });
  });

app.get('/logout', (request, response) => {
  request.session.destroy();
  response.clearCookie('loginCookie');

  response.json(JSON.stringify(createMsg('LOGOUT SUCCESS')));
});

app.get('/user', (request, response) => {
  const userSession = request.session;
  const isLogined = userSession.isLogined;
  const userName = userSession.name;
  const maxContainerId = userSession.maxContainerId;
  const maxCardId = userSession.maxCardId;

  if (!isLogined || isLogined === undefined) {
    response.clearCookie('loginCookie'); //DB에서 실수로 session이 삭제된 경우, 사용자의 쿠키도 제거해주기 위함
    response.json(JSON.stringify(createMsg('NO COOKIE')));
    return;
  }
  response.json(JSON.stringify(createUserData(isLogined, userName, maxContainerId, maxCardId)));
});

app.post('/OverlappingId', (request, response) => {
  const inputId = request.body.id;
  const queryToCheckAccoutByID = `SELECT * FROM users WHERE email="${inputId}"`;

  connection.query(queryToCheckAccoutByID, function (err, result, fields) {
    if (err) {
      response.json(JSON.stringify(createMsg('ERROR')));
      return;
    }

    const user = result[0] ?? false;

    if (!user) {
      response.json(JSON.stringify(createMsg('AVAILABLE')));
      return;
    }

    response.json(JSON.stringify(createMsg('UNAVAILABLE')));
  });
});

app.post('/signUp', async (request, response) => {
  const userInfo = request.body;
  const { name, id, pw, phoneNumber } = userInfo;
  const { password, salt } = await createHashedPassword(pw);

  const queryToSignUp = `INSERT INTO users (name, email, password, salt, phoneNumber, LoginMethod, maxContainerId, maxCardId) VALUES ('${name}', '${id}', '${password}','${salt}' ,'${phoneNumber}', 'local', 2, 0)`;

  connection.query(queryToSignUp, function (err, result, fields) {
    if (err) {
      response.json(JSON.stringify(createMsg('ERROR')));
      return;
    }

    response.json(JSON.stringify(createMsg('SUCCESS')));
  });
});

app.post('/socialLogin', (request, response) => {
  const { name, id, loginMethod } = request.body;

  const queryToFindAccoutByID = `SELECT * FROM users WHERE email="${id}"`;

  connection.query(queryToFindAccoutByID, function (err, result, fields) {
    if (err) {
      response.json(JSON.stringify(createMsg('ERROR')));
      return;
    }

    const user = result[0] ?? false;

    if (user) {
      request.session.isLogined = true;
      request.session.name = name;
      request.session.userId = user.id;
      request.session.maxContainerId = user.maxContainerId;
      request.session.maxCardId = user.maxCardId;
      request.session.loginMethod = loginMethod ?? 'google';
      response.json(JSON.stringify(createMsg('LOGIN SUCCESS')));
      return;
    }
    response.json(JSON.stringify(createMsg('NOT USER')));
  });
});

app.post('/socialSignIn', (request, response) => {
  const { name, id, loginMethod } = request.body;

  loginMethodToInsert = loginMethod ?? 'google';

  const queryToSignUp = `INSERT INTO users (name, email, password, salt, phoneNumber, LoginMethod, maxContainerId, maxCardId) VALUES ('${name}', '${id}','','','','${loginMethodToInsert}',2,0)`;

  connection.query(queryToSignUp, function (err, result, fields) {
    if (err) {
      response.json(JSON.stringify(createMsg('ERROR')));
      return;
    }
    request.session.isLogined = true;
    request.session.name = name;
    response.json(JSON.stringify(createMsg('SIGNUP SUCCESS')));
  });
});

app.post('/findingId', (request, response) => {
  const { name, phoneNumber } = request.body;
  const queryToFindIdByNameAndPhone = `SELECT email FROM users WHERE name="${name}" AND phoneNumber="${phoneNumber}" AND LoginMethod="local"`;

  connection.query(queryToFindIdByNameAndPhone, (err, result, fields) => {
    if (err) {
      response.json(JSON.stringify(createMsg('ERROR')));
      return;
    }

    const isValidData = result.length === 0 ? false : true;

    if (!isValidData) {
      response.json(JSON.stringify(createMsg('NO ID')));
      return;
    }

    const userId = result[0].email;

    response.json(JSON.stringify(createMsg(userId)));
  });
});

app.post('/userId', (request, response) => {
  const { name, id } = request.body;
  const queryToFindIdByUserId = `SELECT id FROM users WHERE name="${name}" AND email="${id}"`;

  connection.query(queryToFindIdByUserId, (err, result, fields) => {
    if (err) {
      response.json(JSON.stringify(createMsg('ERROR')));
      return;
    }

    const isValidData = result.length === 0 ? false : true;

    if (!isValidData) {
      response.json(JSON.stringify(createMsg('INVAILD')));
      return;
    }

    const userId = result[0].id;

    response.json(JSON.stringify(createMsg(userId)));
  });
});

app.post('/defaultContianer', (request, response) => {
  const { userId } = request.body;

  const queryToCreateDefaultContainer = `insert into container(userId,containerId,name,count,containerIndex) values (${userId},0,'할 일',1,0),(${userId},1,'진행 중',0,1),(${userId},2,'완료',0,2)`;

  connection.query(queryToCreateDefaultContainer, (err, result, fields) => {
    if (err) {
      response.json(JSON.stringify(createMsg('ERROR')));
      return;
    }
    response.json(JSON.stringify(createMsg('SUCCESS')));
  });
});

app.post('/defaultContainerId', (request, response) => {
  const { userId } = request.body;
  const queryToSelectContainerIdOfDB = `select id from container where userId=${userId} ORDER BY id`;

  connection.query(queryToSelectContainerIdOfDB, (err, result, fields) => {
    if (err) {
      response.json(JSON.stringify(createMsg('ERROR')));
      return;
    }

    response.json(JSON.stringify(createMsg(result[0].id)));
  });
});

app.post('/defaultCard', (request, response) => {
  const { userId, containerId } = request.body;

  const queryToCreateDefaultCard = `insert into card(userId,containerId,cardId,header,body,footer,cardIndex) values (${userId},${containerId},0,'해야할 일을 입력해보세요!','구체적인 내용을 입력하세요! 그 후에 이 카드를 드래그해서 진행 중으로 옮겨보세요~','사용자님의 닉네임이 들어갑니다!',0)`;

  connection.query(queryToCreateDefaultCard, (err, result, fields) => {
    if (err) {
      console.log(err);
      response.json(JSON.stringify(createMsg('ERROR')));
      return;
    }

    response.json(JSON.stringify(createMsg('SUCCESS')));
  });
});

app
  .route('/user/container/:id')
  .get((request, response) => {
    const userId = request.session.userId;
    const containerIdToFind = request.params.id;

    const queryToGetCardContainer =
      containerIdToFind === 'all'
        ? `SELECT containerId AS id,name,count FROM container WHERE userId=${userId} ORDER BY containerIndex`
        : `SELECT containerId AS id,name,count FROM container WHERE userId=${userId} AND containerId=${containerIdToFind} ORDER BY containerIndex`;

    connection.query(queryToGetCardContainer, (err, result, fields) => {
      if (err) {
        console.log(err);
        response.status(500).json(JSON.stringify(createMsg('ERROR')));
        return;
      }

      if (result.length === 0) {
        response.status(400).json(JSON.stringify(createMsg('NO CONTAINER')));
        return;
      }

      const resultArr = [];
      result.forEach((result) => {
        resultArr.push(result);
      });

      response.status(200).json(JSON.stringify(resultArr));
    });
  })
  .delete((request, response) => {
    const userId = request.session.userId;
    const containerIdToFind = request.params.id;

    const queryToDeleteCardContainer = `DELETE FROM container WHERE userId=${userId} AND containerId=${containerIdToFind}`;

    connection.query(queryToDeleteCardContainer, (err, result, fields) => {
      if (err) {
        response.status(500).json(JSON.stringify(createMsg('ERROR')));
        return;
      }

      response.status(200).json(JSON.stringify(createMsg('SUCCESS')));
    });
  });

app.get('/user/container/:containerId/card/:cardId', (request, response) => {
  const userId = request.session.userId;
  const containerIdToFind = request.params.containerId;
  const cardIdToFind = request.params.cardId;

  const queryToGetCard =
    cardIdToFind === 'all'
      ? `SELECT card.cardId AS id,card.header,card.body,card.footer FROM card  JOIN container WHERE container.containerId = ${containerIdToFind} AND container.id = card.containerId AND container.userId = ${userId} ORDER BY card.cardIndex;`
      : `SELECT card.cardId AS id,card.header,card.body,card.footer FROM card  JOIN container WHERE container.containerId = ${containerIdToFind} AND container.id = card.containerId AND container.userId = ${userId} AND card.cardId = ${cardIdToFind} ORDER BY card.cardIndex;`;

  connection.query(queryToGetCard, (err, result, fields) => {
    if (err) {
      console.log(err);
      response.status(500).json(JSON.stringify(createMsg('ERROR')));
      return;
    }

    if (result.length === 0) {
      response.status(200).json(JSON.stringify(result));
      return;
    }

    const resultArr = [];
    result.forEach((result) => {
      resultArr.push(result);
    });

    response.status(200).json(JSON.stringify(resultArr));
  });
});

app.use(function (req, res, next) {
  res.status(404).send('Sorry cant find that!');
});
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
