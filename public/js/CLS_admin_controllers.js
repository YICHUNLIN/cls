var ctrl = angular.module('cls_admin_controllers',['ng', 'ngCookies','ngStorage']);


ctrl.controller('adminPageController', ['$scope','$localStorage', 'AdminPageService', '$window', '$cookies', function($scope , $localStorage, AdminPageService, $window, $cookies){
	var self = this;
	if($localStorage.adtkn && $localStorage.aduser){
		AdminPageService.pageChange("SystemView");
		self.pageSwitchOn = AdminPageService.getPageNow();
	}
	self.pageSwitchOn = AdminPageService.getPageNow();
	//self.isLogin = ()=>{
	//	return AdminPageService.getPageNow() == "Login";
	//}

	//main page route
	$scope.$on('pageChange', (event, data)=>{
		AdminPageService.pageChange(data);
		self.pageSwitchOn = AdminPageService.getPageNow();

	});

	$scope.$on('v2PageChange', (event, data)=>{
		if(data == 'login'){
			$localStorage.adtkn = null;
			$localStorage.aduser = null;
			$cookies.remove('vic-token');		
		}
		$window.location.href = '/ad/'+data;
	})
	
}]);


ctrl.controller('LoginController', ['$scope', '$localStorage', 'LoginService', '$cookies',function($scope, $localStorage, LoginService, $cookies){
	var self = this;

	$scope.loginInfo = {
		account:'',
		password:''
	};

	self.clickLogin = ()=>{
		LoginService.getToken($scope.loginInfo, function(r1, tkn){
			if(r1 == "SUC001"){
				$localStorage.adtkn = tkn;
				$cookies.put('vic-token', tkn);
				LoginService.login($scope.loginInfo, function(response,us){
					if(response=="SUC003"){
						$scope.iserror = false;
						$localStorage.aduser = us;
						$scope.$emit('v2PageChange', "main");
					}else{
						$scope.iserror = true;
						$scope.errormsg = "* 帳號或密碼錯誤";
					}
				});
			}else{
				$scope.iserror = true;
				$scope.errormsg = "* 帳號或密碼錯誤";
			}
		});
	}
}]);

ctrl.controller('MenuController', ['$scope', '$localStorage', '$cookies',function($scope, $localStorage, $cookies){
	var self = this;
	self.changePager = (newpage)=>{
		$scope.$emit('pageChange', newpage);
	};
	self.user = $localStorage.aduser;
	//console.log(self.user);
	self.clickLogout = ()=>{
		$localStorage.adtkn = null;
		$localStorage.aduser = null;
		$cookies.remove('vic-token');
		$scope.$emit('v2PageChange', "login");
	}
}]);

ctrl.controller('UserViewController', ['$scope', 'AdminUserService', function($scope, AdminUserService){
	var self = this;
	self.form_mode = 'CLOSE';
	self.users = [];
	self.clickAdd = ()=>{
		if(self.form_mode == 'CREATE'){
			self.form_mode = 'CLOSE';
		}else{
			self.form_mode = 'CREATE'
		}
	}

	self.clickEdit = ()=>{
		if(self.form_mode == 'EDIT'){
			self.form_mode = 'CLOSE';
		}else{
			self.form_mode = 'EDIT'
		}
	}

	self.showForm = ()=>{
		return self.form_mode != 'CLOSE'
	}

	AdminUserService.getUsers(function(code, users){

		if(code == "SUC009-1"){
			self.users = users
		}else{

		}
	})
}]);

ctrl.controller('GroupController', ['$scope', '$localStorage', 'GroupService',function($scope, $localStorage, GroupService){
	var self = this;
	self.groups = [];
	GroupService.getGroups((code, groups)=>{
		if(code == "SUC018-1"){
			self.groups = groups;
		}else{

		}
	});


	//新增刪除用
	self.groupname = "";
	self.clickaddGroup = ()=>{
		if(self.groupname != ""){
			GroupService.createGroup(self.groupname, (result)=>{
				if(result == "SUC018"){
					self.groupname = "";
					GroupService.getGroups((code, groups)=>{
						if(code == "SUC018-1"){
							self.groups = groups;
						}
					});
				}else{

					// 顯示重複
				}
			});	
		}
	};

	self.clickDeleteGroup = ()=>{
		GroupService.deleteGroup(self.groupname, (code)=>{
			if(code == "SUC018-5"){
				self.groupname = "";
				GroupService.getGroups((code, groups)=>{
					if(code == "SUC018-1"){
						self.groups = groups;
					}
				});
			}else{

			}
		})
	};

	//新增 使用者群組的欄位
	self.ugfields = {
		account:'',
		group:''
	};
	self.usergroups = [];
	GroupService.getusergroup((gous)=>{
		self.usergroups = gous;
	});

	//刪除
	self.clickDeleteUserGroup = ()=>{
		GroupService.deleteUserFromGroup(self.ugfields, function(code){

			GroupService.getusergroup((gous)=>{
				self.usergroups = gous;
			});
		})
	};

	//新增
	self.clickAddUserGroup = ()=>{
		GroupService.addUserToGroup(self.ugfields, function(result){

			GroupService.getusergroup((gous)=>{
				self.usergroups = gous;
			});
		});
	}
}]);




