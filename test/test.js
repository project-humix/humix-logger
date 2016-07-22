var logger = require('../index').createLogger('logger', { consoleLevel: 'trace'});


logger.fatal('fatal');
logger.error('error');
logger.debug('debug');
logger.info('info');
logger.warn('warn');
logger.trace('trace');

var child = logger.child({loc: 'child'});
child.fatal('fatal');
child.error('error');
child.debug('debug');
child.info('info');
child.warn('warn');
child.trace('trace');
