const ERROR_CODE_401 = require('../utils');

class AuthorizationError401 extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_CODE_401;
  }
}

module.exports = AuthorizationError401;
