const { Router } = require('express');
const taskController = require('../controllers/task.controller');

const router = Router();

router.post('/', taskController.create);
router.get('/', taskController.getList);
router.get('/:id', taskController.getDetail);
router.post('/:id/retry', taskController.retry);

module.exports = router;
