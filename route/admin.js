/**
*
* 跟admin有關的route
* URL /admin
*
*/

var express = require('express');
var models = require('../models/index');
var admin = express.Router();
var codes = require('../codedefine');
var PermissionCtrl = require('../Ctrl/permissionCtrl')
var GroupCtrl = require('../Ctrl/groupCtrl')
var UserCtrl = require('../Ctrl/userCtrl')
/*-----------------------permission--start-------------------------*/
// find
function checkPermission(level, fn){
	models.Permission.findOne({
		where:{
			permlevel:level
		}
	}).then(function(permission){
		fn(permission);
	});
};

/**
* method POST
* permission create
* URL /permission/create
*
*/
admin.post('/permission/create',GroupCtrl.isAdmin, function(req, res){
	
	PermissionCtrl.getPermission(req.body.level, function(permission){
		if(permission == null){
			models.Permission.create({
					permlevel:req.body.level,
					desctrption:req.body.content
				}).then(function(permission){
					res.json({"CODE":codes.permissioncreate.success, "obj":permission});
				});
		}else{
			res.json({"CODE":codes.permissioncreate.duplicate});
		}
	});
});

/**
* method POST
* permission delete
* URL /permission/delete
*
*/
admin.post('/permission/delete', function(req, res){

	models.Permission.destroy({
		where:{
			permlevel:req.body.level
		}
	}).then(function(permission){
		if(permission == 0){
			res.json({"CODE":codes.permissiondestroy.failed});
			
		}else{
			res.json({"CODE":codes.permissiondestroy.success});
		}
	});

});

/**
* method POST
* permission update
* URL /permission/update
*
*/
admin.post('/permission/update', function(req, res){
//* token
//* 權限判斷
	PermissionCtrl.getPermission(req.body.level, function(permission){
		if(permission == null){
			res.json({"CODE":codes.permissionupdate.failed});
		}else{
			permission.update({
				desctrption:req.body.content
			}).then(function(permission){
				res.json({"CODE":codes.permissionupdate.success,"obj":permission});
			});
		}
	});
});

/**
* method GET
* get permissions
* URL /permissions
*
*/
admin.get('/permissions', function(req, res){
	models.Permission.findAll().then(function(permissions) {
		if(permissions.length > 0)
			res.json({"CODE":codes.permissiongetall.success,"obj":permissions});
		else
			res.json({"CODE":codes.permissiongetall.empty});
	});
});

/*-----------------------permission--end-------------------------*/
/*-----------------------group--start-------------------------*/

// 確定group 是否存在
function checkGroup(name, success, failed){
	models.UGroup.findOne({where:{name:name}}).then(function(result){
		if(result){
			success(result);
		}else{
			failed(result);
		}
	})
};

/**
* method POST
* create group
* URL /group/create
*
*/
admin.post('/group/create', function(req, res){
	if(!req.body.gname){
		//  如果body 沒有東西
		return res.json({"CODE":codes.ugroup.bodydonthavegname});
	}

	GroupCtrl.groupIsExist(req.body.gname, function(exist){
		// 如果存在
		return res.json({"CODE":codes.ugroup.duplicategroup});
	},function(notexist){
		//如果不存在
		models.UGroup.create({
			name:req.body.gname
		}).then(function(result){
			return res.json({"CODE":codes.ugroup.createsuccess, "result":result});
		});
	});
});

/**
* method GET
* get all groups
* URL /groups
*
*/
admin.get('/groups', function(req, res){
	models.UGroup.findAll({
	}).then(function(groups){
		if(groups.length > 0){
			return res.json({"CODE":codes.ugroup.findsuccess, "groups":groups});
		}else{
			return res.json({"CODE":codes.ugroup.findNothing});
		}
	});
});

