/*
功能已被遷移
*/
var codes = require('../codedefine')
var jwt = require('jwt-simple');
var jwtSetting = require('./config').jwtSetting;



exports.loginAuth = function(req, res, next){
	if(req.path.indexOf('api') > 0 || req.path.indexOf('login') > 0 || req.path.indexOf('logout') > 0 || req.path.indexOf('ad') > 0){
		return next();
	}

	//console.log(req.cookies['vic-token'])
	var token = req.cookies['vic-token'];
	//var token = req.query.token;
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
}

exports.adloginAuth = function(req, res, next){
	console.log(req.path);
	console.log("adloginAuth1");
	if(req.path.indexOf('login') > 0 || req.path.indexOf('api') > 0){
		return next();
	}

	var token = req.cookies['vic-token'];
	console.log("adloginAuth2");
	console.log(token);
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

/*
	if(!token)
		return res.redirect('login');

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
*/

	
}