var express = require('express');
var models = require('../models/index')
var router = express.Router();
var uuid = require('uuid/v4');
var codes = require('../codedefine')
// 好像沒有用到
/*
// get token
router.post('/auth/token', function(req, res){
	models.User.findOne({
			where:{
				// check account exist
				account:req.body.account,
				password:req.body.password
			}
		}).then(function(user){
			// if account not exist
			if(user == null){
				res.json({"CODE":codes.token.auth_error});
			}else{
				var token = uuid.v4();
				// 儲存 token
				user.update({token:token}).then(function(){});
//* 計算token 有效日期
//* token 放 session
				res.json({"token":token,"effective":"20173221933","CODE":codes.token.auth_success});
			}
		});
});
*/
/*
// login
router.post('/login', function(req,res){
//* 判斷 session 如果沒有登入 或是登入時間超過
	models.User.findOne({
			where:{
				account:req.body.account,
				password:req.body.password,
				token:req.body.token
			}
		}).then(function(user){
			if(user == null){
				res.json({"CODE":codes.login.usernotfound})
			}else{
//* user info 放進 session
				res.json({"CODE":codes.login.success})
			}
		});
});

// signup
router.post('/signup', function(req, res){
	console.log(req.body);
	//check  account duplecate
	models.User.findOne({
			where:{
				account:req.body.account
			}
		}).then(function(user){
			// 如果沒有找到 會回傳 null
			if(user == null){
				models.User.create({
					firstname: req.body.firstname,
					lastname: req.body.lastname,
					account:req.body.account,
//* 密碼要加密
					password:req.body.password,
					mobile:req.body.mobile,
					tel:req.body.tel,
					email:req.body.email,
					role:req.body.role,
					company_name:req.body.company_name,
					company_address:req.body.company_address,
					company_tel:req.body.company_tel,
					loginip:req.ip
				}).then(function(user) {
			    	res.json({"CODE":codes.signup.success});
			  	});
			}else{
				res.json({"CODE":codes.signup.duplicate});
			}
		});
});

// update user
router.post('/user/update', function(req, res){

});


*/

// create board
router.post('/board/create', function(req, res){
//* token
//* user
	var pid = uuid.v4();
//* create board
	models.Project.findOne({
		where:{
			identify:pid
		}
	}).then(function(project){
		if(project == null){
//* 如果沒有重複 就 create
			models.Project.create({
				identify:pid,
				name:req.body.pname,
				duration:0,
				startdate:null,
				estimateEndDate:null,
				actualEndDate:null,
				afterchangeDesignDate:null,
				increaseDuration:0,
				description:"texttext"
			}).then(function(project){
				res.json({"CODE":codes.boardcreate.success,"project":project});
			});
		}else{
//* 如果重複 不過應該不太會
			res.json({"CODE":code.boardcreate.duplicate});
		}
	});
//* user project relation (permission)
});

// update board 還沒好
router.post('/board/update', function(req, res){
//*  token 驗證
//*  判斷權限 是否有權限更新
	models.Project.findOne({
		where:{
			identify:req.body.pid
		}
	}).then(function(project){
		if(project != null){
			project.update({
				identify:req.body.pid,
				name:req.body.name,
				duration:req.body.duration,
				startdate:req.body.startdate,
				estimateEndDate:req.body.estimateEndDate,
				actualEndDate:req.body.actualEndDate,
				afterchangeDesignDate:req.body.afterchangeDesignDate,
				increaseDuration:req.body.increaseDuration,
				description:req.body.description
			}).then(function(project){
				res.json({"CODE":codes.boardcreate.success,"project":project});
			});
		}else{
			res.json({"CODE":codes.boardupdate.notfound});
		}
	});
});




// get boards by user
router.post('/boards', function(req, res){
//* token
//* user。從 projectmember 找出有參與的所有 project

//* return boards(project list)
});

// get id board
router.get('/board/:id', function(req, res){
//* token
//* board id  根據 project id ，回傳project
//* 防呆，要檢驗是否有參與project 
	//return board`s activitys(activitys of project)
});

// get id board`s checks 
router.post('/checks', function(req, res){

});

//get id check 
router.get('/check/:id', function(req, res){

});

// get commands by checkid
router.get('/commands/:checkid', function(req, res){

});


module.exports = router;