ctrl.controller('TemplateController', ['$scope', '$localStorage', 'CategoryService',function($scope, $localStorage, CategoryService){
	var self = this;
	self.projectItemCategories = [];
	CategoryService.getprojectItemCategories((code, categories)=>{
		if(code=="SUC024"){
			self.projectItemCategories = categories;
		}
	},(code)=>{

	})

	self.categoryField = {
		category_name:'',
		category_description:''
	}

	// 新增 Project Item Category
	self.clickProjectItemCategoryAdd = ()=>{
		CategoryService.addorupdateProjectItemCategories(self.categoryField, (code)=>{
			if(code == "SUC024-2"){
				CategoryService.getprojectItemCategories((code, categories)=>{
					if(code=="SUC024" || code == "SUC024-1"){
						self.categoryField = {
							category_name:'',
							category_description:''
						}
						self.projectItemCategories = categories;
					}
				},(code)=>{

				})
			}else{

			}
		})
	}

	self.clickDeleteProjectItemCategory = ()=>{
		CategoryService.deleteProjectItemCategory(self.categoryField.category_name, (code)=>{
			console.log(code);
			if(code == "SUC024-3"){
				CategoryService.getprojectItemCategories((code, categories)=>{
					if(code=="SUC024" || code == "SUC024-1"){
						self.categoryField = {
							category_name:'',
							category_description:''
						}
						self.projectItemCategories = categories;
					}
				},(code)=>{

				})
			}else{

			}
		});
	};

	/*-----*/
	self.checkcategoryField = {
		Checkcategory_name:'',
		Checkcategory_description:''
	}
	self.checkcategories = [];
	CategoryService.getCheckCategory(function(code, checkcategories){
		self.checkcategories = checkcategories;
	})

	//新增 Check Category
	self.clickCheckCategoryAdd = ()=>{
		CategoryService.addorupdateCheckCategory(self.checkcategoryField, function(code){
			if(code=="SUC025"){
				console.log(self.checkcategoryField);
				self.checkcategoryField = {
					Checkcategory_name:'',
					Checkcategory_description:''
				}
				CategoryService.getCheckCategory(function(code2, checkcategories){
					self.checkcategories = checkcategories;
				});
			}else{

			}
		});
	}

	//按下刪除 勘驗項目
	self.clickDeleteCheckCategory = ()=>{
		CategoryService.delectCheckCategory(self.checkcategoryField.Checkcategory_name, function(code){
			if(code == "SUC025-2" ){
				self.checkcategoryField = {
					Checkcategory_name:'',
					Checkcategory_description:''
				}
				CategoryService.getCheckCategory(function(code2, checkcategories){
					self.checkcategories = checkcategories;
				});
			}
		})
	}

	self.selectedCheckCategoryTypes = [];
	// 選擇 勘驗項目的row
	self.selectedCheckCategory = null;
	self.selectCheckCategory = (selected)=>{
		self.selectedCheckCategory = selected;
		CategoryService.getCheckCategoryTypesByCheckCategory(self.selectedCheckCategory,function(code,checkcategorytypes){	
			if(code == "SUC026-2"){
				self.selectedCheckCategoryTypes = checkcategorytypes;
			}else{
			}
		})
	}
	self.checkcategorytypeNameField = '';
	// check category type update event
	self.clickCheckCategoryTypeUpdate = ()=>{
		CategoryService.addCheckCategoryTypes(self.selectedCheckCategory, self.checkcategorytypeNameField, function(code){
			if(code == "SUC026"){
				CategoryService.getCheckCategoryTypesByCheckCategory(self.selectedCheckCategory,function(code,checkcategorytypes){
					if(code == "SUC026-2"){
						self.selectedCheckCategoryTypes = checkcategorytypes;
						self.checkcategorytypeNameField = '';
					}else{
					}
				})
			}else{
			}
		});
	};
	// delete check category type event
	self.clickDeleteCheckCategoryType = ()=>{
		CategoryService.deleteCHeckCategoryTypes(self.selectedCheckCategory, self.checkcategorytypeNameField, function(code){
			if(code == "SUC026-1"){
				CategoryService.getCheckCategoryTypesByCheckCategory(self.selectedCheckCategory,function(code,checkcategorytypes){
					if(code == "SUC026-2"){
						self.selectedCheckCategoryTypes = checkcategorytypes;
						self.checkcategorytypeNameField = '';
					}else{
					}
				})
			}else{
				
			}
		});
	}


}]);




