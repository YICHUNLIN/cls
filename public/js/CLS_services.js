var service = angular.module('cls_services',[]);

var api_addr = "http://localhost:9453"
//換頁狀態
service.factory('pageService',['$localStorage',function($localStorage){
	var pageNow = 'login';
	return {
		getPageNow: function(){
			return pageNow;
		},
		setPageNow: function(pagechange){
			pageNow = pagechange;
		}
	};
}]);


//project 資料
service.factory('projectService', ['$http', '$localStorage', function($http, $localStorage){
var dbProjects = [];
	var projectMembers = [];
	return{
		getProjects:(auth, fn)=>{
			$http({
				method:'POST',
				headers: {
					'Content-Type': 'application/json',
					'vic-token':$localStorage.tkn
				},
				data:{
					"token":"",
					"user":auth
				},
				url:api_addr+'/api/board/boards'
			}).then(function(response){
				dbProjects = response['data']['PROJECTS'];
				fn(dbProjects);
			},function(response){
				fn(null);
			});
			//return dbcards;
		},
		addProject:(user,tkn,fn)=>{
			$http({
				method:'POST',
				headers: {
					'Content-Type': 'application/json',
					'vic-token':$localStorage.tkn
				},
				data:{
					"pname":"(新增)",
					"user":user
				},
				url:api_addr+'/api/board/create'
			}).then(function(response){
				if(response['data']['project']){
					dbProjects.push(response['data']['project']);
				}
				//fn(response);
			},function(response){
				//fn(response);
			});
		},
		setThumbByid:(user, selid)=>{
			for(var i = 0; i < dbProjects.length; i++){
				if(dbProjects[i].identify == selid){
					// update
					$http({
						method:'POST',
						headers: {
							'Content-Type': 'application/json',
							'vic-token':$localStorage.tkn
						},
						data:{
							user:user,
							pid:selid,
							isPin:!dbProjects[i].isPin
						},
						url:api_addr+'/api/user/spin'
					}).then(function(response){
					},function(response){
					});
					dbProjects[i].isPin = !dbProjects[i].isPin;
					break;
				}
			}
		},
		selectProject:(pid, fn)=>{
			for(var i = 0; i < dbProjects.length; i++){
				if(dbProjects[i].identify == pid){
					fn(dbProjects[i]);
					return;
				}
			}
			fn(null);
		},
		getMemberOfProject:(pid, fn)=>{
			$http({
				method:'POST',
				headers: {
					'Content-Type': 'application/json',
					'vic-token':$localStorage.tkn
				},
				data:{
					pid:pid,
				},
				url:api_addr+'/api/board/members'
			}).then((response)=>{
				projectMembers = response["data"]["result"];
				fn(response)
			},(response)=>{
				fn(response)
			});
		},
		getPermissions:(fn)=>{
			$http({
				method:"GET",
				headers:{
					'Content-Type': 'application/json',
					'vic-token':$localStorage.tkn
				},
				url:api_addr+'/api/admin/permissions'
			}).then((response)=>{
				fn(response)
			}, (response)=>{
				fn(response)
			});
		},
		addProjectMember:(PM, fn)=>{
			$http({
				method:"POST",
				headers:{
					'Content-Type': 'application/json',
					'vic-token':$localStorage.tkn
				},
				data:{
					pid:$localStorage.selectProject,
					account:PM.account,
					plevel:PM.permissions
				},
				url:api_addr+'/api/board/addmember'
			}).then((response)=>{
				fn(response);
			},(response)=>{
				fn(response);
			});
		},
		removeProjectMember:(PM, fn)=>{
			$http({
				method:"POST",
				headers:{
					'Content-Type': 'application/json',
					'vic-token':$localStorage.tkn
				},
				data:{
					pid:$localStorage.selectProject,
					account:PM.account
				},
				url:api_addr+'/api/board/removemember'
			}).then((response)=>{
				fn(response);
			}, (response)=>{
				fn(response);
			});
		},
		updateProjectProfile:(pfs, fnsuc, fnfailed)=>{
			$http({
				method:"POST",
				headers:{
					'Content-Type': 'application/json',
					'vic-token':$localStorage.tkn
				},
				data:{
					pid:$localStorage.selectProject,
					name:pfs.name,
					duration:pfs.duration,
					startdate:pfs.startdate,
					estimateEndDate:pfs.estimateEndDate,
					actualEndDate:pfs.actualEndDate,
					afterchangeDesignDate:pfs.afterchangeDesignDate,
					increaseDuration:pfs.increaseDuration,
					description:pfs.description,
					datetype:pfs.datetype
				},
				url:api_addr+'/api/board/update'
			}).then((response)=>{
				console.log(response);
				fnsuc(response);

			},(response)=>{
				fnfailed(response);
			});
		},
		getProjectProfile:(pid, fn)=>{
			$http({
				method:"POST",
				headers:{
					'Content-Type': 'application/json',
					'vic-token':$localStorage.tkn
				},
				data:{
					pid:$localStorage.selectProject
				},
				url:api_addr+'/api/board/profile'
			}).then((response)=>{
				//console.log(response);
				fn(response);
			}, (response)=>{
				fn(response);
			})
		},
		checkEditor:(fn)=>{
			$http({
				method:"POST",
				headers:{
					'Content-Type': 'application/json',
					'vic-token':$localStorage.tkn
				},
				data:{
					pid:$localStorage.selectProject
				},
				url:api_addr+'/api/board/L4ptype'
			}).then((response)=>{
				if(response["data"]["CODE"] == "SUC020")
					fn(true)
				else
					fn(false)
			}, (response)=>{
				fn(false)
			});
		},
		datetypes:(fn)=>{
			var dts = ["工作天", "日曆天"];
			fn(dts)
		},
		getAllProjectItems:(fn)=>{
			$http({
				method:"POST",
				headers:{
					'Content-Type': 'application/json',
					'vic-token':$localStorage.tkn
				},
				data:{
					pid:$localStorage.selectProject
				},
				url:api_addr+"/api/item/all"
			}).then((response)=>{
				if(response["data"]["CODE"] === "SUC023"){
					fn(response["data"]["data"]);
				}else{
					fn(null);
				}
			})
		},
		ForgeUploadIFCModel:(model, callback)=>{
			$http({
				method:'POST',
				headers:{
					'Content-Type':undefined,
					transformRequest: angular.identity,
					'vic-token':$localStorage.tkn,
					'selectProject':$localStorage.selectProject
				},
				data:model,
				url: api_addr+'/api/forge/uploadfile'
			}).then(function(succ){
				callback(succ);
			},function(failed){
				callback(failed);
			});
		},
		ForgeTranslat:(urn, callback)=>{
			$http({
				method:"POST",
				headers:{
					'Content-Type': 'application/json',
					'vic-token':$localStorage.tkn
				},
				data:{
					b64urn:urn
				},
				url:api_addr+"/api/forge/translateSVF"
			}).then((response)=>{
				console.log(response);
				callback(response);
			})
		}
	}
}]);

