const ERROR_CODE_404 = require('../utils');
const ERROR_MESSAGE_404 = require('../utils');

class NotFound404 extends Error {
  statusCode: number;

  message: string;

  constructor() {
    super(ERROR_MESSAGE_404);
    this.message = ERROR_MESSAGE_404;
    this.statusCode = ERROR_CODE_404;
  }
}

module.exports = NotFound404;
