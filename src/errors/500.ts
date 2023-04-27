const ERROR_CODE_500 = require('../utils');
const ERROR_MESSAGE_500 = require('../utils');

class ServerError500 extends Error {
  statusCode: number;

  message: string;

  constructor() {
    super(ERROR_MESSAGE_500);
    this.message = ERROR_MESSAGE_500;
    this.statusCode = ERROR_CODE_500;
  }
}

module.exports = ServerError500;
