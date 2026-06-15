const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TaskRecord = sequelize.define('TaskRecord', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  taskId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    field: 'task_id',
    comment: '关联任务ID',
  },
  chatId: {
    type: DataTypes.STRING(64),
    allowNull: false,
    field: 'chat_id',
    comment: '企业微信群ID',
  },
  groupName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'group_name',
    comment: '群名称',
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
    comment: '发送状态：0-待发送, 1-成功, 2-失败',
    validate: {
      isIn: [[0, 1, 2]],
    },
  },
  errorMsg: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'error_msg',
    comment: '失败原因',
  },
  retryCount: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
    field: 'retry_count',
    comment: '已重试次数',
  },
  sentAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'sent_at',
    comment: '实际发送时间',
  },
}, {
  tableName: 'task_records',
  indexes: [
    { fields: ['task_id'] },
    { fields: ['status'] },
    { fields: ['chat_id'] },
  ],
});

module.exports = TaskRecord;
