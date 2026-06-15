const { Router } = require('express');
const templateController = require('../controllers/template.controller');

const router = Router();

router.post('/', templateController.create);
router.put('/:id', templateController.update);
router.delete('/:id', templateController.delete);
router.get('/:id', templateController.getById);
router.get('/', templateController.getList);

module.exports = router;
