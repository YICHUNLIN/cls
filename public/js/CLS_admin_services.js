var service = angular.module('cls_admin_services',[]);
var api_addr = "http://localhost:9453"
service.factory('AdminPageService',function(){
	var pageNow = 'SystemView'

	return{
		pageChange:(newpage)=>{
			pageNow = newpage;
			return pageNow;
		},
		getPageNow:()=>{
			return pageNow;
		}

	}
});

service.factory('AdminUserService', ['$http','$localStorage', function($http, $localStorage){
	

	return{
		getUsers:(fn)=>{
			$http({
				method:'GET',
				headers: {
					'Content-Type': 'application/json',
					'vic-token':$localStorage.adtkn
				},
				url:api_addr+'/api/user/all'
			}).then((response)=>{
				fn(response["data"]["CODE"],response["data"]["users"]);
			},(response)=>{
				fn(response["data"]["CODE"]);
			});
		},
		createUsers:(signupInfo, fn)=>{

		},
		updateUsers:(userInfo, fn)=>{

		}
	};
}])

service.factory('GroupService',['$http','$localStorage', function($http, $localStorage){

	var groups = [];
	var usergroups = [];

	return {
		getGroups:(fn)=>{
			$http({
				method:'GET',
				headers: {
					'Content-Type': 'application/json',
					'vic-token':$localStorage.adtkn
				},
				url:api_addr+'/api/admin/groups'
			}).then((response)=>{
				//console.log(response);
				fn(response["data"]["CODE"], response["data"]['groups']);
			},(response)=>{
				fn(response);
			});
		},
		createGroup:(gname, fn)=>{
			$http({
				method:'POST',
				headers: {
					'Content-Type': 'application/json',
					'vic-token':$localStorage.adtkn
				},
				data:{
					gname:gname
				},
				url:api_addr+'/api/admin/group/create'
			}).then((response)=>{
				fn(response["data"]["CODE"]);
			},(response)=>{
				fn(response);
			});
		},
		deleteGroup:(gname, fn)=>{
			$http({
				method:'POST',
				headers: {
					'Content-Type': 'application/json',
					'vic-token':$localStorage.adtkn
				},
				data:{
					gname:gname
				},
				url:api_addr+'/api/admin/group/destroy'
			}).then((response)=>{
				fn(response["data"]["CODE"]);
			},(response)=>{
				fn(response);
			});
		},
		addUserToGroup:(fields, fn)=>{
			$http({
				method:"POST",
				headers:{
					'Content-Type': 'application/json',
					'vic-token':$localStorage.adtkn
				},
				data:{
					account:fields.account,
					gname:fields.group
				},
				url:api_addr+"/api/admin/group/setuser"
			}).then((response)=>{
				fn(response['data']['CODE']);
			},(response)=>{
				fn(response['data']['CODE']);
			})
		},
		deleteUserFromGroup:(fields, fn)=>{
			$http({
				method:"POST",
				headers:{
					'Content-Type': 'application/json',
					'vic-token':$localStorage.adtkn
				},
				data:{
					account:fields.account,
					group:fields.group
				},
				url:api_addr+"/api/admin/group/deleteuser"
			}).then((response)=>{
				fn(response['data']['CODE']);
			},(response)=>{
				fn(response['data']['CODE']);
			})
		},
		getusergroup:(fn)=>{
			$http({
				method:"GET",
				headers:{
					'Content-Type': 'application/json',
					'vic-token':$localStorage.adtkn
				},
				url:api_addr+'/api/admin/group/getuog'
			}).then((response)=>{
				fn(response["data"]);
			},(response)=>{

			})
		}

	};
}]);

service.factory('LoginService', ['$http', '$localStorage',function($http, $localStorage){
	return{
		login:(info, fn)=>{
			$http({
				method:'POST',
				headers:{
					'Content-Type': 'application/json',
					'vic-token': $localStorage.adtkn
				},
				data:info,
				url:api_addr+'/api/user/adlogin'
			}).then((response)=>{
				fn(response["data"]["CODE"],response["data"]["user"]);
				$localStorage.lasttime = response["data"]["time"];
				$localStorage.lastip = response["data"]["loginip"];
			},(response)=>{
				fn(response["data"]["CODE"]);
			});
		},
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
				fn(response['data']['CODE'],response['data']['token']);
			}, function error(response){
				fn(esponse['data']['CODE'],null);
			});
		}
	}
}]);


