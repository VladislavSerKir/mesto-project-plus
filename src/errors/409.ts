const ERROR_CODE_409 = require('../utils');

class Conflict409 extends Error {
  code: number;

  constructor(message: string) {
    super(message);
    this.code = ERROR_CODE_409;
  }
}

module.exports = Conflict409;
