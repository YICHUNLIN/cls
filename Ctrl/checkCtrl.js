/**
* 對於Check、CheckItem、CheckItemPicture的操作
* @module CheckCtrl
*/

var CheckCtrl = CheckCtrl || {};

var models = require('../models/index')
var codes = require('../codedefine');


CheckCtrl.getLocationFromFilename = (filename)=>{
	var splitedString = filename.split("@");
	if(splitedString.length < 3){
		return null;
	}else{
		return {"latitude":splitedString[1],"longitude":splitedString[2].toLowerCase().replace('.jpg','')};
	}
}

/**
*
* 產生一個CheckItem 然後儲存
* @param {json} 	req
* @param {string} 	filename
* @param {function} callback 
*/
CheckCtrl.createCheckItemAndSavePictures = (req,filename, picturelocation,callback)=>{
	var goalcheckitem = req.body.ciid;
	var goalitem = req.body.projectItem.id;
	var ismissing = (req.body.missing == "YES");
	models.CheckItems.findOne({
		where:{
			ciid:goalcheckitem
		},
		attributes:['ciid', 'checkcategory', 'categoryType']
	}).then(function(checkItem){
		// 如果不是第一張照片(已經存在)
		if(checkItem){
			//如果有找到 checkItem
			models.CheckItemPictures.create({
		    		url:filename,
		    		belongCheckItem:checkItem.ciid,
		    		isMark:ismissing,
		    		latitude:picturelocation.latitude,
		    		longitude:picturelocation.longitude
	    	}).then(function(checkItemPicture){
				callback(checkItemPicture);
	    	})
		}else{
			//如果是第一張照片
			//找不到Check item 就新增 check item
			//找check
	    	models.Checks.findOne({
	    		where:{
	    			id:req.body.checkset.id
	    		},
	    		attributes:['id', 'datetime', 'title', 'belongproject']
	    	}).then(function(check){
    			models.ProjectItem.findOne({
    				where:{
    					id:goalitem
    				},
    				attributes:['id']
    			}).then(function(pit){
    				if(pit){
		    			models.CheckItems.create({
		    				ciid:goalcheckitem,
		    				belongcheck:check.id,
		    				projectitem:pit.id,
		    				description:req.body.description,
		    				resulttype:req.body.ResultStatus,
		    				//missing:(req.body.missing == "YES"),
		    				checkcategory:req.body.checkcategory,
		    				categoryType:req.body.checkcategoryType
		    			}).then(function(createdcheckItem){
		    				//console.log(createdcheckItem);
		    				//新增check item picture
		    				models.CheckItemPictures.create({
					    		url:filename,
					    		belongCheckItem:createdcheckItem.ciid,
					    		isMark:ismissing,
					    		latitude:picturelocation.latitude,
					    		longitude:picturelocation.longitude
					    	}).then(function(checkItemPicture){
					    		console.log("save picture to db");
								callback(checkItemPicture);
					    	})
		    			})
		    		}
		    	})

	    	});

		}
	})
};

module.exports = CheckCtrl;