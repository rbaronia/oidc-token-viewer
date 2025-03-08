// Browser-compatible logger implementation
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

class BrowserLogger {
  constructor() {
    this.level = process.env.REACT_APP_LOG_LEVEL || 'info';
  }

  getTimestamp() {
    return new Date().toISOString();
  }

  formatMessage(level, message, ...args) {
    const timestamp = this.getTimestamp();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  shouldLog(level) {
    return LOG_LEVELS[level] <= LOG_LEVELS[this.level];
  }

  error(message, ...args) {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message), ...args);
    }
  }

  warn(message, ...args) {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message), ...args);
    }
  }

  info(message, ...args) {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message), ...args);
    }
  }

  debug(message, ...args) {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message), ...args);
    }
  }
}

const logger = new BrowserLogger();

export default logger;
