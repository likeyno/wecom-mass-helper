const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { port } = require('./config/env');
const { sequelize } = require('./models');
const templateRoutes = require('./routes/template.routes');
const taskRoutes = require('./routes/task.routes');
const errorHandler = require('./middleware/error-handler');
const { startScheduler } = require('./jobs/scheduler');
const logger = require('./utils/logger');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ code: 0, message: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/templates', templateRoutes);
app.use('/api/tasks', taskRoutes);

app.use(errorHandler);

async function start() {
  try {
    await sequelize.authenticate();
    logger.info('数据库连接成功');

    await sequelize.sync({ alter: true });
    logger.info('数据库表同步完成');

    startScheduler();

    app.listen(port, () => {
      logger.info(`服务器已启动，端口: ${port}`);
      console.log(`企业微信群发助手服务已启动: http://localhost:${port}`);
    });
  } catch (error) {
    logger.error('服务启动失败:', error);
    process.exit(1);
  }
}

start();
