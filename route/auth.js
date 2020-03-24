/**
* 跟token有關的route
* URL /auth
*
*/

var express = require('express');
var models = require('../models/index')
var api = express.Router();
var uuid = require('uuid/v4');
var codes = require('../codedefine');
var moment = require('moment');
var jwt = require('jwt-simple');
var jwtSetting = require('../config/systemConf').jwtSetting;
var userCtrl = require('../Ctrl/userCtrl')


/**
* 取得token
* @method POST
* URL /token
*/
api.post('/token', function(req, res){

	userCtrl.authLogin(req.body.account, req.body.password, function(err, user){
		if(user == null){
			res.json({"CODE":codes.token.auth_error});
		}else{
			var refreshtoken = false;
			if(user.token){
				var decoded = jwt.decode(user.token, jwtSetting.jwtTokenScret);
				if(decoded.exp <= Date.now()){
					refreshtoken = true;
				}
			}else{
				refreshtoken = true;
			}
			if(refreshtoken){
				var expires = moment().add('days', 7).valueOf();
				var token = jwt.encode({
					isCLSsignature:jwtSetting.signature,
					iss: user.account,
					exp: expires
				}, jwtSetting.jwtTokenScret);
				
				user.update({
					token:token
				}).then(function(){});

				return res.json({token: token,expires:expires,user: user.account,"CODE":codes.token.auth_success});
			}
			var decoded = jwt.decode(user.token, jwtSetting.jwtTokenScret);
			return res.json({token: user.token,expires:decoded.exp,user: user.account,"CODE":codes.token.auth_success});
		}
	});
});
 

module.exports = api;