service.factory('itemchecksService',['$http', '$localStorage', function($http, $localStorage){

	return{
		getCheckItemsByCheckFromServer:function(check, callback){
			console.log($localStorage.checkset);
			$http({
				method:'GET',
				headers:{
					'Content-Type': 'application/json',
					'vic-token':$localStorage.tkn
				},
				url:api_addr+'/api/check/checkitems/'+check
			}).then((response)=>{
				callback(response["data"]["CODE"],response["data"]["data"]);
			});
		},
		getCheckItemPictureByCheckItemFromServer:function(checkitem, callback){
			$http({
				method:'POST',
				headers:{
					'Content-Type': 'application/json',
					'vic-token':$localStorage.tkn
				},
				url:api_addr+'/api/check/checkitemPicture',
				data:{
					'ciid':checkitem
				}
			}).then((response)=>{
				callback(response["data"]["CODE"], response["data"]["data"]);
			})
		}
	};
}]);

service.factory('checksService',['$http', '$localStorage', function($http, $localStorage){
	var nextid = 6;
	var checks = [
		{
			"id":1,
			"title":"2016/12/1-16:30",
			"description":"自主檢查"
		},
		{
			"id":2,
			"title":"2016/12/2-16:30",
			"description":"品管"
		},
		{
			"id":3,
			"title":"2016/12/3-16:30",
			"description":"驗收"
		},
		{
			"id":4,
			"title":"2016/12/4-16:30",
			"description":"抽查"
		},
		{
			"id":5,
			"title":"2016/12/5-16:30",
			"description":"檢驗停留點"
		}
	];


	return{
		getchecks:function(fn){
			$http({
				method:'GET',
				headers:{
					'Content-Type': 'application/json',
					'vic-token':$localStorage.tkn
				},
				url:api_addr+'/api/check/'+$localStorage.selectProject+"/checks"
			}).then(function(response){
				fn(response["data"]["CODE"], response["data"]["checks"]);
			}, 
			function(response){
				fn(response["data"]["CODE"], null);
			})
		},
		//新增一個check
		addCheck:function(datas,fn){
			//check["id"] = nextid;
			//nextid ++;
			//checks.push(check);

			$http({
				method:'POST',
				headers:{
					'Content-Type': 'application/json',
					'vic-token':$localStorage.tkn
				},
				data:{
					pid:$localStorage.selectProject,
					title:datas.title,
					description:datas.description,
					date:datas.date
				},
				url:api_addr+'/api/check/create'
			}).then(function(response){
				fn(response["data"]["CODE"], response["data"]["data"]);
			}, 
			function(response){
				fn(response["data"]["CODE"], null);
			})
		},
	};
}]);

