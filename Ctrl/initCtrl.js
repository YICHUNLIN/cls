
/**
* 對於第一次使用這個app
* @module initCtrl
*/
var initCtrl = initCtrl || {};
var fs = require('fs');
var models = require('../models/index');
var UserCtrl = require('./userCtrl');

/**
*	初始化 permission
*
*/
initCtrl.permissionInit = (cb)=>{
	models.Permission.bulkCreate([
		{permlevel:"level4",desctrption:"owner,project,check,command,Read"},
		{permlevel:"level3",desctrption:"project,check,command,Read"},
		{permlevel:"level2",desctrption:"check,command,Read"},
		{permlevel:"level1",desctrption:"command,Read"},
		{permlevel:"level0",desctrption:"Read"}
	]).then(function(result){
		cb(result);
	});
};

/**
*	初始化群組
*	
*
*/
initCtrl.groupInit = (cb)=>{
	console.log("init group")
	models.UGroup.bulkCreate([
		{name:"normal"},
		{name:"admin"}
	]).then(function(result){
		cb(result)
	})
};

/**
*	新增一個admin
*
*
**/
initCtrl.adminAccount = (cb)=>{
	var adminInfo = {
		body:{
			"firstname": "Lin",
			"lastname": "John",
			"account":"admin1234",
			"password":"admin1234",
			"mobile":"0912345678",
			"tel":"02345678",
			"email":"ccxx@gmail.com",
			"role":"Engineer",
			"company_name":"Taipei CC",
			"company_address":"Taipei",
			"company_tel":"02345678",
			"loginip":"127.0.0.1"
		}
	}
	UserCtrl.doSignup(adminInfo,"admin",(result)=>{
		cb(result);
	})
};

/**
*	新增一個normal user
*
*
**/
initCtrl.normalAccount = (cb)=>{
	var adminInfo = {
		body:{
			"firstname": "Lin",
			"lastname": "John",
			"account":"vic1234",
			"password":"vic1234",
			"mobile":"0912345678",
			"tel":"02345678",
			"email":"ccxx@gmail.com",
			"role":"Engineer",
			"company_name":"Taipei CC",
			"company_address":"Taipei",
			"company_tel":"02345678",
			"loginip":"127.0.0.1"
		}
	}
	UserCtrl.doSignup(adminInfo,"normal",(result)=>{
		cb(result);
	})
};

/*
*	初始化勘驗template
*
*
*/
initCtrl.checkcategory = (cb)=>{

	models.CheckCategory.bulkCreate([
		{name:"模板",category:""},
		{name:"混凝土",category:""},
		{name:"鋼筋",category:""},
	]).then(function(result){
		models.CheckCategoryTypes.bulkCreate([
			{name:"保護層厚度",belongcheckcategory:"模板"},
			{name:"外觀品質",belongcheckcategory:"模板"},
			{name:"樣式",belongcheckcategory:"模板"},
			{name:"支撐",belongcheckcategory:"模板"},
			{name:"搗實過程",belongcheckcategory:"混凝土"},
			{name:"澆置過程",belongcheckcategory:"混凝土"},
			{name:"現場坍流度",belongcheckcategory:"混凝土"},
			{name:"現場澆置情形",belongcheckcategory:"混凝土"},
			{name:"現場粒料情形",belongcheckcategory:"混凝土"},
			{name:"現場試體製作",belongcheckcategory:"混凝土"},
			{name:"養護",belongcheckcategory:"混凝土"},
			{name:"混凝土試體試驗",belongcheckcategory:"混凝土"},
			{name:"圍束區",belongcheckcategory:"鋼筋"},
			{name:"外觀",belongcheckcategory:"鋼筋"},
			{name:"搭接位置",belongcheckcategory:"鋼筋"},
			{name:"號數",belongcheckcategory:"鋼筋"},
			{name:"間距",belongcheckcategory:"鋼筋"},
			{name:"數量",belongcheckcategory:"鋼筋"},
			{name:"彎勾",belongcheckcategory:"鋼筋"},
		]).then(function(result){
			cb(result);
		});
	});
};

initCtrl.isFirstInApp = (cb)=>{

};
module.exports = initCtrl;
