/*
功能已被遷移
*/
var models = require('../models/index');
var codes = require('../codedefine')
var jwt = require('jwt-simple');
var jwtSetting = require('./config').jwtSetting;


var checkGroup = (group, account, fnc)=>{
	var isOK = false;
	models.UserofGroup.findAll({
			where:{
				user:account
			},
			attributes:['group', 'user'],
			raw:true
		}).then(function(result){
			for(var g in result){
				if(result[g].group == group){
					isOK = true;
					break;
				}
			}
			fnc(isOK);
		});
};

var checkUser = (account, fn)=>{
	models.User.findOne({
		where:{
			account:account
		}
	}).then(function(user){
		if(user){
	        if (decoded.exp <= Date.now()) { 
	          	fn({"CODE":codes.token.auth_expired});
	          	return;
	        }
	        if(user.token != token){
	        	fn({"CODE":codes.token.auth_tokenerror});
	          	return;
	        }
	        next();
		}else{
			fnres.json({"CODE":codes.token.usererror});
	         return;
		}
	});
}

exports.tokenAuth = function(req, res, next){
	
	//console.log("tokenAuth 11");
	if(req.path.indexOf('token') > 0 || req.path.indexOf('signup') > 0){
		return next();
	}

	//console.log("tokenAuth 22");
	// 如果是admin的東西
	if(req.path.indexOf('admin') > 0){
		// 驗證是否是admin 還沒做
		return next();
	}

	//console.log("tokenAuth 33");
    var token = req.headers['vic-token'];
    if(!token){
    	return res.json({"CODE":codes.token.auth_notAuth});
    }

	//console.log("tokenAuth 44");
	var decoded = jwt.decode(token, jwtSetting.jwtTokenScret);
	if(!decoded){
		return res.json({"CODE":codes.token.auth_notdecode});
	}

	//console.log("tokenAuth 55");
	var account = decoded.iss;
	if(!account){
		return res.json({"CODE":codes.token.auth_notaccount});
	}

	//console.log("tokenAuth 66");
	models.User.findOne({
		where:{
			account:account
		}
	}).then(function(user){
		if(user){
	        if (decoded.exp <= Date.now()) { 
	          return res.json({"CODE":codes.token.auth_expired});
	        }
	        if(user.token != token){
	        	return res.json({"CODE":codes.token.auth_tokenerror});
	        }
	        next();
		}else{
			return res.json({"CODE":codes.token.usererror});
		}
	});
}

// 驗證admin
exports.IdAuth = function(req, res, next){
	next();
}

