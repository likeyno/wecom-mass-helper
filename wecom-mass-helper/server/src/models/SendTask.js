const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SendTask = sequelize.define('SendTask', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  taskName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'task_name',
    comment: '任务名称',
  },
  templateId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    field: 'template_id',
    comment: '关联模板ID',
  },
  groupIds: {
    type: DataTypes.JSON,
    allowNull: false,
    field: 'group_ids',
    comment: '目标群ID列表',
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
    comment: '状态：0-待发送, 1-发送中, 2-已完成, 3-部分失败, 4-失败',
    validate: {
      isIn: [[0, 1, 2, 3, 4]],
    },
  },
  sendTime: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'send_time',
    comment: '定时发送时间（NULL为立即发送）',
  },
  totalCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'total_count',
    comment: '目标群总数',
  },
  successCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'success_count',
    comment: '发送成功数',
  },
  failCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'fail_count',
    comment: '发送失败数',
  },
  creator: {
    type: DataTypes.STRING(64),
    allowNull: true,
    comment: '创建人',
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'completed_at',
    comment: '完成时间',
  },
}, {
  tableName: 'send_tasks',
  indexes: [
    { fields: ['status'] },
    { fields: ['send_time'] },
    { fields: ['creator'] },
    { fields: ['template_id'] },
  ],
});

module.exports = SendTask;
