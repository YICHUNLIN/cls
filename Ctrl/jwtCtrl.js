
var jwt = require('jwt-simple');
var jwtSetting = require('../config/systemConf').jwtSetting;
var models = require('../models/index');
var codes = require('../codedefine')
var moment = require('moment');
var codes = require('../codedefine');


var jwtCtrl = jwtCtrl || {};


/*
*	verify token
*	@param {string} token
*	@param {string}	scope
* 	@param {function} success(code, decoded_result)
* 	@param {function} failed(code)
*/
jwtCtrl.verify = (token, scope, success, failed)=>{
	var decoded = jwt.decode(token, jwtSetting.jwtTokenScret);
	if(!decoded){
		failed(codes.token.auth_notdecode);
	}else{
		if(decoded.exp <= Date.now()){
			if(decoded.isCLSsignature === jwtSetting.signature){
				if(decoded.scope.includes(scope)){
					// 驗證成功
					success(auth_success, decoded);
				}else{
					// scope 錯誤
					failed(codes.token.auth_scopeerror);
				}
			}else{
				// 簽名錯誤
				failed(codes.token.auth_signatureError);
			}
		}else{
			// 時間錯誤
			failed(codes.token.auth_expired);
		}
	}
}

/**
*	generate token
*	@param {string} account
* 	@param {string} scope
*/
jwtCtrl.genToken = (account,scope)=>{
	return jwt.encode({
		isCLSsignature:jwtSetting.signature,
		iss: account,
		exp: moment().add('days', 7).valueOf(),
		scope: scope
	}, jwtSetting.jwtTokenScret);
}

/**
*	
*	確認是否有token欄位
*
*/
jwtCtrl.AuthHeader = (req, res, next)=>{
	var header = req.headers['vic-token'];
	if(!header){
		return res.json({CODE:codes.token.auth_notAuth});
	}else{
		return next();
	}


}

module.exports = jwtCtrl;