const { Op } = require('sequelize');
const { SendTask, TaskRecord, MessageTemplate } = require('../models');
const wecomService = require('./wecom.service');
const { system } = require('../config/env');
const logger = require('../utils/logger');

class TaskService {
  constructor() {
    this.runningTasks = new Set();
  }

  async createTask(taskData) {
    const { taskName, templateId, groupIds, sendTime, creator } = taskData;

    const template = await MessageTemplate.findByPk(templateId);
    if (!template) {
      throw new Error('消息模板不存在');
    }

    const task = await SendTask.create({
      taskName,
      templateId,
      groupIds,
      sendTime: sendTime || null,
      status: sendTime ? 0 : 1,
      totalCount: groupIds.length,
      creator,
    });

    const records = groupIds.map(chatId => ({
      taskId: task.id,
      chatId,
      status: 0,
    }));
    await TaskRecord.bulkCreate(records);

    if (!sendTime) {
      this.executeTask(task.id).catch(err => {
        logger.error(`任务${task.id}执行失败:`, err.message);
      });
    }

    return task;
  }

  async executeTask(taskId) {
    if (this.runningTasks.has(taskId)) {
      logger.warn(`任务${taskId}正在执行中，跳过`);
      return;
    }

    this.runningTasks.add(taskId);

    try {
      const task = await SendTask.findByPk(taskId, {
        include: [{ model: MessageTemplate, as: 'template' }],
      });

      if (!task) {
        throw new Error(`任务${taskId}不存在`);
      }

      await task.update({ status: 1 });

      const records = await TaskRecord.findAll({
        where: { taskId, status: 0 },
      });

      let successCount = 0;
      let failCount = 0;

      for (const record of records) {
        try {
          await wecomService.sendToGroup(record.chatId, task.template);
          await record.update({
            status: 1,
            sentAt: new Date(),
          });
          successCount++;
          logger.info(`任务${taskId} -> 群${record.chatId} 发送成功`);
        } catch (error) {
          await record.update({
            status: 2,
            errorMsg: error.message,
          });
          failCount++;
          logger.error(`任务${taskId} -> 群${record.chatId} 发送失败: ${error.message}`);
        }
      }

      let finalStatus = 2;
      if (successCount > 0 && failCount > 0) {
        finalStatus = 3;
      } else if (failCount > 0 && successCount === 0) {
        finalStatus = 4;
      }

      await task.update({
        status: finalStatus,
        successCount,
        failCount,
        completedAt: new Date(),
      });

      logger.info(`任务${taskId}执行完成, 状态: ${finalStatus}, 成功: ${successCount}, 失败: ${failCount}`);
    } catch (error) {
      logger.error(`执行任务${taskId}出错:`, error.message);
      await SendTask.update(
        { status: 4 },
        { where: { id: taskId } }
      );
    } finally {
      this.runningTasks.delete(taskId);
    }
  }

  async retryFailedRecords(taskId) {
    const task = await SendTask.findByPk(taskId);
    if (!task) {
      throw new Error('任务不存在');
    }

    const failedRecords = await TaskRecord.findAll({
      where: {
        taskId,
        status: 2,
        retryCount: { [Op.lt]: system.taskRetryMax },
      },
    });

    if (failedRecords.length === 0) {
      return { message: '没有需要重试的记录' };
    }

    const template = await MessageTemplate.findByPk(task.templateId);
    let successCount = 0;

    for (const record of failedRecords) {
      try {
        await wecomService.sendToGroup(record.chatId, template);
        await record.update({
          status: 1,
          errorMsg: null,
          sentAt: new Date(),
          retryCount: record.retryCount + 1,
        });
        successCount++;
      } catch (error) {
        await record.update({
          retryCount: record.retryCount + 1,
          errorMsg: error.message,
        });
      }
    }

    const remaining = await TaskRecord.count({ where: { taskId, status: 2 } });
    const totalSuccess = await TaskRecord.count({ where: { taskId, status: 1 } });
    const total = await TaskRecord.count({ where: { taskId } });

    let newStatus = 2;
    if (totalSuccess > 0 && remaining > 0) {
      newStatus = 3;
    } else if (remaining > 0 && totalSuccess === 0) {
      newStatus = 4;
    }

    await task.update({
      status: newStatus,
      successCount: totalSuccess,
      failCount: remaining,
    });

    return {
      retried: failedRecords.length,
      successCount,
      remaining,
      taskStatus: newStatus,
    };
  }

  async getTaskList({ status, creator, page = 1, pageSize = 20 }) {
    const where = {};
    if (status !== undefined && status !== null) where.status = status;
    if (creator) where.creator = creator;

    const { count, rows } = await SendTask.findAndCountAll({
      where,
      include: [{ model: MessageTemplate, as: 'template', attributes: ['id', 'name', 'msgType'] }],
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    return {
      total: count,
      page,
      pageSize,
      list: rows,
    };
  }

  async getTaskDetail(taskId) {
    const task = await SendTask.findByPk(taskId, {
      include: [
        { model: MessageTemplate, as: 'template' },
        { model: TaskRecord, as: 'records' },
      ],
    });

    if (!task) {
      throw new Error('任务不存在');
    }

    return task;
  }
}

module.exports = new TaskService();
