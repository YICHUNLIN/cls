/**
* 跟check有關的route
* URL /check
*/

var express = require('express');
var api = express.Router();
var models = require('../models/index')
var codes = require('../codedefine');
var multer = require('multer');// upload
var mkdirp = require('mkdirp');
var projectsfolder = './resource/projects/';
var fs = require('fs');

var ProjectCtrl = require('../Ctrl/projectCtrl');
var CheckCtrl = require('../Ctrl/checkCtrl');
var UploaderCtrl = require('../Ctrl/uploaderCtrl');

/**
* @method POST
* 產生一個 查驗活動
* URL /create
*/
api.post('/create', function(req, res){
    if(req.body.pid && req.body.description && req.body.title && req.body.date){
    	ProjectCtrl.ProjectBypid(req.body.pid, function(proj){
    		if(!proj){
    			return res.json({"CODE":codes.check.notFoundPid})
    		}
	    	models.Checks.create({
	    		title:req.body.title,
	    		datetime:req.body.date,
	    		description:req.body.description,
	    		belongproject:proj.identify
	    	}).then(function(response){
	    		console.log(response.id);
	    		//新增 check 資料夾
	    		mkdirp(projectsfolder+req.body.pid+"/"+response.id+"-"+req.body.title, function(err){
	    			return res.json({"CODE":codes.check.checkCreateSuccess, "data":response})
				});
	    	});
    	});
    }else{
    	return res.json({"CODE":codes.check.inputerror})
    }
});

/**
* @method POST
* 更新 勘驗活動
* URL /update
*/
api.post('/update', function(req, res){
	if(req.body.pid && req.body.description && req.body.title && req.body.date && req.body.cid){
    	ProjectCtrl.ProjectBypid(req.body.pid, function(proj){
    		if(!proj){
    			return res.json({"CODE":codes.check.notFoundPid})
    		}
    		//找到 要更新的 check
	    	models.Checks.findOne({
	    		where:{
	    			id:req.body.cid,
	    			belongproject:req.body.pid
	    		}
	    	}).then(function(check){
	    		if(check){
	    			var isChangeFolderName = (req.body.title == check.title);
	    			var oldname = check.id + "-"+check.title;
	    			//更新
	    			check.update({
	    				description:req.body.description,
	    				title:req.body.title,
	    				date:req.body.date
	    			}).then(function(result){
	    				if(!isChangeFolderName){
	    					//改黨名
		    				fs.rename( projectsfolder + check.belongproject+"/"+oldname,projectsfolder + check.belongproject+"/"+check.id+"-"+req.body.title, function(r){
		    					res.json({"CODE":codes.check.updateSuccess});
		    				})
		    				//check item 的 照片url也要改
	    				}else{
							res.json({"CODE":codes.check.updateSuccess});
	    				}
	    			})
	    		}else{
	    			res.json({"CODE":codes.check.notfoundCheck});
	    		}
	    	});
    	});
    }else{
    	return res.json({"CODE":codes.check.inputerror})
    }
})

/**
* @method POST
* 新增一個查驗記錄
* URL /checkitem/Create
*/
api.post('/checkitem/Create',function(req, res){
	var projpath = "/resource/projects/";

	var filepath = "";
	var storage = multer.diskStorage({
	    destination: function (req, file, callback) {
	    	if(typeof req.body.checkset == 'string'){	
		    	req.body.checkset = JSON.parse(req.body.checkset);
		    	req.body.projectItem = JSON.parse(req.body.projectItem);
		    	//console.log(req);
	    	}

	    	filepath = projpath+req.body.pid+"/"+req.body.checkset.id+"-"+req.body.checkset.title;
	    	//找找看有沒有check item
			callback(null, '.' + filepath);
	    	
	    },
	    filename: function (req, file, callback) {
	    	
			var location = CheckCtrl.getLocationFromFilename(file.originalname);
			console.log(location)
	    	CheckCtrl.createCheckItemAndSavePictures(req,filepath+'/'+file.originalname+".jpg", location, function(type){
	    		console.log(type)
	    		console.log("save")
	    	});
	        callback(null, file.originalname+".jpg");
	    }
	});
	var upload = multer({ storage: storage }).array('photo', 10);
	//如果設定5然後一次傳超過5張就會無法儲存 會壞掉
	//設定10 但是前端需要被限制少於10 1~9
	upload(req, res, function(err){

		//全部檔案處理結束後才會來這
		if(err){
			console.log(err);
			res.json({"CODE":codes.checkItem.createFailed});
		}else{
			res.json({"CODE":codes.checkItem.createsuccess});

		}
	})

});