service.factory('mapService', function(){
	var locations = [];

	return{
		addLocation:function(pos){

			locations.push({"lat":pos.lat(),"lng":pos.lng()});
		},
		getLocations:function(){
			return locations;
		}
	};
});

service.factory('tokenService', ['$http', function($http){
	var self = this;
	return {
		getToken:function(loginInfo, fn){
			$http({
				method: 'POST',
				url: api_addr+'/api/auth/token',
				headers: {
					'Content-Type': 'application/json'
				},
				data:{
					account: loginInfo.account,
					password: loginInfo.password
				}
			}).then(function success(response){
				console.log(loginInfo);
				fn(response['data']['CODE'],response['data']['token']);
				console.log(response);
			}, function error(response){
				fn(esponse['data']['CODE'],null);
			});
		}
	};
}]);


service.factory('signupService', ['$http', function($http){
	return{
		signup: function(signupinfo, fn1, fn2){
			$http({
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				data:{
					"account":signupinfo.account,
					"password":signupinfo.password,
					"firstname":signupinfo.firstname,
					"lastname":signupinfo.lastname,
					"mobile":signupinfo.mobile,
					"tel":signupinfo.tel,
					"role":signupinfo.role,
					"company_name":signupinfo.company_name,
					"company_address":signupinfo.company_address,
					"company_tel":signupinfo.company_tel
				},
				url:api_addr+'/api/user/signup'
			}).then(function(response){
				fn1(response);
				console.log(response);
			}, function(response){
				fn2(response);
			});
		},
		checkField: function(signupinfo, fn1, fn2){
			var iserror = false;
			var errmessage = "!! ";
			if(signupinfo.password != signupinfo.password_again){
				errmessage += "兩次密碼不同";
				iserror = true;
			}
			if(signupinfo.password)

			if(!iserror){
				fn1("歡迎加入我們");
			}

		}
	};

}]);

service.factory('loginService', ['$http', '$localStorage', function($http, $localStorage){
	return{
		login: function(loginInfo,fn){
			$http({
				method:'POST',
				headers: {
					'Content-Type': 'application/json',
					'vic-token':$localStorage.tkn
				},
				data:{
					"account":loginInfo.account,
					"password":loginInfo.password
				},
				url:api_addr+'/api/user/login'
			}).then(function(response){
				fn(response["data"]["CODE"],response["data"]["user"]);
				$localStorage.lasttime = response["data"]["time"];
				$localStorage.lastip = response["data"]["loginip"];
			},function(response){
				fn(response["data"]["CODE"]);
			});
		}
	};
}]);

service.factory('logoutService', ['$http', '$localStorage',function($http,$localStorage){
	return{
		logout: function(auth,fn){
			$http({
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'vic-token':$localStorage.tkn
				},
				data:{
					"user":auth
				},
				url: api_addr+'/api/user/logout'
			}).then(function(response){
				fn(response['data']['CODE']);
			},function(response){
				fn(response['data']['CODE']);
			})
		}
	};
}]);


service.factory('relationDataService', ['$http', function($http){
	return{
		roles:function(fn){
			var roles = [
				{id:0, name:"工程師"},
				{id:1, name:"監造"},
				{id:2, name:"業主"},
				{id:3, name:"業主代表"},
				{id:4, name:"工程助理"}
			];
			fn(roles);
		}
	};
}]);

