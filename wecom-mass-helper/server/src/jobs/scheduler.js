const cron = require('node-cron');
const { Op } = require('sequelize');
const { SendTask } = require('../models');
const taskService = require('../services/task.service');
const logger = require('../utils/logger');

function startScheduler() {
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const tasks = await SendTask.findAll({
        where: {
          status: 0,
          sendTime: {
            [Op.lte]: now,
          },
        },
      });

      for (const task of tasks) {
        logger.info(`调度器触发任务执行: ${task.id}`);
        taskService.executeTask(task.id).catch(err => {
          logger.error(`调度任务${task.id}执行失败:`, err.message);
        });
      }
    } catch (error) {
      logger.error('定时任务调度出错:', error.message);
    }
  });

  logger.info('定时任务调度器已启动');
}

module.exports = { startScheduler };
