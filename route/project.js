/**
* 跟project有關的route
* URL /board
*/
var express = require('express');
var models = require('../models/index')
var api = express.Router();
var uuid = require('uuid/v4');
var codes = require('../codedefine')
var jwt = require('jwt-simple');
var jwtSetting = require('../config/systemConf').jwtSetting;
var mkdirp = require('mkdirp');
var projectsfolder = './resource/projects/';
var userCtrl = require('../Ctrl/userCtrl');
var permissionCtrl = require('../Ctrl/permissionCtrl')
var projectCtrl = require('../Ctrl/projectCtrl')

/**
* @method POST
* 產生一個 project
* URL /create
*/
api.post('/create', function(req, res){
	if(req.body.user){
		userCtrl.UserByAccount(req.body.user, function(user){
			if(user){
				// 確定permission是否存在
				permissionCtrl.checkPermissionExist('level4', function(permission){
					if(permission){
						// 產生一個uuid
						var pid = uuid.v4();
						models.Project.create({
							identify:pid,
							name:req.body.pname,
							duration:0,
							startdate:null,
							estimateEndDate:null,
							actualEndDate:null,
							afterchangeDesignDate:null,
							increaseDuration:0,
							description:"(empty)"
						}).then(function(project){
							if(project){
								// user project relation (permission)
								// 創造者 擁有 Level5 
								models.ProjectMember.create({
									isPin:false,
									project:project.identify,
									member:user.account,
									ptype:permission.permlevel
								}).then(function(pm){
									//產生一個資料夾
									mkdirp(projectsfolder+pid, function(err){
										res.json({"CODE":codes.boardcreate.success,"project":project});
									});
								});
							}else{
								res.json({"CODE":codes.boardcreate.duplicate});
							}
						});
					}else{
						res.json({"CODE":codes.boardcreate.nofoundpremession})
					}
				});
			}else{
				res.json({"CODE":codes.boardcreate.usererror});
			}
		});
	}else{
		res.json({"CODE":codes.boardcreate.inputError});
	}
});

/**
* @method POST
* 更新 project 的資訊
* URL /upadte
*/
api.post('/update', function(req, res){
	var token = req.headers['vic-token'];
	var decoded = jwt.decode(token, jwtSetting.jwtTokenScret);
	var account = decoded.iss;
	permissionCtrl.checkPermission(account, req.body.pid, ["level4", "level3"], function(result){
		if(result){
			projectCtrl.ProjectBypid(req.body.pid, function(project){
				if(project != null){
					project.update({
						name:req.body.name,
						duration:req.body.duration,
						startdate:req.body.startdate,
						estimateEndDate:req.body.estimateEndDate,
						actualEndDate:req.body.actualEndDate,
						afterchangeDesignDate:req.body.afterchangeDesignDate,
						increaseDuration:req.body.increaseDuration,
						description:req.body.description,
						datetype:req.body.datetype
					}).then(function(project){
						res.json({"CODE":codes.boardupdate.success,"project":project});
					});
				}else{
					res.json({"CODE":codes.boardupdate.notfound});
				}
			});
		}else{
			res.json({"CODE":codes.boardupdate.nopermission});
		}
	});
});

/**
* @method POST
* 取得 project profile
* URL /profile
*/
api.post('/profile', function(req, res){
	var token = req.headers['vic-token'];
	var decoded = jwt.decode(token, jwtSetting.jwtTokenScret);
	var account = decoded.iss;
	projectCtrl.ProjectBypid(req.body.pid, function(project){
		if(project != null){
			res.json({"CODE":codes.project.getProfileSuccess, "project":project});
		}else{
			res.json({"CODE":codes.project.getProfileFailed});
		}
	});
});

/**
* @method POST
* 根據 user 取得他參與的 project
* URL /boards
*/
// get boards by user
api.post('/boards', function(req, res){
	if(req.body.user){
		userCtrl.UserByAccount(req.body.user, function(user){
		
			models.sequelize.query("SELECT identify,name,isPin,ptype,startdate,estimateEndDate,actualEndDate,description,duration FROM Projects JOIN ProjectMembers ON  ProjectMembers.project = Projects.identify WHERE ProjectMembers.member = '" + user.account + "'").then(function(data){
				if(data){
					res.json({"CODE":codes.boardfind.success,"PROJECTS":data[0]});
				}else{
					res.json({"CODE":codes.boardfind.notfound});
				}
			});	
		});
	}else{
		res.json({"CODE":codes.boardfind.inputError});
	}
});
/**
* @method POST
* 取得 project 的參與者(project members)
* URL /members
*/
api.post('/members', function(req, res){
	if(req.body.pid){
		
		models.sequelize.query("SELECT firstname,lastname,role,email,ptype,company_name, photourl, account FROM Users JOIN ProjectMembers ON ProjectMembers.member = Users.account WHERE ProjectMembers.project = '" + req.body.pid +"'").then(function(data){
			console.log(data[0]);
			return res.json({"CODE":codes.project.getMemberSuccess,"result":data[0]});
		});

	}else{
		return res.json({"CODE":codes.project.getMemberFailed});
	}
});

