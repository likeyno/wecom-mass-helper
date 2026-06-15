const templateService = require('../services/template.service');

exports.create = async (req, res, next) => {
  try {
    const template = await templateService.create(req.body);
    res.status(201).json({ code: 0, message: '创建成功', data: template });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const template = await templateService.update(req.params.id, req.body);
    res.json({ code: 0, message: '更新成功', data: template });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await templateService.delete(req.params.id);
    res.json({ code: 0, message: '删除成功' });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const template = await templateService.getById(req.params.id);
    res.json({ code: 0, data: template });
  } catch (error) {
    next(error);
  }
};

exports.getList = async (req, res, next) => {
  try {
    const { msgType, categoryId, keyword, page, pageSize } = req.query;
    const result = await templateService.getList({
      msgType: msgType ? parseInt(msgType) : undefined,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      keyword,
      page: page ? parseInt(page) : 1,
      pageSize: pageSize ? parseInt(pageSize) : 20,
    });
    res.json({ code: 0, data: result });
  } catch (error) {
    next(error);
  }
};
