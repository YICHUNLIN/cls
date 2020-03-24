// 測試的

var express = require('express');
var models = require('../models/index')
var api = express.Router();


api.post('/user/check', function(req, res){
	models.User.findOne({
		where:{
			account:req.body.account,
			password:req.body.password
		}
	}).then(function(user){
		if(user == null){
			res.json({"UCODE":"UC001"});
		}else{
			res.json({"UCODE":"UC002"});
		}
	});
});
