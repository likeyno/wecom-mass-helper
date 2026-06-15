const { MessageTemplate } = require('../models');

class TemplateService {
  async create(data) {
    return MessageTemplate.create(data);
  }

  async update(id, data) {
    const template = await MessageTemplate.findByPk(id);
    if (!template) {
      throw new Error('模板不存在');
    }
    return template.update(data);
  }

  async delete(id) {
    const template = await MessageTemplate.findByPk(id);
    if (!template) {
      throw new Error('模板不存在');
    }
    return template.destroy();
  }

  async getById(id) {
    const template = await MessageTemplate.findByPk(id);
    if (!template) {
      throw new Error('模板不存在');
    }
    return template;
  }

  async getList({ msgType, categoryId, keyword, page = 1, pageSize = 20 }) {
    const where = {};
    if (msgType) where.msgType = msgType;
    if (categoryId) where.categoryId = categoryId;
    if (keyword) {
      where.name = { [require('sequelize').Op.like]: `%${keyword}%` };
    }

    const { count, rows } = await MessageTemplate.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    return { total: count, page, pageSize, list: rows };
  }
}

module.exports = new TemplateService();
