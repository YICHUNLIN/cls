
var codes = require('../codedefine')
var jwt = require('jwt-simple');
var jwtSetting = require('./config').jwtSetting;



exports.adloginAuth = function(req, res, next){
	if(!req.cookies['vic-token'] || req.path.indexOf('ad') < 0){
		return next();
	}

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

