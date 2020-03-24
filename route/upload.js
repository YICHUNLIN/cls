var express = require('express');
var models = require('../models/index')
var api = express.Router();
var uuid = require('uuid/v4');
var codes = require('../codedefine');

var multer = require('multer');// upload
var path = require('path');
var UserByAccount = require('./projectauth').UserByAccount;
var checkUser = require('./userauth').checkUser;

var jwt = require('jwt-simple');
var jwtSetting = require('./config').jwtSetting;
var base64Img = require('base64-img');
	var fs = require('fs');
var userfolder = '/resource/user';
var projectfolder = '/resource/projects/'

/*

// 設定儲存
var storage = multer.diskStorage({
	destination: function (request, file, callback) {
		callback(null, './resource/user');
	},
	filename: function (request, file, callback) {
		console.log(file);
		callback(null, file.originalname)
	}
});
// 欄位擷取
var upload = multer({storage: storage}).single('photo');
*/

var ImageType = function(file){
	if(file.mimetype.match('image/jpeg') != null){
		return '.jpg';
	}else if(file.mimetype.match('image/png') != null){
		return '.png'
	}else{
		return null;
	}
};



// 上傳勘驗照片
api.post('/checkphotos',function(req, res){

	var token = req.headers['vic-token'];
	if(!token){
		return res.json({"CODE":codes.personal.notoken});
	}
	var decoded = jwt.decode(token, jwtSetting.jwtTokenScret);
	if(!decoded){
		return res.json({"CODE":codes.personal.decodeerror});
	}

	var filename = ""
	var projpath = projectfolder+req.body.pid+"/"
	var checkphotos = multer({storage:multer.diskStorage({
		destination: function(req, file, callback){
			callback(null, '.' + projpath);
		},
		filename: function(req, res, callback){
			callback(null,  projpath+filename+".png");	
		}
	})}).array('photos');

	checkphotos(req, res, function(err){
		if(err){
			res.json({"CODE":"xx"})
		}else{
			res.json({"CODE":"oo"})
		}
	});
});

// 上傳使用者照片
api.post('/userphoto',function(req, res){
	var token = req.headers['vic-token'];
	if(!token){
		return res.json({"CODE":codes.personal.notoken});
	}
	var decoded = jwt.decode(token, jwtSetting.jwtTokenScret);
	if(!decoded){
		return res.json({"CODE":codes.personal.decodeerror});
	}
	var account = decoded.iss;
	var fileurl = "";
	if(account){
		var userphoto = multer({storage: multer.diskStorage({
				destination: function(req, file, callback){
					callback(null, '.' + userfolder);
				},
				filename: function(req, file, callback){
					var filetype = ImageType(file);
					if(filetype){
						fileurl = userfolder+'/'+ account + filetype;
						callback(null,  account + filetype);	
					}else{
						callback(null, file.originalname);
					}
					
				}
			})}).single('photo');

		userphoto(req, res, function(err){
			if(err){
				res.json({"CODE":codes.personal.uploadfailed});
			}else{
				//寫入資料庫
				checkUser(account, function(err, user){
					if(user){
						user.update({
							photourl:fileurl
						}).then(function(response){
							res.json({"CODE":codes.personal.uploadphotosuccess, "photourl":fileurl});
						});
					}else{
						res.json({"CODE":codes.personal.nouser});
					}
				});
			}
		});
	}else{
		return res.json({"CODE":codes.personal.decodeNoaccount});
	}

});

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

// 將照片轉成 base64 傳到前面，在前端可以編碼編回照片，適用於ios傳輸使用
api.get('/userb64/:filename', function(req, res){
	Base64Img("./resource/user/"+req.params.filename, function(data){
		console.log(req.params.filename);
		res.json(data);
	})
});

//取得某個專案的某個檔案 還沒測試
api.get('/:projectid/:filename', function(req, res){
	res.download("./resource/projects/"+req.params.projectid+"/"+req.params.filename);
	/*Base64Img("./resource/projects/"+req.params.projectid+"/"+req.params.filename, function(data){
		res.json(data);
	})*/
});


// 測試
api.get('/download/:filename', function(req, res){
	console.log('./resource/user/'+req.params.filename);
	
	res.download('./resource/user/'+req.params.filename);
});

module.exports = api;