/**
* 跟 user 相關的 route
* URL /user
*
*/
var express = require('express');
var models = require('../models/index')
var api = express.Router();
var uuid = require('uuid/v4');
var codes = require('../codedefine');
var jwt = require('jwt-simple');
var jwtSetting = require('../config/systemConf').jwtSetting;
var userCtrl = require('../Ctrl/userCtrl');
var groupCtrl = require('../Ctrl/groupCtrl');


/**
*
* 一般登入
* @method POST
* URL /login
* 
*/
api.post('/login', function(req,res){

	groupCtrl.checkGroup("normal", req.body.account, function(isGroup){
		if(isGroup){
			userCtrl.dologin(req, (result)=>{
				res.json(result);
			});
		}else{
			res.json({"CODE":codes.login.permissionerror});
		}
	});
});

/**
*
* admin 登入
* @method POST
* URL /adlogin
* 
*/
api.post('/adlogin', function(req, res){
	groupCtrl.checkGroup("admin", req.body.account, function(isGroup){
		if(isGroup){
			userCtrl.dologin(req, (result)=>{
				res.json(result);
			});
		}else{
			res.json({"CODE":codes.login.permissionerror});
		}
	});
});

/**
*
* signup 新增user(一般使用者)
* @method POST
* URL /signup
* 
*/
api.post('/signup', function(req, res){

	groupCtrl.groupIsExist("normal", function(exist){
		userCtrl.doSignup(req, "normal", function(result){
			res.json(result);
		})
	}, function(notexist){
		res.json({"CODE":codes.signup.admingroupisnotexist});
	});
});

/**
*
* signup 新增 admin user
* @method POST
* URL /adsignup
* 
*/
api.post('/adsignup', function(req, res){
	groupCtrl.groupIsExist("admin", function(exist){
		userCtrl.doSignup(req, "admin", function(result){
			res.json(result);
		})
	}, function(notexist){
		res.json({"CODE":codes.signup.normalgroupisnotexist});
	});
})

// update user password , only his self 好像沒完成

/**
*
* 更新密碼
* @method POST
* URL /updatepwd
* 
*/
api.post('/updatepwd', function(req, res){
	var token = req.headers['vic-token'];
	if(!token){
		return res.json({"CODE":codes.userupdate.notoken});
	}
	//console.log("TTTTT");
	var decoded = jwt.decode(token, jwtSetting.jwtTokenScret);
	if(!decoded){
		return res.json({"CODE":codes.userupdate.nodecode});
	}
	//console.log("ooooo");
	var account = decoded.iss;
	if(!account){
		return res.json({"CODE":codes.userupdate.noaccount})
	}
	//console.log("xxxxxx");
	userCtrl.checkUser(account, function(err, user){
		if(user){
			// 產生一個新密碼
			var cypherPwd = encypt(user.account, req.body.password, user.salt);

			user.update({
				password:cypherPwd,
			}).then(function(result){
				return res.json({"CODE":codes.userupdate.passwordSuccess});
			});
		}else{
			return res.json({"CODE":codes.userupdate.nouser})
		}
	});

});

/**
*
* 取得 user的資料 根據 id
* @method POST
* URL /data
* 
*/
api.post('/data', function(req, res){
	userCtrl.checkUser(req.body.id, function(err, user){
		if(user == null){
			res.json({"CODE":codes.userfind.usernotfound});
		}else{
			res.json({"CODE":codes.userfind.success,
				"user":{
					"firstname":user.firstname,
					"lastname":user.lastname,
					"account":user.account,
					"mobile":user.mobile,
					"tel":user.tel,
					"email":user.email,
					"role":user.role,
					"company_name":user.company_name,
					"photourl":user.photourl
				}});
		}
	});
});

/**
*
* 登出 (似乎沒在用)
* @method POST
* URL /logout
* 
*/
api.post('/logout', function(req, res){
	if(req.body.user){
		userCtrl.checkUser(req.body.user, function(err, user){
			if(user){
				res.json({"CODE":codes.logout.logoutsuccess});
			}else{
				res.json({"CODE":codes.logout.logouterror});
			}
		});
	}else{
		res.json({"CODE":codes.logout.inputError});
	}
});

/**
*
* spin 釘版 將project 釘在板上 (似乎沒在用)
* @method POST
* URL /spin
* 
*/
api.post('/spin', function(req, res){
	// 本來是 if(req.body.isPin& req.body.pid && req.body.user)，但是isPin 如果是false 就無法執行
	if(req.body.pid && req.body.user){
		models.sequelize.
		query("update ProjectMembers set isPin = " +req.body.isPin+ " where project = '" + req.body.pid + "' and member = '" + req.body.user + "'")
		.then(function(data){
			if(data){
				res.json({"CODE":codes.projectmemberpin.success});
			}else{
				res.json({"CODE":codes.projectmemberpin.updateffailed});
			}
		});
	}else{
		res.json({"CODE":codes.projectmemberpin.inputError});
	}

});

/**
*
* 取得所有的使用者
* @method GET
* URL /all
* 
*/
api.get('/all', function(req, res){
	models.User.findAll({
		attributes:['account','email','firstname','lastname', 'loginip', 'role', 'lastlogintime']
	}).then(function(users){
		res.json({"CODE":codes.userfind.getallsuccess,"users":users})
	})
});

module.exports = api;