// 確認user 是否存在
function checkUser(account, success, failed){
	models.User.findOne({where:{account:account}}).then(function(result){
		if(result){
			success(result);
		}else{
			failed(result);
		}
	})
}
/**
* @method POST
* 新增user 到 group
* URL /group/setuser
*
*/
admin.post('/group/setuser', function(req, res){
	if(!req.body.gname || !req.body.account){
		return res.json({"CODE":codes.ugroup.bodyerror});
	}
	GroupCtrl.groupIsExist(req.body.gname, function(group){
		// 如果group 存在
		UserCtrl._checkUser(req.body.account,function(user){
			GroupCtrl.checkUserofGroup(req.body.account, req.body.gname, function(duplicate){
				return res.json({"CODE":codes.ugroup.usergroupduplicate});
			},function(succ){
				//如果userof 沒有重複
				models.UserofGroup.create({
					user:user.account,
					group:req.body.gname
				}).then(function(result){
					return res.json({"CODE":codes.ugroup.usercreatesuccess,"result":result});
				});
			});
			
		},function(failed){
			return res.json({"CODE":codes.ugroup.usernotexist});
		});
	},function(failed){
		//如果不存在
		return res.json({"CODE":codes.ugroup.groupnotexist});
	});
});

/**
* @method POST
* 更新user 群組
* URL /group/updateuser
*
*/
admin.post('/group/updateuser', function(req, res){
	if(!req.body.account || !req.body.oldgroup || !req.body.newgroup){
		return res.json({"CODE":codes.ugroup.bodyerror});
	}
	GroupCtrl.checkUserofGroup(req.body.account, req.body.oldgroup, function(succ){
		succ.update({
			user:req.body.account,
			group:req.body.newgroup
		}).then(function(result){
			if(result){
				return res.json({"CODE":codes.ugroup.userchangesuccess, "result":result});
			}else{
				return res.json({"CODE":codes.ugroup.userchangefailed});
			}
		})
	}, function(failed){
		return res.json({"CODE":codes.ugroup.notfount});
	});
});

/**
* @method GET
* 取得 userofgroup list
* URL /group/updateuser
*
*/
admin.get('/group/getuog', function(req, res){
	models.UserofGroup.findAll({
	}).then(function(result){
		return res.json(result);
	});
});

// 確定使用者是否在群組裡
function checkUserofGroup(account, group, succ, failed){
	console.log("check ug");
	models.UserofGroup.findOne(
		{
			where:{
				user:account,
				group:group
			}
		}).then(function(result){
			if(result){
				succ(result);
			}else{
				failed(result);
			}
		})
}

/*-----------------------從以下開始還沒整理-----------------------------*/

/**
* @method POST
* 刪除使用者的群組
* URL /group/deleteuser
*
*/
admin.post('/group/deleteuser', function(req, res){
	if(!req.body.account || !req.body.group){
		return res.json({"CODE":codes.ugroup.bodyerror});
	}
	models.UserofGroup.destroy({
		where:{
			user:req.body.account,
			group:req.body.group
		}
	}).then(function(result){
		if(result == 0){
			return res.json({"CODE":codes.ugroup.deleteuserfailed});
		}else{
			return res.json({"CODE":codes.ugroup.deleteusersuccess});
		}
	});
});

/**
* @method POST
* 刪除群組
* URL /group/destroy
*
*/
admin.post('/group/destroy', function(req, res){
	if(!req.body.gname){
		return res.json({"CODE":codes.ugroup.bodyerror});
	}
	
	models.UserofGroup.findAll({
		attributes:['group', 'user'],
		raw:true
	}).then(function(uogs){
		var candelete = true;
		for(var idx in uogs){
			var uog = uogs[idx];
			if(uog.group == req.body.gname){
				candelete = false;
			}
		}
		if(!candelete){
			//can not delete
			return res.json({"CODE":codes.ugroup.keyConstraint});
		}else{
			models.UGroup.destroy({
				where:{
					name:req.body.gname
				}
			}).then(function(result){
				if(result == 0){
					return res.json({"CODE":codes.ugroup.deletgroupfailed});
				}else{
					return res.json({"CODE":codes.ugroup.deletegroupsuccess});
				}
			});
		}
	});
});

/*-----------------------group--end-------------------------*/
/*-----------------------category---start------------------------*/




// 確定 project item category 是否存在
var CheckProjectItemCategoryExistByName=(name, fn)=>{
	models.ProjectitemCategory.findOne({
		where:{
			name:name
		},
		attributes:['name']
	}).then(function(result){
		fn(result);
	});
};

