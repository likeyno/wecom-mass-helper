require('dotenv').config();

module.exports = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    name: process.env.DB_NAME || 'wecom_mass_helper',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  },

  wecom: {
    corpId: process.env.WECOM_CORP_ID || '',
    agentId: process.env.WECOM_AGENT_ID || '',
    secret: process.env.WECOM_SECRET || '',
    tokenUrl: process.env.WECOM_TOKEN_URL || 'https://qyapi.weixin.qq.com/cgi-bin/gettoken',
    uploadUrl: process.env.WECOM_UPLOAD_URL || 'https://qyapi.weixin.qq.com/cgi-bin/media/upload',
    sendUrl: process.env.WECOM_SEND_URL || 'https://qyapi.weixin.qq.com/cgi-bin/message/send',
  },

  system: {
    maxConcurrentTasks: parseInt(process.env.MAX_CONCURRENT_TASKS, 10) || 5,
    taskRetryMax: parseInt(process.env.TASK_RETRY_MAX, 10) || 3,
    taskRetryIntervalMs: parseInt(process.env.TASK_RETRY_INTERVAL_MS, 10) || 5000,
  },
};
