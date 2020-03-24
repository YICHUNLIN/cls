/*

http://ip:port/projectitem/
好像沒用到了
*/


var express = require('express');
var models = require('../models/index')
var api = express.Router();
var uuid = require('uuid/v4');
var codes = require('../codedefine');

var jwtSetting = require('./config').jwtSetting;
var jwt = require('jwt-simple');

// 產生 project item category 如 版梁柱牆
api.post('/createcategory', function(req, res){
	if(!(req.body.name && req.body.description)){
		// 回傳失敗
	}
	// check name exist
	models.ProjectitemCategory.create({
		name:req.body.name,
		description:req.body.description
	}).then(function(result){
		if(result){
			// 回傳成功
		}else{
			// 回傳失敗
		}
	});
});

// 產生 梁 需要被檢查的 "鋼筋 模板 混凝土..."
api.post('/checkCategory', function(req, res){
	// category id


});

// 產生 鋼筋需要被檢查的 "拉力 外觀 號數 間距 ..."
api.post('/checkCategoryType', function(req, res){

});


// 取得 project item categorys
api.get('/categorys', function(req, res){

});

//--------------------------------------|


// 新增 project 元件
api.post('/create', function(req, res){
	// pid
	// item

});

// 取得project 的元件
api.get('/items', function(req, res){
//pid

//return project itemss
});

module.exports = api;