// 上傳照片
service.factory('datauploaderService', ['$http', '$localStorage', function($http, $localStorage){
	return{
		userphoto:function(data,fn){
			$http({
				method:'POST',
				headers:{
					'Content-Type':undefined,
					transformRequest: angular.identity,
					'vic-token':$localStorage.tkn
				},
				data:data,
				url: api_addr+'/api/upload/userphoto'
			}).then(function(succ){
				fn(succ);
			},function(failed){
				fn(failed);
			});
		}
	};
}]);

//
service.factory('personalService', ['$http', '$localStorage', function($http, $localStorage){
	return{
		getuserdata:function(user,fn){
			$http({
				method:'POST',
				headers: {
					'Content-Type': 'application/json',
					'vic-token':$localStorage.tkn
				},
				data:{id:user},
				url: api_addr + '/api/user/data'
			}).then(function(response){
				fn(response);
			})
		},
		getuserphotob64:function(filename, fn){
			$http({
				method:'GET',
				headers:{
					'Content-Type':'application/json',
					'vic-token':$localStorage.tkn
				},
				url: api_addr+'/api/upload/userb64/'+ filename
			}).then(function(succ){
				fn(succ);
			},function(failed){
				fn(failed);
			});
		},
		downloaduserphoto:function(filename, fn){
			$http({
				method:'GET',
				headers:{
					'Content-Type':'application/json',
					'vic-token':$localStorage.tkn
				},
				url: api_addr+'/api/upload/download/'+ filename
			}).then(function(succ){
				console.log(succ);
				fn(succ);
			},function(failed){
				console.log(failed);
				fn(failed);
			});
		},//下載檔案
		downloadfile:function(filename, pid, fn){
			$http({
				method:'GET',
				headers:{
					'Content-Type':'application/json',
					'vic-token':$localStorage.tkn
				},
				url: api_addr+'/api/upload/'+pid+'/'+ filename
			}).then(function(succ){
				fn(succ);
			},function(failed){
				fn(failed);
			});
		},//換密碼
		changepwd:function(newpwd, fn){
			$http({
				method:'POST',
				headers:{
					'Content-Type':'application/json',
					'vic-token':$localStorage.tkn
				},
				data:{
					password:newpwd
				},
				url: api_addr+'/api/user/updatepwd'
			}).then(function(succ){
				fn(succ);
			}, function(failed){
				fn(failed);
			});
		}
		
	};
}]);

