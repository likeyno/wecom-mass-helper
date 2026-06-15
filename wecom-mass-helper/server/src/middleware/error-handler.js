const logger = require('../utils/logger');

function errorHandler(err, req, res, _next) {
  logger.error('请求处理错误:', {
    method: req.method,
    url: req.url,
    message: err.message,
    stack: err.stack,
  });

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      code: 400,
      message: '数据验证失败',
      errors: err.errors.map(e => e.message),
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      code: 409,
      message: '数据已存在',
    });
  }

  res.status(err.status || 500).json({
    code: err.status || 500,
    message: err.message || '服务器内部错误',
  });
}

module.exports = errorHandler;
