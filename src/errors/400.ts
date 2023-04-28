const ERROR_CODE_400 = require('../utils');

class BadRequest400 extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_CODE_400;
  }
}

module.exports = BadRequest400;
