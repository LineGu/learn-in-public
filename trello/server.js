const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const MySQLStore = require('express-mysql-session')(session);
const mysql = require('mysql');
const cors = require('cors');
const { request, response } = require('express');
const crypto = require('crypto');
const mysql2 = require('mysql2/promise');
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
const pool = mysql2.createPool(options);

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

app.get('/user', async (request, response) => {
  const userSession = request.session;
  const { isLogined, name, userId } = userSession;

  if (!isLogined || isLogined === undefined) {
    response.clearCookie('loginCookie'); //DB에서 실수로 session이 삭제된 경우, 사용자의 쿠키도 제거해주기 위함
    response.json(JSON.stringify(createMsg('NO COOKIE')));
    return;
  }

  const queryToGetMaxId = `SELECT maxContainerId, maxCardId FROM users WHERE id=${userId}`;

  const MaxId = await pool.query(queryToGetMaxId);

  const { maxContainerId, maxCardId } = await MaxId[0][0];

  response.json(JSON.stringify(createUserData(isLogined, name, maxContainerId, maxCardId)));
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

app.route(`/user/container/index/:idOfContainerMoved`).patch(async (request, response) => {
  try {
    const userId = request.session.userId;
    const idOfContainerMoved = request.params.idOfContainerMoved;
    const { indexOfStart, indexToGo } = request.body;

    const queryToHideContainerToUpdate = `update container set containerIndex = -1 where userId = ${userId} AND containerId = ${idOfContainerMoved}`;
    await pool.query(queryToHideContainerToUpdate);

    const queryToSubIndexAfterContainerStarted = `update container set containerIndex = containerIndex - 1 where userId = ${userId} AND containerIndex > ${indexOfStart}`;
    await pool.query(queryToSubIndexAfterContainerStarted);

    const queryToAddIndexAfterContainerToGo = `update container set containerIndex = containerIndex + 1 where userId = ${userId} AND containerIndex >= ${indexToGo}`;
    await pool.query(queryToAddIndexAfterContainerToGo);

    const queryToUpdateContainerIndex = `update container set containerIndex = ${indexToGo} where userId = ${userId} AND containerId = ${idOfContainerMoved}`;
    await pool.query(queryToUpdateContainerIndex);

    response.status(200).json(JSON.stringify(createMsg('SUCCESS')));
  } catch (err) {
    console.log(err);
    response.status(400).json(JSON.stringify(createMsg('ERR')));
  }
});

app
  .route('/user/container/:idOfContainer/card/index/:idOfCard')
  .patch(async (request, response) => {
    try {
      console.log(1);
      const userId = request.session.userId;
      const idOfContainerMoved = request.params.idOfContainer;
      const idOfCardMoved = request.params.idOfCard;
      const { indexsOfStart, indexsToGo } = request.body;

      const queryToHideCardToMove = `update card set cardIndex = -1 where userId = ${userId} AND cardId = ${idOfCardMoved}`;
      await pool.query(queryToHideCardToMove);

      const getStartedContainerIdOfDB = `select containerId from card where userId = ${userId} AND cardId = ${idOfCardMoved}`;
      const StartedContainerIdOfDBResult = await pool.query(getStartedContainerIdOfDB);
      const StartedContainerIdOfDB = await StartedContainerIdOfDBResult[0][0].containerId;

      const updateStartedContainerCount = `UPDATE container SET count = count - 1 WHERE userId = ${userId} AND id = ${StartedContainerIdOfDB}`;
      await pool.query(updateStartedContainerCount);

      const queryToSubIndexAfterContainerStarted = `update card set cardIndex = cardIndex - 1 where userId = ${userId} AND containerId = ${StartedContainerIdOfDB} AND cardIndex > ${indexsOfStart[1]}`;
      await pool.query(queryToSubIndexAfterContainerStarted);

      ///집은 카드가 삭제된 것 처럼 됨.

      const getArrivedContainerIdOfDB = `select id from container where userId = ${userId} AND containerIndex = ${indexsToGo[0]}`;
      const ArrivedContainerIdOfDBResult = await pool.query(getArrivedContainerIdOfDB);
      const ArrivedContainerIdOfDB = await ArrivedContainerIdOfDBResult[0][0].id;

      const updateArrivedContainerCount = `UPDATE container SET count = count + 1 WHERE userId = ${userId} AND id = ${ArrivedContainerIdOfDB}`;
      await pool.query(updateArrivedContainerCount);

      const queryToAddIndexAfterContainerToGo = `update card set cardIndex = cardIndex + 1 where userId = ${userId} AND containerId = ${ArrivedContainerIdOfDB} AND cardIndex >= ${indexsToGo[1]}`;
      await pool.query(queryToAddIndexAfterContainerToGo);

      // 갈 곳에 정착한 것처럼 행동

      const queryToUpdateContainerIndex = `update card set cardIndex = '${indexsToGo[1]}', containerId = ${ArrivedContainerIdOfDB} where userId = ${userId} AND cardId = ${idOfCardMoved}`;
      await pool.query(queryToUpdateContainerIndex);

      // 집은 카드 인덱스 제대로 설정

      response.status(200).json(JSON.stringify(createMsg('SUCCESS')));
    } catch (err) {
      console.log(err);
      response.status(400).json(JSON.stringify(createMsg('ERR')));
    }
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

      const resultArr = [];
      result.forEach((result) => {
        resultArr.push(result);
      });

      response.status(200).json(JSON.stringify(resultArr));
    });
  })
  .delete(async (request, response) => {
    const userId = request.session.userId;
    const containerIdToDelete = request.params.id;

    const queryToFindContainerIndex = `SELECT containerIndex FROM container WHERE userId=${userId} AND containerId=${containerIdToDelete}`;

    const containerIndexResult = await pool.query(queryToFindContainerIndex);

    const containerIndex = containerIndexResult[0][0].containerIndex;

    const queryToRefreshIndex = `update container set containerIndex = containerIndex - 1 where userId = ${userId} AND containerIndex > ${containerIndex}`;

    await pool.query(queryToRefreshIndex);

    const queryToDeleteCardContainer = `DELETE FROM container WHERE userId=${userId} AND containerId=${containerIdToDelete}`;

    connection.query(queryToDeleteCardContainer, (err, result, fields) => {
      if (err) {
        response.status(500).json(JSON.stringify(createMsg('ERROR')));
        return;
      }

      response.status(200).json(JSON.stringify(createMsg('SUCCESS')));
    });
  })
  .post((request, response) => {
    const userId = request.session.userId;
    const { name, containerIndex } = request.body;
    const containerIdToAdd = request.params.id;

    const queryToAddCardContainer = `INSERT INTO container(userId,containerId,name,count,containerIndex) VALUES (${userId},${containerIdToAdd},'${name}',0,${containerIndex})`;

    connection.query(queryToAddCardContainer, (err, result, fields) => {
      if (err) {
        response.status(500).json(JSON.stringify(createMsg('ERROR')));
        return;
      }
      response.status(200).json(JSON.stringify(createMsg('SUCCESS')));
    });
  })
  .patch(async (request, response) => {
    try {
      const userId = request.session.userId;
      const containerIdToUpdate = request.params.id;
      const { name } = request.body;
      const queryToUpdateContainer = `update container set name = '${name}' where userId = ${userId} AND containerId = ${containerIdToUpdate}`;

      await pool.query(queryToUpdateContainer);

      response.status(200).json(JSON.stringify(createMsg('SUCCESS')));
    } catch (err) {
      console.log(err);
      response.status(400).json(JSON.stringify(createMsg('ERR')));
    }
  });

