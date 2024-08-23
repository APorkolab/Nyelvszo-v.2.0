const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const controller = require('../base/controller')(User);

// Create
router.post('/', controller.create);

// Read
router.get('/', controller.findAll);
router.get('/:id', controller.findOne);

// Update
router.put('/:id', controller.replace);
router.patch('/:id', controller.update);

// Delete 
router.delete('/:id', controller.delete);

module.exports = router;