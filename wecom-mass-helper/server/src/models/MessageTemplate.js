const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MessageTemplate = sequelize.define('MessageTemplate', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '模板名称',
  },
  msgType: {
    type: DataTypes.TINYINT,
    allowNull: false,
    field: 'msg_type',
    comment: '消息类型：1-文本, 2-图文, 3-文件',
    validate: {
      isIn: [[1, 2, 3]],
    },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '文本内容（文本消息时使用）',
  },
  mediaIds: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'media_ids',
    comment: '素材 media_id 列表',
    defaultValue: [],
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: true,
    comment: '图文标题',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '图文描述',
  },
  fileUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'file_url',
    comment: '文件URL',
  },
  fileName: {
    type: DataTypes.STRING(200),
    allowNull: true,
    field: 'file_name',
    comment: '文件名',
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'category_id',
    comment: '分类ID',
  },
  createdBy: {
    type: DataTypes.STRING(64),
    allowNull: true,
    field: 'created_by',
    comment: '创建人',
  },
}, {
  tableName: 'message_templates',
  indexes: [
    { fields: ['msg_type'] },
    { fields: ['category_id'] },
    { fields: ['created_by'] },
  ],
});

module.exports = MessageTemplate;
