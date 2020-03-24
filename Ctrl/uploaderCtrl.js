/**
*
* @module UploaderCtrl
*/

var UploaderCtrl = UploaderCtrl || {};

var base64Img = require('base64-img');
var fs = require('fs');
var models = require('../models/index')
var codes = require('../codedefine');

/**
*
* jpg 轉 base64
* @param {string} 	filename
* @param {function} cb		  
*/
UploaderCtrl.Base64Img = (filename, cb)=>{
	if (fs.existsSync(filename)) {

		base64Img.base64(filename, function(err, data) {
			if(err){
				cb({"CODE": codes.checkItemPicture.Translateerror, "data":null});
			}else{
				//console.log(data);
	    		cb({"CODE":codes.checkItemPicture.success, "data":data});
			}
		});
	}else{
		cb( {"CODE":codes.checkItemPicture.notExist, "data":null});
	}
}

module.exports = UploaderCtrl;

