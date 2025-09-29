import log from 'electron-log';
import path from 'path';

// Configuration du logger Electron avec vérification de sécurité
if (log && log.transports && log.transports.file) {
  log.transports.file.level = 'debug';
  log.transports.console.level = 'debug';

  // Format personnalisé pour les logs
  log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';
  log.transports.console.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';

  // Configuration du fichier de log
  log.transports.file.fileName = 'electron-demo.log';
  log.transports.file.maxSize = 10485760;
  log.transports.file.archiveLogFn = file => {
    const info = path.parse(file);
    return `${info.name}.old${info.ext}`;
  };
} else {
  console.warn('electron-log transports not available, using console fallback');
}

class Logger {
  constructor() {
    this.logLevel = 'debug';
  }

  debug(message, data = null) {
    if (data) {
      log.debug(message, data);
    } else {
      log.debug(message);
    }
  }

  info(message, data = null) {
    if (data) {
      log.info(message, data);
    } else {
      log.info(message);
    }
  }

  warn(message, data = null) {
    if (data) {
      log.warn(message, data);
    } else {
      log.warn(message);
    }
  }

  error(message, data = null) {
    if (data) {
      log.error(message, data);
    } else {
      log.error(message);
    }
  }

  logError(error, context = {}) {
    log.error('Error occurred:', {
      message: error.message,
      stack: error.stack,
      context,
    });
  }

  logHttpRequest(method, url, options = {}) {
    log.info(`🌐 HTTP ${method} Request`, {
      url,
      options: {
        ...options,
        headers: options.headers ? this.sanitizeHeaders(options.headers) : undefined,
      },
    });
  }

  logHttpResponse(method, url, response, duration) {
    const status = response.status;
    const statusText = response.statusText;

    const logData = {
      url,
      status,
      statusText,
      duration: `${duration}ms`,
    };

    if (status >= 200 && status < 300) {
      log.info(`✅ HTTP ${method} Success`, logData);
    } else if (status >= 400) {
      log.error(`❌ HTTP ${method} Error`, logData);
    } else {
      log.warn(`⚠️ HTTP ${method} Warning`, logData);
    }
  }

  logApiError(endpoint, error, context = {}) {
    log.error(`🚨 API Error on ${endpoint}`, {
      error: error.message,
      stack: error.stack,
      context,
    });
  }

  logAuth(action, success = true, details = {}) {
    const level = success ? 'info' : 'warn';
    const icon = success ? '🔐' : '🚫';
    const status = success ? 'Success' : 'Failed';

    log[level](`${icon} Auth ${action} ${status}`, details);
  }

  logCrud(operation, entity, id, success = true, details = {}) {
    const level = success ? 'info' : 'error';
    const icon = success ? '✅' : '❌';
    const status = success ? 'Success' : 'Failed';

    log[level](`${icon} ${operation} ${entity} ${status}`, {
      id,
      ...details,
    });
  }

  sanitizeHeaders(headers) {
    const sanitized = { ...headers };
    const sensitiveKeys = ['authorization', 'x-api-key', 'cookie'];

    sensitiveKeys.forEach(key => {
      if (sanitized[key]) {
        sanitized[key] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  getLogFilePath() {
    return log.transports.file.getFile().path;
  }

  logAppEvent(event, details = {}) {
    log.info(`📱 App Event: ${event}`, details);
  }

  logUnhandledError(error, origin = 'unknown') {
    log.error(`� Unhandled Error from ${origin}`, {
      message: error.message,
      stack: error.stack,
      origin,
    });
  }
}

const logger = new Logger();

export default logger;