/**
* @method GET
* 取得 project 得 members 根據 pid (不確定還有沒有用)
* URL /:pid/members
*/
api.get('/:pid/members', function(req, res){
	if(req.params.pid){
		models.ProjectMember.findall({
		where:{
			project:req.params.pid
		},
		attributes:['ptype', 'project', 'member']
		}).then(function(pms){
			if(pms){
				
				models.User.findAll({
					where:{
						account:{
							$in:pms
						}
					}
				}).then(function(result){
					return res.json({"CODE":"","result":result});
				});

			}else{
				return res.json({"CODE":"get member ERR"});
			}
		});
	}else{
		return res.json({"CODE":"get member ERR"});

	}
});

/**
* @method GET
* 取得 project id 取得Project資訊 (不確定還有沒有用)
* URL /:pid
*/
api.get('/:pid', function(req, res){
	if(req.params.pid){
		models.Project.findOne({
			where:{
				identify:req.params.pid
			}
		}).then(function(response){
			if(response){
				res.json({"CODE":codes.projectget.success, "data":response});
			}else{
				res.json({"CODE":codes.projectget.failed});
			}
		})
	}else{
		res.json({"CODE":codes.projectget.inputError});
	}
	// board id
	//return board`s activitys(activitys of project)
});

/**
* @method POST
* 判斷L4權限
* URL /L4ptype
*/
api.post('/L4ptype', (req, res)=>{
	var token = req.headers['vic-token'];
	var decoded = jwt.decode(token, jwtSetting.jwtTokenScret);
	var account = decoded.iss;
	var pid = req.body.pid;
	if(!pid){
		 res.json({"CODE":codes.IDCheck.NotID})
	}else{
		models.ProjectMember.findOne({
				where:{
					project:pid,
					member:account
				},
				attributes:['ptype', 'project', 'member']
			}).then((pm)=>{
				if(pm.ptype == "level4"){
					 return res.json({"CODE":codes.IDCheck.isID});
				}else{
					 return res.json({"CODE":codes.IDCheck.isNotID});
				}
		});
	}

});

/**
* @method POST
* 新增 project members
* URL /addmember
*/
api.post('/addmember', (req, res)=>{
	// 驗證 Token
	var token = req.headers['vic-token'];
	var decoded = jwt.decode(token, jwtSetting.jwtTokenScret);
	var account = decoded.iss;
	if(account == req.body.account){
		return res.json({"CODE":codes.projectSetting.canNotSetSelf})
	}
	//根據 account 取 User
	userCtrl.UserByAccount(req.body.account, (user)=>{
		if(user){
			//確定 Permission 是否正確
			permissionCtrl.checkPermissionExist(req.body.plevel, (permission)=>{
				if(permission){
					var pid = req.body.pid;
					var uac = req.body.account;
					var plevel = req.body.plevel;
					if(pid && uac){
						// 根據Project id 取資料
						models.Project.findOne({
							where:{
								identify:pid
							}
						}).then((project)=>{
							if(project){
								//取projectMember
								models.ProjectMember.findOne({
									where:{
										project:pid,
										member:uac
									},
									attributes:['ptype', 'project', 'member']
								}).then((pm)=>{
									// 如果已經有，就更新
									if(pm){
										pm.update({
											ptype:plevel
										}).then((pmr)=>{
											res.json({"CODE":codes.projectSetting.memberSuccess});
										})
									}else{
										// 如果沒有 就加一個新的
										models.ProjectMember.create({
											isPin:false,
											project:project.identify,
											member:user.account,
											ptype:permission.permlevel
										}).then(function(pmr){
											res.json({"CODE":codes.projectSetting.memberSuccess});
										});
									}
								});
							}else{
								res.json({"CODE":codes.projectSetting.notFoundProject});
							}
						});
					}else{
						res.json({"CODE":codes.projectSetting.memberInputError});
					}
				}else{
					res.json({"CODE":codes.projectSetting.permissionFailed});
				}
			});
		}else{
			return res.json({"CODE":codes.projectSetting.notFoundUser});
		}
	});
});

/**
* @method POST
* 移除參與者
* URL /removemember
*/
api.post('/removemember', function(req, res){
	var token = req.headers['vic-token'];
	var decoded = jwt.decode(token, jwtSetting.jwtTokenScret);
	var account = decoded.iss;
	//不能刪除自己
	if(account == req.body.account){
		return res.json({"CODE":codes.projectSetting.canNotRemoveSelf});
	}

	userCtrl.UserByAccount(req.body.account, (user)=>{
		if(user){
			//刪除
			models.ProjectMember.destroy({
				where:{
					project:req.body.pid,
					member:req.body.account
				}
			}).then((result)=>{
				return res.json({"CODE":codes.projectSetting.removeSuccess});
			});
		}else{
			return res.json({"CODE":codes.projectSetting.notFoundUser});
		}
	});
});
module.exports = api;