service.factory('CategoryService', ['$http', '$localStorage', function($http, $localStorage){
	return{
		getprojectItemCategories:(fn)=>{
			$http({
				method:'GET',
				headers:{
					'Content-Type': 'application/json',
					'vic-token': $localStorage.adtkn
				},
				url:api_addr+'/api/admin/item/category'

			}).then((succ)=>{
				fn(succ['data']['CODE'], succ['data']['categories']);
			}, (failed)=>{
				fn(failed['data']['CODE']);
			})
		},
		addorupdateProjectItemCategories:(categoryFields, fn)=>{
			$http({
				method:'POST',
				headers:{
					'Content-Type': 'application/json',
					'vic-token': $localStorage.adtkn
				},
				data:{
					cname:categoryFields.category_name,
					description:categoryFields.category_description
				},
				url:api_addr+'/api/admin/item/category/create'

			}).then((succ)=>{
				fn(succ['data']['CODE']);
			}, (failed)=>{
				fn(failed['data']['CODE']);
			})
		},
		deleteProjectItemCategory:(name,fn)=>{
			$http({
				method:'POST',
				headers:{
					'Content-Type': 'application/json',
					'vic-token': $localStorage.adtkn
				},
				data:{
					name:name
				},
				url:api_addr+'/api/admin/item/category/destroy'

			}).then((succ)=>{
				fn(succ['data']['CODE']);
			}, (failed)=>{
				fn(failed['data']['CODE']);
			})
		},
		addorupdateCheckCategory:(checkcategoryField, fn)=>{
			$http({
				method:'POST',
				headers:{
					'Content-Type': 'application/json',
					'vic-token': $localStorage.adtkn
				},
				data:{
					name:checkcategoryField.Checkcategory_name,
					projectietrmcategory:checkcategoryField.Checkcategory_description
				},
				url:api_addr+'/api/admin/checkcategory/create'

			}).then((succ)=>{
				fn(succ['data']['CODE']);
			}, (failed)=>{
				fn(failed['data']['CODE']);
			})
		},
		getCheckCategory:(fn)=>{
			$http({
				method:'GET',
				headers:{
					'Content-Type': 'application/json',
					'vic-token': $localStorage.adtkn
				},
				url:api_addr+'/api/admin/checkcategory'

			}).then((succ)=>{
				fn(succ['data']['CODE'], succ['data']['checkcategories']);
			}, (failed)=>{
				fn(failed['data']['CODE']);
			})
		},
		delectCheckCategory:(name, fn)=>{
			$http({
				method:'POST',
				headers:{
					'Content-Type': 'application/json',
					'vic-token': $localStorage.adtkn
				},
				data:{
					name:name
				},
				url:api_addr+'/api/admin/checkcategory/destroy'

			}).then((succ)=>{
				fn(succ['data']['CODE']);
			}, (failed)=>{
				fn(failed['data']['CODE']);
			})
		},
		// CheckCategoryTypes
		getCheckCategoryTypesByCheckCategory:(ccname, fn)=>{
			$http({
				method:'POST',
				headers:{
					'Content-Type': 'application/json',
					'vic-token': $localStorage.adtkn
				},
				data:{
					checkcategory:ccname
				},
				url:api_addr+'/api/admin/checkcategorytypes'

			}).then((succ)=>{
				fn(succ['data']['CODE'], succ['data']['checkcategorytypes']);
			}, (failed)=>{
				fn(failed['data']['CODE']);
			})
		},
		addCheckCategoryTypes:(ccname, cctypename, fn)=>{
			$http({
				method:'POST',
				headers:{
					'Content-Type': 'application/json',
					'vic-token': $localStorage.adtkn
				},
				data:{
					parentcheckcategory:ccname,
					name:cctypename
				},
				url:api_addr+"/api/admin/checkcategorytype/create"
			}).then((succ)=>{
				fn(succ['data']['CODE']);
			},(failed)=>{
				fn(failed['data']['CODE']);
			})
		},
		deleteCHeckCategoryTypes:(ccname, cctypename, fn)=>{
			$http({
				method:'POST',
				headers:{
					'Content-Type': 'application/json',
					'vic-token': $localStorage.adtkn
				},
				data:{
					parentcheckcategory:ccname,
					name:cctypename
				},
				url:api_addr+"/api/admin/checkcategorytype/destroy"
			}).then((succ)=>{
				fn(succ['data']['CODE']);
			},(failed)=>{
				fn(failed['data']['CODE']);
			})
		}
	};
}]);

