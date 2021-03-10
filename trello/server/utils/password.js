const crypto = require('crypto');

const password = {
  makePasswordHashed(plainPassword, salt) {
    return new Promise(async (resolve, reject) => {
      crypto.pbkdf2(plainPassword, salt, 9999, 64, 'sha512', (err, key) => {
        if (err) reject(err);
        resolve(key.toString('base64'));
      });
    });
  },

  createSalt() {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(64, (err, buf) => {
        if (err) reject(err);
        resolve(buf.toString('base64'));
      });
    });
  },

  createHashedPassword(plainPassword) {
    return new Promise(async (resolve, reject) => {
      const salt = await password.createSalt();
      crypto.pbkdf2(plainPassword, salt, 9999, 64, 'sha512', (err, key) => {
        if (err) reject(err);
        resolve({ password: key.toString('base64'), salt });
      });
    });
  },
};

module.exports = password;