//project item相關
service.factory('ProjectItemService', ['$http', '$localStorage', function($http, $localStorage){
	return{
		multiCreate:function(items, fn){

		},
		createItem:function(item, fn){
			console.log('createItem test');
			$http({
				method:'POST',
				headers:{
					'Content-Type': 'application/json',
					'vic-token':$localStorage.tkn
				},
				data:item,
				url:api_addr+'/api/item/create'
			}).then(function(response){
				console.log(response);
			}, 
			function(response){
				console.log(response);
			})
		},
		getParentItemsBypid:function(pid, fn){
			$http({
				method:'POST',
				headers:{
					'Content-Type': 'application/json',
					'vic-token':$localStorage.tkn
				},
				data:{
					pid:pid
				},
				url:api_addr+'/api/item/parentItems'
			}).then(function(suc){
				fn(suc);
			},function(failed){
				fn(failed);
			});
		},
		getItemByParent:function(parent, fn){

		},
		getItemsOfProject:function(pid, fn){

		},
		updateItem:function(item, fn){

		}
	};
}]);
service.factory('ForgeService', ['$http','$localStorage', function($http,$localStorage){
	return{
		getToken:(callback)=>{
			$http({
				method:'GET',
				headers:{
					'Content-Type': 'application/json',
					'vic-token':$localStorage.tkn
				},
				url:api_addr+"/api/forge/getToken"
			}).then((response)=>{
				callback(response['data']['access_token']);
			}, (response)=>{
				callback(response);
			})
		},
		getUrn:(callback)=>{
			$http({
				method:"GET",
				headers:{
					'Content-Type': 'application/json',
					'vic-token':$localStorage.tkn
				},
				url:api_addr+"/api/forge/urn/"+$localStorage.selectProject
			}).then((response)=>{
				if(response["data"]["CODE"] === "SUC030-1"){
					callback("urn:"+response["data"]["URN"]);
				}else{
					callback(null);
				}
			})
		
			//callback("urn:"+"dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Ym9pbGVyL2J1aWxkaW5naWZjdmlsaW4uaWZj")
			//callback("urn:"+"dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Ym9pbGVyL0JJTU1vZGVsLmlmYw");
			//callback("urn:"+"dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Ym9pbGVyL2JyaWRnZS5pZmM");
			//callback("urn:"+"dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE4LTAzLTA5LTA2LTU1LTE4LWQ0MWQ4Y2Q5OGYwMGIyMDRlOTgwMDk5OGVjZjg0MjdlLyVFNSU5QyU5RiVFNiU5QyVBOCVFNyVBMiVBOSVFNCVCOCU4MC0wNTUxMjgzLSVFNiU5RSU5NyVFOSU4MCVCOCVFNyVCRSVBNC5ydnQ");
			//callback("urn:"+"dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Ym9pbGVyL2J1aWxkaW5nMjMuaWZj")
			//callback("urn:"+"dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Ym9pbGVyL2J1aWxkaW5naWZjdmlsaW4uaWZj")

		},
		getCheckitemsByBimID:(bimid, callback)=>{
			$http({
				method:'POST',
				headers:{
					'Content-Type': 'application/json',
					'vic-token':$localStorage.tkn
				},
				data:{
					bimid:bimid,
					pid:$localStorage.selectProject
				},
				url:api_addr+"/api/check/checkitems"
			}).then((response)=>{
				callback(response['data']);
			}, (response)=>{
				callback(response);
			})
		},
		checkProjectItemIsExist: (bimid, callback)=>{
			$http({
				method:'POST',
				headers:{
					'Content-Type': 'application/json',
					'vic-token':$localStorage.tkn
				},
				data:{
					bimid:bimid,
					pid:$localStorage.selectProject
				},
				url:api_addr+"/api/item/exist"
			}).then((response)=>{
				callback(response['data']['CODE'] == "SUC023");
			}, (response)=>{
				callback(response);
			})
		},
		getCheckItemPicturesByCIID:(ciid, callback)=>{
			$http({
				method:'GET',
				headers:{
					'Content-Type': 'application/json',
					'vic-token':$localStorage.tkn
				},
				url:api_addr+"/api/check/pictures/"+ciid
			}).then((response)=>{
				callback(response['data']);
			}, (response)=>{

			})
		},
		getChecks:(callback)=>{
			$http({
				method:'GET',
				headers:{
					'Content-Type': 'application/json',
					'vic-token':$localStorage.tkn
				},
				url:api_addr+'/api/check/'+$localStorage.selectProject+"/checks"
			}).then(function(response){
				callback(response["data"]["CODE"], response["data"]["checks"]);
			}, 
			function(response){
				callback(response["data"]["CODE"], null);
			})
		},getCheckCategories:(callback)=>{
			$http({
				method:'GET',
				headers:{
					'Content-Type': 'application/json',
					'vic-token': $localStorage.tkn
				},
				url:api_addr+'/api/admin/checkcategory'

			}).then((succ)=>{
				callback(succ['data']['CODE'], succ['data']['checkcategories']);
			}, (failed)=>{
				callback(failed['data']['CODE']);
			})
		},getCheckCategortTypesByCheckCategory:(ccname, callback)=>{
			$http({
				method:'POST',
				headers:{
					'Content-Type': 'application/json',
					'vic-token': $localStorage.tkn
				},
				data:{
					checkcategory:ccname
				},
				url:api_addr+'/api/admin/checkcategorytypes'

			}).then((succ)=>{
				callback(succ['data']['CODE'], succ['data']['checkcategorytypes']);
			}, (failed)=>{
				callback(failed['data']['CODE']);
			})
		},
		uploadPictures:(body, pictures, callback)=>{
			$http({
				method:'POST',
				headers:{
					'Content-Type':undefined,
					transformRequest: angular.identity,
					'vic-token':$localStorage.tkn,
				},
				data:pictures,
				url: api_addr+'/api/check/checkitem/Create'
			}).then(function(succ){
				callback(succ);
			},function(failed){
				callback(failed);
			});
		},
		getProjectItems:(callback)=>{
			$http({
				method:"POST",
				headers:{
					'Content-Type': 'application/json',
					'vic-token':$localStorage.tkn
				},
				data:{
					pid:$localStorage.selectProject
				},
				url:api_addr+"/api/item/all"
			}).then((response)=>{
				if(response["data"]["CODE"] === "SUC023"){
					callback(response["data"]["data"]);
				}else{
					callback(null);
				}
			})
		}
		

	}
}]);

