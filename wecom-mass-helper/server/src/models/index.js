const sequelize = require('../config/database');
const MessageTemplate = require('./MessageTemplate');
const SendTask = require('./SendTask');
const TaskRecord = require('./TaskRecord');

SendTask.belongsTo(MessageTemplate, { foreignKey: 'templateId', as: 'template' });
MessageTemplate.hasMany(SendTask, { foreignKey: 'templateId', as: 'tasks' });

SendTask.hasMany(TaskRecord, { foreignKey: 'taskId', as: 'records' });
TaskRecord.belongsTo(SendTask, { foreignKey: 'taskId', as: 'task' });

module.exports = {
  sequelize,
  MessageTemplate,
  SendTask,
  TaskRecord,
};
