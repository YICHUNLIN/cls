var models = require('../models/index');
var uuid = require('uuid/v4');
var codes = require('../codedefine')
var passwordHash = require('password-hash');

// 密碼加密
exports.encypt = function (account, password, salt){
	return passwordHash.generate(account+password+salt);
}


// 驗證密碼正確性
exports.authPassword = function (text, cyphertext, fn){
	if(!passwordHash.verify(text, cyphertext)){
		fn({"CODE":codes.login.passworderror},null);
	}else{
		fn(null,true)
	}
}

// user 是否存在
exports.checkUser = function (account,fn){
	models.User.findOne({
		where:{
			account:account
		}
	}).then(function(user){
		if(user){
			fn(null,user);
		}else{
			fn({"CODE":codes.login.usernotfound}, null);
		}
	})
}