service.factory('ForgeExtension', ['$http','$localStorage', function($http,$localStorage){
	return{
		Event:{
			SelectedEvent:(viewer, target,type, callback)=>{
	  			viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, onSelectionEvent.bind(target));
	  			function onSelectionEvent(event) {
					var sel = viewer.getSelection();
					if(type == "rvt"){
						viewer.getProperties(event.dbIdArray[0], data=>{
							callback(data)
						})
					}else if(type == "ifc"){
						var view = viewer;
						beSelectedElement = null;
						if(sel){
						  function isGoal(property){
							if((property.attributeName == 'LcIFCProperty:IFCString') && (property.displayName == 'TAG'))
							  return true;
							return false;
						  }
						  function isParent(property){
							if(property.attributeName == 'parent')
							  return true;
							return false;
						  }
						  function getGoal(v, target, deep){
							if(deep > 5) return;
							v.getProperties(target, function(ObjProps){
							  if(ObjProps){
								for(var index in ObjProps.properties){
								  var Prop = ObjProps.properties[index];
								  //找到名字屬性
								  if(findGoal && Prop.displayName == "NAME"){
									break;
								  }
								  //確定是目標元件
								  if(isGoal(Prop)){
									findGoal = true;
									beSelectedElement = Prop;
									callback(Prop);
									break;
								  }
								  //如果是parent 優先權最低
								  if(isParent(Prop)){
									target = parseInt(Prop.displayValue);
								  }
								}
								getGoal(v, target, deep + 1);
							  }
							})
						  }
						  var findGoal = false;
						  var deep = 0;
						  var target = sel[0];
						  // do
						  getGoal(view, target, deep);
						}  
					}
				};
			}
		},
		UI:{
			CreateButton:(viewer, target, option)=>{

				var onToolbarCreatedBinded =  OnButtonCreate.bind(target);
				if (viewer.toolbar) {
					CreateUI();
				} else {
					target.viewer.addEventListener(av.TOOLBAR_CREATED_EVENT, onToolbarCreatedBinded);
				}
				function OnButtonCreate(){
					viewer.removeEventListener(av.TOOLBAR_CREATED_EVENT, onToolbarCreatedBinded);
					onToolbarCreatedBinded = null;
					CreateUI();
				}
				function CreateUI(){
					var SB = new Autodesk.Viewing.UI.Button(option.name);
					SB.onClick = option.onClickEvent;
					SB.addClass(option.class);
					SB.setToolTip(option.Tip);
					option.toolbar.addControl(SB);
				}
			},
			MyPanel:(viewer, id, title, style)=>{
				
				function CusPanel(viewer, container, id, title, style){
					this.viewer = viewer;
					Autodesk.Viewing.UI.DockingPanel.call(this, container, id, title, {});

					this.container.classList.add('docking-panel-container-solid-color-a');
					this.container.style.top = style.top;
					this.container.style.left = style.left;
					this.container.style.width = style.width;
					this.container.style.height = style.height;
					this.container.style.resize = style.resize;

					var cusPanel = $('#CusPanel')[0];

					var op = {left:false,heightAdjustment:100,marginTop:0};
					this.scrollcontainer = this.createScrollContainer(op);

					$(this.scrollContainer).append(cusPanel);

					//this.container.appendChild(CusPanel);
				}
				CusPanel.prototype = Object.create(Autodesk.Viewing.UI.DockingPanel.prototype)
				CusPanel.prototype.constructor = CusPanel;
				return  new CusPanel(viewer, viewer.container, id, title, style); 
			},
			UploadingPanel:(viewer, id, title, style)=>{
				function UPPanel(viewer, container, id, title, style){
					this.viewer = viewer;
					Autodesk.Viewing.UI.DockingPanel.call(this, container, id, title, {});
					this.container.classList.add('docking-panel-container-solid-color-a')
					this.container.style.top = style.top;
					this.container.style.left = style.left;
					this.container.style.width = style.width;
					this.container.style.height = style.height;
					this.container.style.resize = style.resize;
					var UploadingPanel = $('#UploadingPanel')[0];

					//var op = {left:false,heightAdjustment:100,marginTop:0};
					//this.scrollcontainer = this.createScrollContainer(op);

					//$(this.scrollContainer).append(UploadingPanel);
					this.container.append(UploadingPanel);

				}
				UPPanel.prototype = Object.create(Autodesk.Viewing.UI.DockingPanel.prototype)
				UPPanel.prototype.constructor = UPPanel;
				return  new UPPanel(viewer, viewer.container, id, title, style); 
			},
			DetailPanel:(viewer, id, title, style)=>{
				function UPPanel(viewer, container, id, title, style){
					this.viewer = viewer;
					Autodesk.Viewing.UI.DockingPanel.call(this, container, id, title, {});
					this.container.classList.add('docking-panel-container-solid-color-a')
					this.container.style.top = style.top;
					this.container.style.left = style.left;
					this.container.style.width = style.width;
					this.container.style.height = style.height;
					this.container.style.resize = style.resize;
					var UploadingPanel = $('#DetailPanel')[0];

					//var op = {left:false,heightAdjustment:100,marginTop:0};
					//this.scrollcontainer = this.createScrollContainer(op);

					//$(this.scrollContainer).append(UploadingPanel);
					this.container.append(UploadingPanel);

				}
				UPPanel.prototype = Object.create(Autodesk.Viewing.UI.DockingPanel.prototype)
				UPPanel.prototype.constructor = UPPanel;
				return  new UPPanel(viewer, viewer.container, id, title, style); 
			}
			, CO2Panel: (viewer, id, title, style)=>{
				function CusPanel(viewer, container, id, title, style){
					this.viewer = viewer;
					Autodesk.Viewing.UI.DockingPanel.call(this, container, id, title, {});

					this.container.classList.add('docking-panel-container-solid-color-a');
					this.container.style.top = style.top;
					this.container.style.left = style.left;
					this.container.style.width = style.width;
					this.container.style.height = style.height;
					this.container.style.resize = style.resize;
					var CO2Panel = $('#CO2Panel')[0];
					console.log(CO2Panel)
					//$(this.scrollContainer).append(CusPanel);

					this.container.appendChild(CO2Panel);
					
				}
				CusPanel.prototype = Object.create(Autodesk.Viewing.UI.DockingPanel.prototype)
				CusPanel.prototype.constructor = CusPanel;
				return  new CusPanel(viewer, viewer.container, id, title, style); 
			}

		}
	}
}]);