/**
* @method POST
* category create
* URL /item/category/create
*
*/
admin.post('/item/category/create', function(req, res){
	if(!req.body.cname){
		return res.json({"CODE":codes.category.bodyerror});
	}
	CheckProjectItemCategoryExistByName(req.body.cname, function(category){
		if(category != null){
			category.update({
				description:req.body.description
			}).then(function(result){
				res.json({"CODE":codes.category.updateSuccess});
			});
			//res.json({"CODE":codes.category.duplicate});
		}else{
			models.ProjectitemCategory.create({
				name:req.body.cname,
				description:req.body.description
			}).then(function(result){
				res.json({"CODE":codes.category.addsuccess});
			});
		}
	});
});

/**
* @method GET
* 取得 categories
* URL /item/category
*
*/
admin.get('/item/category', function(req, res){
	models.ProjectitemCategory.findAll({
		attributes:['name', 'description', 'createdAt', 'updatedAt']
	}).then(function(categories){
		//console.log(category);
		if(categories.length > 0){
			res.json({"CODE":codes.category.getsuccess, "categories":categories});
		}else{
			res.json({"CODE":codes.category.empty})
		}
	});
});

/**
* @method POST
* 刪除某個category ＊有可能遇到 checkcategory 還沒刪除 所以 category的問題 沒有解決
* URL /item/category/destroy
*
*/
admin.post('/item/category/destroy', function(req, res){
	if(!req.body.name){
		return res.json({"CODE":codes.category.bodyerror});
	}
	models.CheckCategoryTypes.findOne({
		belongcheckcategory:req.body.name,
		attributes:['belongcheckcategory']
	}).then(function(pic){
		if(pic){
			res.json({"CODE":"ooxx"});
		}else{
			models.ProjectitemCategory.destroy({
				where:{
					name:req.body.name
				}
			}).then(function(result){
				if(result == 0){
					res.json({"CODE":codes.category.deletefailed});
				}else{
					res.json({"CODE":codes.category.deletesuccess});
				}
			});
		}
	});
	
});

/**
* @method POST
* 更新 category
* URL /item/category/modify
*
*/
admin.post('/item/category/modify', function(req, res){
	if(!req.body.oldname){
		return res.json({"CODE":codes.category.bodyerror});
	}
	CheckProjectItemCategoryExistByName(req.body.oldname, function(category){
		// 如果是null
		if(category == null){
			return res.json({"CODE":codes.category.notfound});
		}else{
			category.update({
				name:req.body.newname,
				description:req.body.description
			}).then(function(result){
				res.json({"CODE":codes.category.updateSuccess});
			});
		}
	});
});
/*-----------------------category---end------------------------*/
/*-----------------------checkcategory--start-------------------------*/

// 確認 目標 CheckCategory 是否存在
var CheckCheckCategoryExistByName = (name, fn)=>{
	models.CheckCategory.findOne({
		where:{
			name:name
		},
		attributes:['name']
	}).then(function(result){
		fn(result)
	});
};
 
/**
* @method POST
* check category create
* URL /checkcategory/create
*
*/
admin.post('/checkcategory/create', function(req, res){
	if(!req.body.name){
		return res.json({"CODE":codes.checkcategory.bodyerror});
	}
	CheckCheckCategoryExistByName(req.body.name, function(checkcategory){
		if(checkcategory != null){

			checkcategory.update({
				category:req.body.projectietrmcategory
			}).then(function(result){
				res.json({"CODE":codes.checkcategory.createsuccess});
			})
		}else{
			models.CheckCategory.create({
				name:req.body.name,
				category:req.body.projectietrmcategory
			}).then(function(result){
				res.json({"CODE":codes.checkcategory.createsuccess});
			})
		}
	})
});

