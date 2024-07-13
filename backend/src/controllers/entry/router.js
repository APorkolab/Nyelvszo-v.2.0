const express = require('express');
const router = express.Router();
const Entry = require('../../models/entry');
const controller = require('../base/controller')(Entry);

// Create
router.post('/', controller.create);

// Read
router.get('/', controller.findAll);
router.get('/:id', controller.findOne);

// Update
router.put('/:id', controller.update);
router.patch('/:id', controller.update);

// Delete 
router.delete('/:id', controller.delete);

module.exports = router;