app.route('/user/maxContainerId').patch((request, response) => {
  const userId = request.session.userId;
  const { containerId } = request.body;

  const queryToChangeMaxContainerId = `UPDATE users SET maxContainerId = ${containerId} WHERE id = ${userId};`;
  connection.query(queryToChangeMaxContainerId, (err, result, fields) => {
    if (err) {
      response.status(500).json(JSON.stringify(createMsg('ERROR')));
      return;
    }

    response.status(200).json(JSON.stringify(createMsg('SUCCESS')));
  });
});

app.route('/user/maxCardId').patch((request, response) => {
  const userId = request.session.userId;
  const { cardId } = request.body;

  const queryToChangeMaxContainerId = `UPDATE users SET maxCardId = ${cardId} WHERE id = ${userId};`;
  connection.query(queryToChangeMaxContainerId, (err, result, fields) => {
    if (err) {
      response.status(500).json(JSON.stringify(createMsg('ERROR')));
      return;
    }

    response.status(200).json(JSON.stringify(createMsg('SUCCESS')));
  });
});

app
  .route('/user/container/:containerId/card/:cardId')
  .get((request, response) => {
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
  })
  .delete(async (request, response) => {
    const userId = request.session.userId;
    const cardIdToDelete = request.params.cardId;

    const queryToFindCardIndexAndContainerIdOfDB = `SELECT cardIndex,containerId FROM card WHERE userId=${userId} AND cardId=${cardIdToDelete}`;

    const CardIndexAndContainerIdOfDB = await pool.query(queryToFindCardIndexAndContainerIdOfDB);

    const { cardIndex, containerId } = await CardIndexAndContainerIdOfDB[0][0];

    const queryToRefreshIndex = `update card set cardIndex = cardIndex - 1 where userId = ${userId} AND containerId = ${containerId} AND cardIndex > ${cardIndex}`;

    await pool.query(queryToRefreshIndex);

    const queryToDeleteCard = `DELETE FROM card WHERE userId=${userId} AND cardId=${cardIdToDelete}`;

    await pool.query(queryToDeleteCard);
    response.status(200).json(JSON.stringify(createMsg('SUCCESS')));
  })
  .post(async (request, response) => {
    const userId = request.session.userId;
    const cardIdToAdd = request.params.cardId;
    const { containerIdOfDB, header, body, footer, cardIndex } = request.body;

    const queryToRefreshIndex = `update card set cardIndex = cardIndex + 1 where userId = ${userId} AND containerId = ${containerIdOfDB} AND cardIndex >= ${cardIndex}`;

    await pool.query(queryToRefreshIndex);

    const queryToAddCardContainer = `INSERT INTO card(userId,containerId,cardId,header,body,footer,cardIndex) VALUES (${userId},${containerIdOfDB},${cardIdToAdd},'${header}','${body}','${footer}',${cardIndex})`;

    await pool.query(queryToAddCardContainer);

    response.status(200).json(JSON.stringify(createMsg('SUCCESS')));
  })
  .patch(async (request, response) => {
    try {
      const userId = request.session.userId;
      const cardIdToUpdate = request.params.cardId;
      const { header, body } = request.body;
      const queryToUpdateCard = `update card set header = '${header}', body = '${body}' where userId = ${userId} AND cardId = ${cardIdToUpdate}`;

      await pool.query(queryToUpdateCard);

      response.status(200).json(JSON.stringify(createMsg('SUCCESS')));
    } catch (err) {
      console.log(err);
      response.status(400).json(JSON.stringify(createMsg('ERR')));
    }
  });

