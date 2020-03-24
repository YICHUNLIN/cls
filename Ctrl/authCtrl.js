/**
* 對於Auth的操作 大部分是middleware
* @module AuthCtrl
*/

var AuthCtrl = AuthCtrl || {};

var models = require('../models/index');
var codes = require('../codedefine')
var jwt = require('jwt-simple');
var jwtSetting = require('../config/systemConf').jwtSetting;

/**
* 驗證token
* 
* @param {json} 	req
* @param {json} 	res
* @param {callback} next 	callback function
* @return {json}
* 		
*/
AuthCtrl.tokenAuth = (req, res, next)=>{
	//console.log("tokenAuth 11");
	if(req.path.indexOf('token') > 0 || req.path.indexOf('signup') > 0){
		return next();
	}
	// 如果是admin的東西
	if(req.path.indexOf('admin') > 0){
		// 驗證是否是admin 還沒做
		return next();
	}
    var token = req.headers['vic-token'];
    if(!token){
    	return res.json({"CODE":codes.token.auth_notAuth});
    }
	var decoded = jwt.decode(token, jwtSetting.jwtTokenScret);
	if(!decoded){
		return res.json({"CODE":codes.token.auth_notdecode});
	}
	var account = decoded.iss;
	if(!account){
		return res.json({"CODE":codes.token.auth_notaccount});
	}
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
};

/**
* 驗證login(一般使用者用) 用於判斷是否登入
* 
* @param {json} 	req
* @param {json} 	res
* @param {callback} next 	callback function
*/
AuthCtrl.loginAuth = (req, res, next)=>{
	if(req.path.indexOf('api') > 0 || req.path.indexOf('login') > 0 || req.path.indexOf('logout') > 0 || req.path.indexOf('ad') > 0){
		return next();
	}
	var token = req.cookies['vic-token'];
	if(!token) return res.redirect('login');

	try{
		var decoded = jwt.decode(token, jwtSetting.jwtTokenScret);
		if(!decoded){
			return res.redirect('login');
		}
		if(decoded.isCLSsignature != jwtSetting.signature){
			return res.redirect('login');
		}
		next();
	}catch(e){
		return res.redirect('login');
	}
};

/**
* 驗證login(admin用)
* 
* @param {json} 	req
* @param {json} 	res
* @param {callback} next 	callback function
*/
AuthCtrl.adloginAuth = (req,res,next)=>{
	if(req.path.indexOf('login') > 0 || req.path.indexOf('api') > 0){
		return next();
	}

	var token = req.cookies['vic-token'];
	if(!token){
		return res.redirect('login');
	}
	try{
		var decoded = jwt.decode(token, jwtSetting.jwtTokenScret);
		if(!decoded){
			return res.redirect('login');
		}
		if(decoded.isCLSsignature != jwtSetting.signature){
			return res.redirect('login');
		}
		next();
	}catch(e){
		return res.redirect('login');
	}
}

module.exports = AuthCtrl;