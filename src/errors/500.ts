const ERROR_CODE_500 = require('../utils');

class ServerError500 extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_CODE_500;
  }
}

module.exports = ServerError500;