service.factory('IotTalk', ['$http', '$localStorage', function($http, $localStorage){

	let spiderBase = "http://139.162.91.9:8888"

	var parse = (arr) =>{
		console.log("parse Start")
		var cal = {};
		arr.forEach(d=>{
			if((d != null) && (d.hasOwnProperty("samples"))){
				for(var i in d["samples"]){
					var val = d["samples"][i][1][0];
					//val = Math.log10(val)
					var dateTime = new Date(d["samples"][i][0]);
					var month = dateTime.getMonth() + 1;
					var dateTimeKey = dateTime.getFullYear() + "/" + month + "/" + dateTime.getDate() + "-"+ dateTime.getHours() 
					if(cal.hasOwnProperty(dateTimeKey)){
						cal[dateTimeKey].push(val)
					}else{
						cal[dateTimeKey] = [];
						cal[dateTimeKey].push(val);
					}
				}
			}
		});
		var result = {
			values: [],
			times: []
		}
		for(var key in cal){
			var avg = 0;
			for(var d in cal[key]){
				avg+=cal[key][d];
			}
			avg = avg / cal[key].length;
			result.values.push(avg);
			result.times.push(key);
		}
		return result;
	}


	return {
		outdoor_CO2: function(size, callback){
			console.log("get outdoor_CO2")
			$http({
				method:"GET",
				headers:{
					'Content-Type': 'application/json',
				},
				url:spiderBase + "/sensor/MIRC311_CO2?size=" + size
			}).then((response)=>{
				callback(parse(response.data.data))
			})
		}
		, outdoor_PM2p5: function(size, callback){
			$http({
				method:"GET",
				headers:{
					'Content-Type': 'application/json',
				},
				url:spiderBase + "/sensor/MIRC311_PM2.5?size=" + size
			}).then((response)=>{
				callback(parse(response.data.data))
			})
		}
		, outdoor_temperature: function(size, callback){
			$http({
				method:"GET",
				headers:{
					'Content-Type': 'application/json',
				},
				url:spiderBase + "/sensor/MIRC311_outdoor_Temperature?size=" + size
			}).then((response)=>{
				callback(parse(response.data.data))
			})
		}
	}

}]);


service.factory('UUID', function () {
    return {
        newuuid: function () {
            // http://www.ietf.org/rfc/rfc4122.txt
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";
            return s.join("");
        }
    }
});

