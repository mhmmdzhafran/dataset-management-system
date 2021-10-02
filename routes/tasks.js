var express = require('express');
var router = express.Router();
const {index, viewCreate, actionCreate, actionEdit, actionDelete, actionRevoked, indexDashboard, viewEdit, viewDetail, detailTask, bookedTask} = require('../app/Controller/TasksController');
const {isLoggedIn} = require('../app/Middleware/auth');
const multer = require('multer');
const os = require('os');

router.use(isLoggedIn);
router.get('/', index);
router.get('/dashboard', indexDashboard);
router.get('/create-task', viewCreate);
router.post('/create-task', multer({dest: os.tmpdir()}).single('file_name') , actionCreate);
router.get('/edit/:id', viewEdit);
router.get('/detail/:id', viewDetail);
router.get('/dashboard/detail-task/:id', detailTask);
router.put('/update/:id', multer({dest: os.tmpdir()}).single('file_name') , actionEdit);
router.put('/book/:id', bookedTask);
router.put('/update-booking/:id', actionRevoked);
router.delete('/delete/:id', actionDelete);
  
module.exports = router;