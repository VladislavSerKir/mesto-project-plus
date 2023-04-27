const ERROR_CODE_401 = require('../utils');
const ERROR_MESSAGE_401 = require('../utils');

class AuthorizationError401 extends Error {
  statusCode: number;

  message: string;

  constructor() {
    super(ERROR_MESSAGE_401);
    this.message = ERROR_MESSAGE_401;
    this.statusCode = ERROR_CODE_401;
  }
}

module.exports = AuthorizationError401;
