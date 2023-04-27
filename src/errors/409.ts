const ERROR_CODE_409 = require('../utils');
// const ERROR_MESSAGE_409 = require('../utils');

class Conflict409 extends Error {
  code: number;

  // message: string;

  constructor(message: string) {
    super(message);
    this.message = message;
    this.code = ERROR_CODE_409;
  }
}

module.exports = Conflict409;
