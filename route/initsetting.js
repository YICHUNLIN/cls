
var express = require('express');
var models = require('../models/index');
var setter = express.Router();
var codes = require('../codedefine');


setter.post('/init', function(req, res){
	

	models.Permission.bulkCreate([
			{permlevel:"",desctrption:""},
			{permlevel:"",desctrption:""},
			{permlevel:"",desctrption:""},
			{permlevel:"",desctrption:""},
			{permlevel:"",desctrption:""}
		]).then(function(result){
		res.json({"CODE":codes.items.multicreateSuccess, "count":result});
	});

});

module.exports = setter;