// Logger utility pour l'application
class Logger {
  constructor() {
    this.logLevel = 'DEBUG'; // DEBUG, INFO, WARN, ERROR
    this.logs = [];
  }

  formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level}] ${message}`;
    
    if (data) {
      console.log(formattedMessage, data);
      this.logs.push({ timestamp, level, message, data });
    } else {
      console.log(formattedMessage);
      this.logs.push({ timestamp, level, message });
    }
  }

  debug(message, data = null) {
    if (this.shouldLog('DEBUG')) {
      this.formatMessage('DEBUG', message, data);
    }
  }

  info(message, data = null) {
    if (this.shouldLog('INFO')) {
      this.formatMessage('INFO', message, data);
    }
  }

  warn(message, data = null) {
    if (this.shouldLog('WARN')) {
      this.formatMessage('WARN', message, data);
    }
  }

  error(message, data = null) {
    if (this.shouldLog('ERROR')) {
      this.formatMessage('ERROR', message, data);
    }
  }

  shouldLog(level) {
    const levels = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }

  // Méthode spéciale pour les requêtes HTTP
  logHttpRequest(method, url, options = {}) {
    this.info(`🌐 HTTP ${method} Request`, {
      url,
      options: {
        ...options,
        // Masquer les données sensibles si nécessaire
        headers: options.headers ? { ...options.headers } : undefined
      }
    });
  }

  logHttpResponse(method, url, response, duration) {
    const status = response.status;
    const statusText = response.statusText;
    
    if (status >= 200 && status < 300) {
      this.info(`✅ HTTP ${method} Success (${duration}ms)`, {
        url,
        status,
        statusText
      });
    } else if (status >= 400) {
      this.error(`❌ HTTP ${method} Error (${duration}ms)`, {
        url,
        status,
        statusText
      });
    } else {
      this.warn(`⚠️ HTTP ${method} Warning (${duration}ms)`, {
        url,
        status,
        statusText
      });
    }
  }

  // Méthode pour logger les erreurs API avec détails
  logApiError(endpoint, error, context = {}) {
    this.error(`🚨 API Error on ${endpoint}`, {
      error: error.message,
      stack: error.stack,
      context
    });
  }
}

// Instance singleton du logger
const logger = new Logger();

export default logger;