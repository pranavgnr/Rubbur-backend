const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.get('/getMain', controller.getMainBookData);
router.post('/postData', controller.postData);
router.post('/branchData', controller.viewBranchData);
router.post('/delete', controller.deleteData);
router.post('/update',controller.updateData);
module.exports = router;

