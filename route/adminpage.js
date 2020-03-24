var express = require('express');
var router = express.Router();


router.post('/ori', (req, res, next)=>{
	res.render('admin');
});

router.get('/login', (req, res, next)=>{
	res.render('admin_login');
})


router.get('/main', (req, res, next)=>{
	res.render('adminMain');
})
module.exports = router;
