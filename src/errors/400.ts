const ERROR_CODE_400 = require('../utils');
const ERROR_MESSAGE_400 = require('../utils');

class BadRequest400 extends Error {
  statusCode: number;

  message: string;

  constructor() {
    super(ERROR_MESSAGE_400);
    this.message = ERROR_MESSAGE_400;
    this.statusCode = ERROR_CODE_400;
  }
}

module.exports = BadRequest400;
