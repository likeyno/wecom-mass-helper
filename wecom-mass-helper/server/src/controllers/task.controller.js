const taskService = require('../services/task.service');

exports.create = async (req, res, next) => {
  try {
    const task = await taskService.createTask({
      ...req.body,
      creator: req.body.creator || 'system',
    });
    res.status(201).json({ code: 0, message: '任务创建成功', data: task });
  } catch (error) {
    next(error);
  }
};

exports.getList = async (req, res, next) => {
  try {
    const { status, creator, page, pageSize } = req.query;
    const result = await taskService.getTaskList({
      status: status !== undefined ? parseInt(status) : undefined,
      creator,
      page: page ? parseInt(page) : 1,
      pageSize: pageSize ? parseInt(pageSize) : 20,
    });
    res.json({ code: 0, data: result });
  } catch (error) {
    next(error);
  }
};

exports.getDetail = async (req, res, next) => {
  try {
    const task = await taskService.getTaskDetail(req.params.id);
    res.json({ code: 0, data: task });
  } catch (error) {
    next(error);
  }
};

exports.retry = async (req, res, next) => {
  try {
    const result = await taskService.retryFailedRecords(req.params.id);
    res.json({ code: 0, message: '重试完成', data: result });
  } catch (error) {
    next(error);
  }
};
