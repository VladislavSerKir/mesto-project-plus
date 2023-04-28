const ERROR_CODE_404 = require('../utils');

class NotFound404 extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_CODE_404;
  }
}

module.exports = NotFound404;