/**
* @method POST
* check category delete
* URL /checkcategory/destroy
*
*/
admin.post('/checkcategory/destroy', function(req, res){
	if(!req.body.name){
		return res.json({"CODE":codes.checkcategory.bodyerror});
	}

	models.CheckItems.findOne({
		where:{
			checkcategory:req.body.name
		},
		attributes : ['checkcategory']
	}).then(function(checkitem){
		//如果沒有 才能刪除
		if(!checkitem){
			models.CheckCategoryTypes.findOne({
				where:{
					name:req.body.name
				},
				attributes:['name']
			}).then(function(checkcategorytype){
				if(checkcategorytype){
					res.json({"CODE":codes.checkcategory.deletefailed});
				}else{
					models.CheckCategory.destroy({
						where:{
							name:req.body.name
						}
					}).then(function(result){
						if(result == 0){
							res.json({"CODE":codes.checkcategory.deletefailed});
						}else{
							res.json({"CODE":codes.checkcategory.deletesuccess});
						}
					});
				}
			});
		}else{
			res.json({"CODE":codes.checkcategory.keyConstraint});
		}
	});
	
});

// check category update
admin.post('/checkcategory/update', function(req, res){

})

// 取得 check categorys
admin.get('/checkcategory', function(req, res){
	models.CheckCategory.findAll().then(function(checkcategories){
		res.json({"CODE":codes.checkcategory.addsuccess, "checkcategories":checkcategories});
	})
});

/*-----------------------checkcategory--end-------------------------*/
/*-----------------------checkcategorytypes--start-------------------------*/


// 確定 CheckCategoryType 是否存在
var CheckCategoryTypeExistByName = (name, fn)=>{
	models.CheckCategoryTypes.findOne({
		where:{
			name:name
		},
		attributes:['name']
	}).then((result)=>{
		fn(result);
	});
};

/**
* @method POST
* 新增 checkcategorytype
* /checkcategorytype/create
*
*/
admin.post('/checkcategorytype/create', function(req, res){
	if(!req.body.name){
		return res.json({"CODE":codes.checkcategorytype.bodyerror})
	}
	if(!req.body.parentcheckcategory){
		return res.json({"CODE":codes.checkcategorytype.bodyerror})
	}
	CheckCheckCategoryExistByName(req.body.parentcheckcategory, function(checkcategory){
		if(checkcategory){
			CheckCategoryTypeExistByName(req.body.name, function(checkcategorytype){
				if(!checkcategorytype){
					models.CheckCategoryTypes.create({
						belongcheckcategory:req.body.parentcheckcategory,
						name:req.body.name
					}).then(function(result){
						return res.json({"CODE":codes.checkcategorytype.createSuccess});
					})

				}else{
					return res.json({"CODE":codes.checkcategorytype.duplicate});
				}
			});
		}else{
			return res.json({"CODE":codes.checkcategorytype.notfoundCheckCategory});
		}
	})

});

/**
* @method POST
* 取得屬於 checkcategory 的 checkcategorytypes
* URL /checkcategorytypes
*
*/
admin.post('/checkcategorytypes', function(req, res){
	if(!req.body.checkcategory){
		return res.json({"CODE":codes.checkcategorytype.bodyerror})
	}
	models.CheckCategoryTypes.findAll({
		where:{
			belongcheckcategory:req.body.checkcategory
		},
		attributes:['belongcheckcategory', 'name', 'createdAt', 'updatedAt']
	}).then(function(checkcategorytypes){
		return res.json({"CODE":codes.checkcategorytype.getsuccess,"checkcategorytypes":checkcategorytypes});
	})
})

/**
* @method POST
* 刪除 checkcategorytype
* URL /checkcategorytype/destroy
*
*/
admin.post('/checkcategorytype/destroy', function(req, res){
	if(!req.body.name){
		return res.json({"CODE":codes.checkcategorytype.bodyerror})
	}
	if(!req.body.parentcheckcategory){
		return res.json({"CODE":codes.checkcategorytype.bodyerror})
	}
	models.CheckCategoryTypes.destroy({
		where:{
			name:req.body.name,
			belongcheckcategory:req.body.parentcheckcategory
		}
	}).then(function(result){
		//如果原本有東西，然後刪除成功，result 會等於1
		if(result == 1)
			return res.json({"CODE":codes.checkcategorytype.deleteSuccess});
		else
			return res.json({"CODE":codes.CheckCategoryType.deletenotfoundTarget});
	});
});
/*-----------------------checkcategorytypes--end-------------------------*/
// image test
admin.post('/image', function(req, res){
	
});

module.exports = admin
