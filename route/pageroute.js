var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next){
	res.render('login');
});

router.get('/login', function(req, res, next){
	res.render('login');
});

//for projects board
router.get('/board', function(req, res, next){
	//check login
	//if not login , go to login
	//console.log(req.session);
	res.render('board');
});

router.get('/project', function(req, res, next){
	res.render('aproject');
});

router.get('/itemchecks', function(req, res, next){
	res.render('itemchecks');
});

router.get('/maptest', function(req, res, next){
	res.render('maptest');
});

router.get('/userprofile', function(req, res, next){

});
/*
router.get('/ad', (req, res, next)=>{
	res.render('admin');
});
*/
router.get('/timeline', (req, res, next)=>{
	res.render('timeline');
});

router.get('/personal', (req, res, nest)=>{
	res.render('personal')
});

router.get('/forge', (req, res, next)=>{
	res.render('forge');
})


module.exports = router;