app.patch('/user/container/:containerId/count', (request, response) => {
  const userId = request.session.userId;
  const containerId = request.params.containerId;
  const { newCount } = request.body;

  const queryToChangeCount = `UPDATE container SET count = ${newCount} WHERE userId = ${userId} AND containerId=${containerId};`;

  connection.query(queryToChangeCount, (err, result, fields) => {
    if (err) {
      response.status(500).json(JSON.stringify(createMsg('ERROR')));
      return;
    }

    response.status(200).json(JSON.stringify(createMsg('SUCCESS')));
  });
});

app.get('/user/containerIdOfDB/:containerId', (request, response) => {
  const userId = request.session.userId;
  const containerId = request.params.containerId;
  const queryToSelectContainerIdOfDB = `select id from container where userId=${userId} AND containerId=${containerId}`;

  connection.query(queryToSelectContainerIdOfDB, (err, result, fields) => {
    if (err) {
      response.json(JSON.stringify(createMsg('ERROR')));
      return;
    }

    response.json(JSON.stringify(createMsg(result[0].id)));
  });
});

app.post('/findigPw', async (request, response) => {
  const { name, email, phoneNumber } = request.body;
  const queryToFindUserId = `SELECT id FROM users WHERE name="${name}" AND phoneNumber="${phoneNumber}" AND email="${email}" AND LoginMethod="local"`;

  const userIdResult = await pool.query(queryToFindUserId);

  if (!userIdResult[0][0]) {
    response.status(400).json(JSON.stringify(createMsg('INVALID')));
    return;
  }

  const userId = userIdResult[0][0].id;
  response.status(200).json(JSON.stringify(createMsg(`${userId}`)));
});

app.patch('/pw', async (request, response) => {
  try {
    const { newPw, userId } = request.body;
    const { password, salt } = await createHashedPassword(newPw);
    console.log(password, salt);
    const queryToChangePw = `update users set password = '${password}', salt = '${salt}' where id=${userId}`;

    await pool.query(queryToChangePw);

    response.status(200).json(JSON.stringify(createMsg(`SUCCESS`)));
  } catch (err) {
    console.log(err);
    response.status(200).json(JSON.stringify(createMsg(`ERR`)));
  }
});

app.use(function (req, res, next) {
  res.status(404).send('Sorry cant find that!');
});
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
