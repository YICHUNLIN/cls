/**
* 跟Project Item有關的route
* URL /items
*/
var express = require('express');
var models = require('../models/index')
var api = express.Router();
var uuid = require('uuid/v4');
var codes = require('../codedefine');
var ItemCtrl = require('../Ctrl/itemCtrl');
var ProjectCtrl = require('../Ctrl/projectCtrl');

/**
* @method POST
* 新增一個 item
* URL /create
*/
api.post('/create', function(req, res){
	if(req.body.pid){
		//確定project存在
		ProjectCtrl.ProjectBypid(req.body.pid, function(proj){
			if(proj){
				//確定沒重複 或是可不可以建立新元件
				ItemCtrl.checkBidPid(proj.identify, req.body.bimid, function(checkResult){
					if(checkResult){
						res.json({"CODE":codes.items.duplicate});
					}else{
						// 確定 parent存在
						ItemCtrl.FindItem(req.body.parent, function(parentitem){
							var parentid = null;
							if(parentitem){
								parentid = parentitem.id;
								if(proj.identify != parentitem.belongproject){
									return res.json({"CODE":"child & parent not same project"})
								}
							}

							models.ProjectItem.create({
								name:req.body.name,
								belongproject:proj.identify,
								parentlevel:parentid,
								ProjectitemCategories:req.body.category,
								bimid:req.body.bimid
							}).then(function(result){
								res.json({"CODE":codes.items.createSuccess,"data":result});
							});
						});
						
					}
				});
				
			}else{
				res.json({"CODE":codes.items.piderr});
			}
		});
	}else{
		// 沒有 pid
		res.json({"CODE":codes.items.nopid});
	}
});

/**
* @method POST
* 批次新增 item
* URL /createManyItems
*/
api.post('/createManyItems', function(req, res){
	/*
		datas:[{d1},{d2},{d3},...,{dn}]
	*/

	if(req.body.pid && req.body.datas){
		var datas = JSON.parse(req.body.datas);
		console.log(datas);
		ProjectCtrl.ProjectBypid(req.body.pid, function(proj){
			if(proj){
				for(var idx in datas){
					datas[idx]["belongproject"] = req.body.pid;
				}
				models.ProjectItem.bulkCreate(datas).then(function(result){
					res.json({"CODE":codes.items.multicreateSuccess, "count":result});
				});
				//res.json({"CODE":codes.items.multicreateSuccess});
			}else{
				res.json({"CODE":codes.items.piderr});
			}
		});
	}else{

		res.json({"CODE":codes.items.nopidordatas});
	}
});

/**
* @method POST
* 刪除 item
* URL /destroy
*/
api.post('/destroy', function(req, res){
	if(req.body.iid){
		ItemCtrl.FindItem(req.body.iid, function(item){
			if(item){
				models.ProjectItem.destroy({
					where:{
						id:item.id
					}
				}).then(function(result){
					res.json({"CODE":codes.items.deleteSuccess});
				})
			}else{
				res.json({"CODE":codes.items.notfounditem})
			}
		});
	}else{
		res.json({"CODE":codes.items.nopid});
	}
})

/**
* @method POST
* 簡單更新 item name, bimid
* URL /updatesample
*/
api.post('/updatesample', function(req, res){
	if(!req.body.id){
		return res.json({"CODE":"not found item id"});
	}
	ItemCtrl.FindItem(req.body.id, function(item){
		//有找到
		if(item){
			item.update({
				name:req.body.name,
				bimid:req.body.bimid
			}).then(function(result){
				res.json({"CODE":"item update success","data":result});
			});
		}else{
			res.json({"CODE":"not found item"})
		}
	})
});

/**
* @method POST
* 進階更新 item name, parent, bimid
* URL /updateAdvanced
*/
api.post('/updateAdvanced', function(req, res){
	if(!req.body.id){
		return res.json({"CODE":"not item id"});
	}
	if(!req.body.parent){
		return res.json({"CODE":"not parent id"});
	}
	ItemCtrl.FindItem(req.body.id, function(item){
		//有找到
		if(item){
			ItemCtrl.FindItem(req.body.parent, function(parent){
				if(parent){
					if(item.belongproject != parent.belongproject){
						return res.json({"CODE":"child & parent not same project"})
					}
					item.update({
						name:req.body.name,
						parentlevel:parent.id,
						bimid:req.body.bimid
					}).then(function(result){
						res.json({"CODE":"item update success","data":result});
					});

				}else{
					res.json({"CODE":"not found parent"})
				}
			})
		}else{
			res.json({"CODE":"not found item"})
		}
	})

})

/**
* @method POST
* 取得所有沒有parent的 元件 未完成
* URL /parentItems
*/
api.post('/parentItems', function(req, res){
	ProjectCtrl.ProjectBypid(req.body.pid, function(proj){
		if(proj){
			models.ProjectItem.findAll({
				attributes:['id','name','bimid','wbs','parentlevel','describe'],
				where:{
					parentlevel:null,
					belongproject:proj.identify
				}
			}).then(function(its){
				if(its){
					res.json({"CODE":codes.items.getsuccess, "data":its})
				}else{
					res.json({"CODE":codes.items.empty});
				}
			});
		}else{
			res.json({"CODE":codes.items.nopid});
		}
	});
});

/**
* @method POST
* 取得所有 project 的元件
* URL /api/item/all
*/
api.post('/all', function(req, res){
	ProjectCtrl.ProjectBypid(req.body.pid, function(proj){
		if(proj){
			models.ProjectItem.findAll({
				where:{
					belongproject:proj.identify
				},
				attributes:['id','name','bimid','wbs','parentlevel','describe', 'CenterX', 'CenterY', 'R']
			}).then(function(its){
				if(its){
					res.json({"CODE":codes.items.getsuccess, "data":its})
				}else{
					res.json({"CODE":codes.items.empty});
				}
			});
		}else{
			res.json({"CODE":codes.items.nopid});
		}
	});
});

/**
* @method POST
* 確定Project Item是否存在
* URL /api/item/exist
*/
api.post('/exist', function(req, res){
	ProjectCtrl.ProjectBypid(req.body.pid, function(proj){
		if(proj){
			models.ProjectItem.findOne({
				where:{
					belongproject:proj.identify,
					bimid:req.body.bimid
				},
				attributes:['id','name','bimid','wbs','parentlevel','describe', 'CenterX', 'CenterY', 'R']
			}).then(function(its){
				console.log(its)
				if(its){
					res.json({"CODE":codes.items.getsuccess, "data":its})
				}else{
					res.json({"CODE":codes.items.notExist});
				}
			});
		}else{
			res.json({"CODE":codes.items.notExist});
		}
	});
});

module.exports = api;