/**
* @method GET
* 取得案子的所有查驗活動
* URL /:pid/checks
*/
api.get('/:pid/checks', function(req, res){
	models.Checks.findAll({
		where:{
			belongproject:req.params.pid
		},
		attributes:['title', 'id','datetime', 'description']
	}).then(function(checks){
		if(checks){
			res.json({"CODE":codes.check.getSuccess, "checks":checks});
		}else{
			res.json({"CODE":codes.check.getFailed});
		}
	});

// return checks list
});

/**
* @method GET
* 根據 check 取得 checkitem
* URL /checkitems/:belongcheck
*/
api.get('/checkitems/:belongcheck', function(req, res){
	models.sequelize.query("SELECT CheckItems.ciid, CheckItems.checkcategory, CheckItems.resulttype ,CheckItems.categoryType , CheckItems.description, ProjectItems.name FROM  CheckItems, ProjectItems where CheckItems.projectitem = ProjectItems.id and CheckItems.belongcheck = " + req.params.belongcheck).then(function(checkitems){	
		res.json({"CODE":codes.checkItem.getSuccess,"data":checkitems[0]});		
	});

})

/**
* @method GET
* 根據 checkitem 取得 pictures
* URL /pictures/:checkitem
*/
api.get('/pictures/:checkitem', function(req, res){

	// 判斷 req.parms.checkItem
	models.CheckItemPictures.findAll({
		where:{
			belongCheckItem:req.params.checkitem
		},attributes:['id', 'url', 'isMark', 'belongCheckItem','latitude','longitude']
	}).then(function(pictures){
		res.json({"data":pictures, "CODE":codes.checkItemPicture.getUrlsSuccess});
	});
});

//將某個查驗項目改成缺失
api.post('/setmiss', function(req, res){
//check id
//check item
});

/**
* @method POST
* 根據 Check item pictures id 取得 base64 pictures
* URL /picture
*/
api.post('/picture', function(req, res){
	if(!req.body.cipid){
		res.json({"CODE":codes.checkItem.inputError})
	}
	models.CheckItemPictures.findOne({
		where:{
			id:req.body.cipid
		},
		attributes:['url','id']
	}).then(function(pic){
		if(pic){
			UploaderCtrl.Base64Img('.'+pic.url, function(data){
				res.json(data);
			})
		}else{
			res.json({"CODE":codes.checkItemPicture.notFound})
		}
	})
})

/**
* @method POST
* 取得某個元件的所有 Check item
* URL /checkitems
*/
api.post('/checkitems', function(req, res){
	console.log(req.body.bimid);
	console.log(req.body.pid);
	if(!req.body.bimid || ! req.body.pid){
		res.json({"CODE":codes.checkItem.inputError})
	}
	models.sequelize.query("select CheckItems.ciid, CheckItems.resulttype, CheckItems.checkcategory, CheckItems.categoryType, Checks.title, Checks.datetime, Checks.description from CheckItems join ProjectItems on CheckItems.projectitem = ProjectItems.id join Checks on Checks.id = CheckItems.belongcheck where Checks.belongproject = '"+req.body.pid+"' and ProjectItems.bimid = '"+req.body.bimid+"'").then(function(cips){
		
		res.json({"data":cips[0], "CODE":codes.checkItem.getSuccess});		
	});
})

/**
* @method POST
* 取得某個checkitem 的 checkitempicture 根據 checkitem ciid
* URL /checkitemPicture
* 
*/
api.post('/checkitemPicture', function(req, res){
	if(!req.body.ciid){
		res.json({"CODE":codes.checkItemPicture.inputError});
	}
	models.CheckItemPictures.findAll({
		where:{
			belongCheckItem:req.body.ciid
		},attributes:["id", "url", "isMark", "belongCheckItem"]
	}).then(function(cips){
		res.json({"CODE":codes.checkItemPicture.success, "data":cips});
	})
})

// 根據check 取得 chckitem 與 checkitem 的 checkitemPicture
/*api.get('/CheckItemPictureWithCheckitem/:belongcheck', function(req, res){
	models.sequelize.query("SELECT CheckItems.ciid, CheckItems.checkcategory, CheckItems.missing ,CheckItems.categoryType , CheckItems.description, ProjectItems.name FROM  CheckItems, ProjectItems where CheckItems.projectitem = ProjectItems.id and CheckItems.belongcheck = " + req.params.belongcheck).then(function(checkitems){
		res.json({"CODE":codes.checkItem.getSuccess,"data":checkitems[0]});		
	});
})
*/
module.exports = api;