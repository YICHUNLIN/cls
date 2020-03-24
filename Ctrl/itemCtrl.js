/**
* 對於Project Item的操作
* @module ItemCtrl
*/
var ItemCtrl = ItemCtrl || {};
var models = require('../models/index')
var codes = require('../codedefine');

/**
* 確定同一個project bimid是否重複
*  
* @param {string} 	pid
* @param {string} 	bid
* @param {function} cb 	
*/
ItemCtrl.checkBidPid = (pid, bid, cb)=>{
	// 如果bid 是空的 就不考慮 bimid 重複問題 有可能是群組
	if(bid!= null || bid != ""){
		models.ProjectItem.findOne({
			where:{
				bimid:bid,
				belongproject:pid
			},
			attributes:['bimid','belongproject']
		}).then(function(result){
			cb(result);
		})

	}else{
		cb(false);
	}
};

/**
* 根據item id 取得 item
*  
* @param {string} 	iid
* @param {function} cb
*/
ItemCtrl.FindItem = (iid, cb)=>{
	models.ProjectItem.findOne({
		where:{
			id:iid
		},
		attributes:['id','belongproject','name','bimid']
	}).then(function(item){
		//console.log(item);
		cb(item);
	})
}

/**
* 取得某個project 的 items
*  
* @param {string} 	pid
* @param {function} cb
*/
ItemCtrl.AllItem = (pid, cb)=>{
	models.ProjectItem.findAll({
		where:{
			belongproject:pid
		},
		attributes:['id','belongproject','name','bimid','category']
	}).then(function(items){
		cb(items)
	});
}

module.exports = ItemCtrl;