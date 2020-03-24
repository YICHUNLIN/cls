
var multer = require('multer');// upload
var models = require('../models/index')
var path = require('path');
var jwt = require('jwt-simple');
var jwtSetting = require('./config').jwtSetting;
var base64Img = require('base64-img');
var fs = require('fs');
var userfolder = '/resource/user';
var projectfolder = '/resource/projects/'

var ImageType = function(file){
	if(file.mimetype.match('image/jpeg') != null){
		return '.jpg';
	}else if(file.mimetype.match('image/png') != null){
		return '.png'
	}else{
		return null;
	}
};

// 圖片轉換
var Base64Img = function(filename, fn){
	if (fs.existsSync(filename)) {

		base64Img.base64(filename, function(err, data) {
			if(err){
				console.log("err");

				fn({"CODE": "Translate error", "data":null});
			}else{
				//console.log(data);
	    		fn({"CODE":"file ", "data":data});
			}
		});
	}else{
		fn( {"CODE":"file not exist", "data":null});
	}
}

