var logger = require('../index').createLogger('logger', { consoleLevel: 'trace'});


logger.error('test');
logger.debug('debug');
logger.info('info');
logger.warn('warn');
logger.trace('trace');
