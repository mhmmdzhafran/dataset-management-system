var express = require('express');
var router = express.Router();
const {detailedTask} = require('../app/api/all-task');

router.get('/detail_task/:id', detailedTask);
  
module.exports = router;