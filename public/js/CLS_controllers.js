var ctrl = angular.module('cls_controllers',['ng','ngStorage', 'ngCookies' ,'ui.bootstrap']);

// left menu
ctrl.controller('menuController', ['$scope', 'logoutService','$localStorage', '$cookies', function($scope ,logoutService, $localStorage, $cookies){
	var self = this;
	self.time = $localStorage.lasttime;
	self.ip = $localStorage.lastip;
	self.user = $localStorage.user;
	self.clickLogout = function(){
		logoutService.logout($localStorage.user,function(response){
			if(response == "SUC012"){
				$localStorage.user = null;
				$localStorage.tkn = null;
				$cookies.remove('vic-token');
				$scope.$emit('pageChange', {'url':'login','routering_mode':'jump'});
			}else{

			}
		});
	}

	self.clickBoard = () =>{
		$localStorage.pagmap = "profile";
		$scope.$emit('pageChange', {'url':'board','routering_mode':'jump'});
	}

	self.clickPersonal = ()=>{
		$scope.$emit('pageChange', {'url':'personal', 'routering_mode':'jump'});
	}
}]);


// main page controller
ctrl.controller('pageController', ['$scope','pageService', '$window', '$localStorage', '$cookies',function($scope, pageService, $window, $localStorage, $cookies){

	var self = this;
	$scope.pageSwitch = pageService.getPageNow();
	//接收下級改變的事件
	$scope.$on('pageChange', function(event, data){
		//console.log($localStorage.tkn);
		pageService.setPageNow(data["url"]);
		$scope.pageSwitch = pageService.getPageNow();
		if(data["routering_mode"] == 'jump'){
			if(data["url"] == "login"){
				$localStorage.user = null;
				$localStorage.tkn = null;
				$cookies.remove('vic-token');
			}
			$window.location.href = '/'+data["url"];
		}

	});
}]);

// board page controller
ctrl.controller('boardController', ['$scope', '$localStorage','projectService', '$cookies', function($scope,  $localStorage, projectService, $cookies){
	var self = this;

	//binding  project 資料
	//self.cards = projectService.getProjects();

	projectService.getProjects($localStorage.user,function(result){
		if(result){
			$scope.Allcards = result;
			self.cards = $scope.Allcards;	
		}else{
			// 如果錯誤就導向登入
			$localStorage.user = null;
			$localStorage.tkn = null;
			$scope.$emit('pageChange', {'url':'login', 'routering_mode':'jump'});
		}
	});

	//按pin
	self.click_thumb = function(click_id){
		//console.log(click_id);
		projectService.setThumbByid($localStorage.user,click_id);
	};

	// 按下新增project
	self.btnaddproject = function(){
		projectService.addProject($localStorage.user, $localStorage.tkn,function(response){

		});
	};

	// 篩選 全部
	self.btnFilterAll = function(){
		self.cards = $scope.Allcards;
	};


	// 篩選 未開始
	self.btnFilterNotStart = function(){
		var tmp = [];
		for(var p in $scope.Allcards){
			var tmpp = $scope.Allcards[p]
			if(tmpp.startdate == null && tmpp.actualEndDate == null){
				tmp.push(tmpp);
			}
		}
		self.cards = tmp;
	}

	// 篩選 執行中
	self.btnFilterDoing = function(){
		var tmp = [];
		for(var p in $scope.Allcards){
			var tmpp = $scope.Allcards[p]
			if(tmpp.startdate != null && tmpp.actualEndDate == null){
				tmp.push(tmpp);
			}
		}
		self.cards = tmp;
	}

	// 篩選 已完成
	self.btnFilterDone = function(){
		var tmp = [];
		for(var p in $scope.Allcards){
			var tmpp = $scope.Allcards[p]
			if(tmpp.startdate != null && tmpp.actualEndDate != null){
				tmp.push(tmpp);
			}
		}
		self.cards = tmp;

	}

	// 點 card 跳頁
	self.btnselectedCard = function(click_id){
		/*
		//發送事件給上級
		$localStorage.selectProject = click_id;
		$scope.$emit('pageChange', {'url':'project','routering_mode':'jump'});
		//get checks data
		*/

		$localStorage.pagmap = 'profile';
		$localStorage.selectProject = click_id;
		$scope.$emit('pageChange', {'url':'project','routering_mode':'jump'});

	};


}]);



// login page controller
ctrl.controller('loginController', ['$cookies','$scope', 'loginService', '$localStorage','tokenService', 'signupService', 'relationDataService', function($cookies, $scope, loginService,$localStorage, tokenService, signupService, relationDataService){
	var self = this;
	//binding
	$scope.errormsg = "";
	$scope.isgoodmsg = ""
	$scope.isgoodshow = false;
	$scope.iserror = false;
	$scope.loginInfo = {
		account:'',
		password:''
	};
	$localStorage.user = null;
	$localStorage.tkn = null;

	// click login button
	self.btnLogin = function(){
		tokenService.getToken($scope.loginInfo, function(r1, tkn){
			if(r1 == "SUC001"){
				$localStorage.tkn = tkn;
				$cookies.put('vic-token', tkn);
				loginService.login($scope.loginInfo, function(response,us){
					if(response=="SUC003"){
						//$localStorage.user = $scope.loginInfo["account"];
						$scope.iserror = false;
						$localStorage.user = us;
						$scope.$emit('pageChange', {'url':'board','routering_mode':'jump'});
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

	};

	$scope.signupInfo={
		account:"",
		password:"",
		password_again:"",
		firstname:"",
		lastname:"",
		mobile:"",
		tel:"",
		email:"",
		role:"",
		company_name:"",
		company_address:"",
		company_tel:""
	};
	// 角色
	relationDataService.roles(function(r){
		if(r){
			$scope.roles = r;
		}
	});

	// 選到角色 semantic dropdown
	self.dropdownselected = function(sn){
		$scope.signupInfo.role = sn.name;
	}

	self.showSignup = false;
	//開啟 signup
	self.btnSignup = function(){
		self.showSignup = !self.showSignup;
	}

	// 按下signup
	self.btnsignupOK = function(){
		signupService.signup($scope.signupInfo, function(succ2){
			// 成功 signup
			$scope.iserror = false;
			self.showSignup = false;
			$scope.signupInfo={
				account:"",
				password:"",
				password_again:"",
				firstname:"",
				lastname:"",
				mobile:"",
				tel:"",
				email:"",
				role:"",
				company_name:"",
				company_address:"",
				company_tel:""
			};
		},function(err2){
			$scope.iserror = true;
			$scope.errormsg = "帳號重複";
		});
	}
}]);

// itemchecks page controller
ctrl.controller('itemchecksController', ['$scope', 'itemchecksService', '$localStorage', function($scope, itemchecksService, $localStorage){
	var self = this;
	self.checkitems = [];
	console.log($localStorage.checkset)
	// $localStorage.selectedCheckSet 有問題 所以會一直load到同一個 checkset 的東西
	// checkset
	itemchecksService.getCheckItemsByCheckFromServer($localStorage.checkset, (code, data)=>{
		if(code === "SUC028-1"){
			for(var checkitem_index in data){
				var newData = data[checkitem_index];
				newData["checkitem_pictures"] = [];
				self.checkitems.push(newData);
				// 根據 checkitem ciid 取得 checkitem pirtures
				itemchecksService.getCheckItemPictureByCheckItemFromServer(newData.ciid, (code, checkitempicture)=>{
					if(code === "SUC029"){
						for(var checkitems_index in self.checkitems){
							for(var checkitempicture_index in checkitempicture){
								if(self.checkitems[checkitems_index]["ciid"] === checkitempicture[checkitempicture_index]["belongCheckItem"]){
									self.checkitems[checkitems_index]["checkitem_pictures"].push(checkitempicture[checkitempicture_index]);
								}
							}
						}	
					}
				});
			}
		}
	})

	self.testClickGenPDF = ()=>{
		var specialElementHandlers = {
			'div.ui.grid.container': function(element, renderer){
				return true;
			}
		};
		var doc = new jsPDF();
		//doc.utext=utf8text;
		//doc.utext(10,20,'Hello 你好.')
		doc.text('hi', 10, 10)
		doc.save('a4.pdf')
		//圖片可以用 getuserphotob64 的方式寫進pdf
		//var img = new Image();
		//console.log($localStorage.photourl);
		//img.src = $localStorage.photob64;
		//doc.addImage(img, 'PNG', 100, 50, 100, 100, 'monkey');
		/*doc.addHTML($('#data'), function(){
			doc.save('a4.pdf');

		});*/
		/*html2canvas($('#data'), {
          onrendered: function(canvas) {

			var imgWidth = (canvas.width * 20) / 100;
			var imgHeight = (canvas.height * 20) / 100; 
			var myImage = canvas.toDataURL("image/jpeg,1.0");
			doc.addImage(myImage, 'JPEG', 15, 2, imgWidth, imgHeight); // 2: 19
			doc.save('Download.pdf');
          }
       });*/
	};


}]);

// check page controller 點擊 card 後
ctrl.controller('projectController', ['$scope', 'checksService', 'projectService' ,'$localStorage', 'ProjectItemService', function( $scope, checksService, projectService, $localStorage,ProjectItemService){
	var self = this;

	/**
	init後取得所有check set
	*/
	checksService.getchecks((code, data)=>{
		if(code == "SUC027-1"){
			//console.log(data);
			$scope.checks = data;
		}
	});

	/**
	init 後 取得 project 的參與者
	*/
	projectService.getMemberOfProject($localStorage.selectProject, (result)=>{
		if(result["data"]["CODE"] == "SUC019"){
			self.projectMembers = result["data"]["result"];
		}else{
			// print error
		}
	});

	/**
	init 後 取得系統對於project的權限(levelx)
	*/
	projectService.getPermissions((result)=>{
		if(result["data"]["CODE"] == "SUC010")
			self.permissions = result["data"]["obj"];
		else{
			// print error
		}
	});
		

	/**
	init 後 取得 project 的 items, n個一組
	*/
	var n = 100;
	self.selectedItems = [];
	self.projectItems = [];
	// 頁數
	self.PIPages = [];
	projectService.getAllProjectItems((result)=>{
		if(result){
			var totalRows = result.length;
			var totalPages = Math.ceil(result.length/n);
			for(var p = 0; p < totalPages; p++){
				console.log(p)
				var last = 0;
				if(p*n+n > totalRows){
					last = totalRows;
				}else{
					last = p*n+n;
				}
				var tempArr = [];
				for(var t = p*n; t < last; t++){
					tempArr.push(result[t]);
				}
				self.projectItems.push(tempArr)	
				self.PIPages.push(p+1);
			}
			self.selectedItems = self.projectItems[0];
		}
	});

	/**
	點擊底下的 頁數
	*/
	self.clieckPISpages = (page)=>{
		self.selectedItems = self.projectItems[page-1];
	}

	/**
	新增子項目的 model
	*/
	self.NewProjectItem ={
		name:"",
		description:"",
		parent:null
	}

	/**
	點擊/選擇  project item table cell
	*/
	self.selectProjectItemCell =(selectedPI)=>{
		self.NewProjectItem.parent = selectedPI;
		$('.newPItem').modal('show');
	}

	/**
	按下 new projectitem dialog 裡面的 新增  按鈕
	*/
	self.clickCreateNewPItemInDialog = ()=>{
		if(self.NewProjectItem.name != ""){
			// service do create
			$('.newPItem').modal('hide');
			self.NewProjectItem ={
				name:"",
				description:"",
				parent:null
			}
		}
	}

	/**
	點擊查看活動裡的 card(checkset)
	*/
	self.btncheckit = (click_id)=>{
		$localStorage.checkset = click_id;

		$scope.$emit('pageChange', {'url':'itemchecks','routering_mode':'jump'});
	};
	
	/**
	點擊新增 checkset
	*/
	self.btnaddcheck = ()=>{
		$('.newCS').modal('show');
	};

	/**
	新增check set時 所需欄位
	*/
	self.newItemForm = {
		title:"",
		date:"",
		description:""
	};

	/**
	在 check set dialog 裡面的 ok 紐
	*/
	self.AddCheckDialogOk = ()=>{
		if(self.newItemForm.title !="" && self.newItemForm.date != "" && self.newItemForm.description != ""){	
			checksService.addCheck(self.newItemForm,(code, data)=>{
				if(code == "SUC027"){
					$scope.checks.push(data);
					// dismiss the dialog
					$('.newCS').modal('hide');
					//clear
					self.newItemForm = {
						title:"",
						date:"",
						description:""
					};
				}
			});
		}
	}

	/**
	* 頁面切換
	* stert
	*/

	//self single page
	self.projectViewSwitch = $localStorage.pagmap;

	//在 checksMode 切換成 profileMode
	self.btnProMode = ()=>{
		$localStorage.pagmap = 'profileMode';
		self.projectViewSwitch = $localStorage.pagmap ;
	};

	// 在 profileMode 切換成 checksMode
	self.btnChksMode = ()=>{
		$localStorage.pagmap = 'checksMode';
		self.projectViewSwitch = $localStorage.pagmap ;
	};

	// 活動頁面
	self.btnactivitysView = ()=>{
		$localStorage.pagmap = 'activity';
		self.projectViewSwitch = $localStorage.pagmap ;
	};

	// 參與者
	self.btnmemberview = ()=>{
		$localStorage.pagmap = 'member';
		self.projectViewSwitch = $localStorage.pagmap ;
		
	};

	// 項目頁面
	self.btnitemview = ()=>{
		$localStorage.pagmap = 'item';
		self.projectViewSwitch = $localStorage.pagmap ;
	};

	//  profile
	self.btnprofileview = ()=>{
		$localStorage.pagmap = 'profile';
		self.projectViewSwitch = $localStorage.pagmap ;
	};

	// gps 頁面
	self.btnGPS = ()=>{
		$localStorage.pagmap = 'gps';
		self.projectViewSwitch = $localStorage.pagmap ;
	};

	self.btnForge = ()=>{
		$localStorage.pagmap = 'forge';
		self.projectViewSwitch = $localStorage.pagmap ;
	}

	/**
	* 頁面切換
	* end
	*/

	/**
	* gps cal
	* 計算位置
	*/
	// targetPoint [,y]
	// vertex [[x,y], [x,y]....]
	self.isInArea = (targetPoint, vertex)=>{
		// 計算由 vertex 圍城的面積
		// 計算以targetPoint為主的 三角形面積和
	};


	/**
	更新參與者的 data model
	*/
	self.PM={
		account:'',
		permissions:''
	};

	/**
	更新/新增參與者
	*/
	self.clickRenewButton = ()=>{
		projectService.addProjectMember(self.PM, (result)=>{
			if(result["data"]["CODE"] == "SUC015" ){
				projectService.getMemberOfProject($localStorage.selectProject, (result)=>{
					if(result["data"]["CODE"] == "SUC019"){
						self.projectMembers = result["data"]["result"];
					}else{
						// print error
					}
				});
			}else{
				// print error
			}
			
		});
	};

	/**
	刪除參與者
	*/
	self.clickDeleteButton = ()=>{
		projectService.removeProjectMember(self.PM, (result)=>{
			if(result["data"]["CODE"] == "SUC015-2"){
				projectService.getMemberOfProject($localStorage.selectProject, (result)=>{
					if(result["data"]["CODE"] == "SUC019"){
						self.projectMembers = result["data"]["result"];
					}else{
						// print error
					}
				});
			}else{
				// print error
			}
		});

	};

	// profile info
	$scope.profileInfo = {
		identify:"",
		name:"",
		duration:"",
		startdate:"",
		estimateEndDate:"",
		actualEndDate:"",
		afterchangeDesignDate:"",
		increaseDuration:"",
		description:"",
		datetype:""
	};

	// 取得profile 資料
	projectService.getProjectProfile($localStorage.selectProject, function(result){
		if(result["data"]["CODE"] == "SUC019-2"){
			$scope.profileInfo=result["data"]["project"];
			$scope.identify = $localStorage.selectProject;
			if($scope.profileInfo.startdate)
				$scope.profileInfo.startdate = new Date($scope.profileInfo.startdate);
			if($scope.profileInfo.estimateEndDate)
				$scope.profileInfo.estimateEndDate = new Date($scope.profileInfo.estimateEndDate);
			if($scope.profileInfo.actualEndDate)
				$scope.profileInfo.actualEndDate = new Date($scope.profileInfo.actualEndDate);
			if($scope.profileInfo.afterchangeDesignDate)
				$scope.profileInfo.afterchangeDesignDate = new Date($scope.profileInfo.afterchangeDesignDate);
		}else{}
	});


	// date types
	projectService.datetypes(function(result){
		if(result){
			$scope.datetypes=result;
		}
	});

	// 點選 datetype dropdown
	self.datetypesSelected = (data)=>{
		$scope.profileInfo.datetype = data;
	};

	// 更新 profile
	self.clickUpdataProfile = ()=>{
		projectService.updateProjectProfile($scope.profileInfo, function(succ_result){

		}, function(failed_result){

		})
	};

	/**
	編輯權限
	*/
	projectService.checkEditor((result)=>{
		self.l4 = result;
	});
	
	// 點擊permissions dropdown
	self.dropdownSelectPermission = (ptype)=>{
		self.PM.permissions = ptype;
	};
	// 狀態條
	self.uploadModelVis = false;
	//ifc 上傳按鈕
	self.ifcupload = function(){
		var fd = new FormData()
		var file = document.querySelector('input[type=file]').files[0];
		if(file){
			self.uploadModelVis = true;
			self.uploadModelStatus = "檔案選擇 -> 上傳與轉檔中..."

			$('.progress.upload').progress("set progress", 50)
			// form data
			fd.append('upload', file)
			fd.append('pid', $localStorage.selectProject)
			projectService.ForgeUploadIFCModel(fd, function(uploadResult){
				
				if(uploadResult["data"]["CODE"] == "SUC030"){
					$('.progress.upload').progress("set progress", 100)
					self.uploadModelStatus = "檔案選擇 -> 上傳完成 -> 轉檔完成 -> 結束"
				}else{
					$('.progress.upload').progress("set progress", 10)
					self.uploadModelStatus = "檔案選擇 -> 上傳轉檔失敗!!!"
				}	
			});
		}
	}

}]);

// map controller
ctrl.controller('mapController', ['$scope', 'mapService', function($scope, mapService){
	var self = this;
	$scope.markerList = mapService.getLocations();
    // init the map
	$scope.map = new google.maps.Map(document.getElementById('map'), {
		center: {lng: 121.564726, lat: 25.033681},
		zoom: 8,
		scaleControl: true,
		zoomControl: true,
		draggableCursor:'crosshair'
	});

	//使用方法 是這樣 對於操作 map 的事件
	google.maps.event.addListener($scope.map, 'click', function(event) {
		//alert(event.latLng.lat());
		mapService.addLocation(event.latLng);
		$scope.markerList = mapService.getLocations();

		console.log($scope.markerList);
		// marker
		var marker = new google.maps.Marker({
			position: event.latLng,
			draggable: true,
			animation: google.maps.Animation.DROP,
			title:"Hello World!"
		});

		// To add the marker to the map, call setMap();
		marker.setMap($scope.map);

		// path
		var flightPath = new google.maps.Polygon({
			path: $scope.markerList,
			geodesic: true,
			strokeColor: '#FF0000',
			strokeOpacity: 1.0,
			strokeWeight: 2,
			fillColor: '#FF0000',
            fillOpacity: 0.1
		});
		flightPath.setMap($scope.map);
	});

	var infoWindow = new google.maps.InfoWindow({
    	cuurntontent: ""
  	});

    //load cuurnt
    $scope.loadMap = function() {
    	//var navigator = $window.navigator;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                $scope.map.setCenter(pos);
            }, function() {
                handleLocationError(true, infoWindow, $scope.map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation

            handleLocationError(false, infoWindow, $scope.map.getCenter());
        }


    };
    
    // error
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
    }

}]);


ctrl.controller('timelineController', ['$scope', function($scope){
	self = this;
	//console.log('xx');
	google.charts.load('current', {'packages':['timeline']});
	google.charts.setOnLoadCallback(function(){
	  var container = document.getElementById('timeline');
	  var chart = new google.visualization.Timeline(container);
	  var dataTable = new google.visualization.DataTable();

	  dataTable.addColumn({ type: 'string', id: 'President' });
	  dataTable.addColumn({ type: 'date', id: 'Start' });
	  dataTable.addColumn({ type: 'date', id: 'End' });
	  dataTable.addRows([
	    [ 'Washington', new Date(1789, 3, 30), new Date(1797, 2, 4) ],
	    [ 'Adams',      new Date(1797, 2, 4),  new Date(1801, 2, 4) ],
	    [ 'Jefferson',  new Date(1801, 2, 4),  new Date(1809, 2, 4) ]]);

	  chart.draw(dataTable);
	});
}]);

// personal page controller
ctrl.controller('personalcontroller', ['$scope', 'datauploaderService','personalService', '$localStorage', '$window', function($scope, datauploaderService, personalService, $localStorage, $window){
	$scope.personalInfo ={
		password:"",
		password_again:"",
		photourl:"",
		photob64:""
	}
	personalService.getuserdata($localStorage.user, function(result){
		if(result["data"]["CODE"] == "SUC009"){
			//console.log(result['data']['user']['photourl']);
			$scope.personalInfo.photourl = result['data']['user']['photourl'];
			// test
			//personalService.getuserphotob64('vic1234.jpg',function(data){
			//	$scope.personalInfo.photob64 = data["data"]["data"];
			//test
				$localStorage.photob64 = $scope.personalInfo.photob64;
			//});
			/*personalService.downloaduserphoto('all.csv', function(data){

			});
			personalService.downloadfile('12345.jpg',$localStorage.selectProject, function(data){

			})*/
		}else{
		}
	});
	//大頭照
	$scope.upload = function(){
		var fd = new FormData()
		var file = document.querySelector('input[type=file]').files[0];
		if(file){
			// form data
			fd.append('photo', file)
			datauploaderService.userphoto(fd, function(result){
				if(result["data"]["CODE"] == "SUC021"){
					$scope.personalInfo.photourl = result["data"]["photourl"];
					$window.location.reload();

				}else{

				}
			});

		}
	}
	$scope.pwd = {
		pwd1:"",
		pwd2:""
	}
	$scope.ErrMsg = false;
	$scope.currMsg = false;
	$scope.changePwd = function(){
		if($scope.pwd.pwd1 == $scope.pwd.pwd2){
			personalService.changepwd($scope.pwd.pwd1, function(result){
				console.log(result);
				$scope.ErrMsg = false;
				$scope.currMsg = true;

			});
		}else{
			$scope.ErrMsg = true;
			$scope.currMsg = false;
		}
	}
}]);


ctrl.controller('ForgeController', ['$scope', '$window', '$localStorage', '$cookies', 'ForgeService', 'ForgeExtension','UUID', 'IotTalk',function($scope, $window, $localStorage, $cookies, ForgeService, ForgeExtension, UUID, IotTalk){
	self = this;
	/*panel 照片顯示 start*/
	self.CheckItems = [];
	self.CheckItemsPictures = [];
	self.CheckItemPictureIndexes = [];
	self.ShowPictureWall = false;
	self.ShowUploadinbPanel = false;
	self.ShowCO2Panel = false;
	self.ShowDetail = false;
	self.selectedPicture = null;
	self.nowCiid = null;
	self.selectedProjectItem = null;
	//地圖上的標示
	var marker = null
	//切換dropdown 後 (原 clickPicturewallModalMenu)
	self.clickPicturewallPanel= function(ciid){
		if(self.nowCiid != ciid){
			self.CheckItemPictureIndexes = [];
			ForgeService.getCheckItemPicturesByCIID(ciid, function(pictures){
				if(pictures["CODE"] == "SUC029-1"){
					self.CheckItemsPictures = pictures["data"];
					
					for(var i = 0; i < self.CheckItemsPictures.length; i++){
						self.CheckItemPictureIndexes.push(i+1);
					}
					console.log(self.CheckItemsPictures);
					if(self.CheckItemsPictures.length > 0)
						self.selectedPicture = self.CheckItemsPictures[0];
					showMarkerMap();
				}
			})
			self.nowCiid = ciid;
		}
	}

	self.SelectPicture = function(idx){
		//if((idx-1) > 0 && (idx-1) < self.CheckItemsPictures.length)
		self.selectedPicture = self.CheckItemsPictures[idx-1];
		showMarkerMap();
	}
	self.isShowWall = function(){
		if(self.CheckItems.length > 0){
			return true;
		}else{
			return false;
		}
	}
	self.isShowUploadingPanel = function(){
		if(self.selectedProjectItem){
			return true;
		}else{
			return false;
		}
	}
	/*panel 照片顯示 end*/
	/**Map show start*/
	$scope.map = new google.maps.Map(document.getElementById('map'), {
		center: {lng: 121.564726, lat: 25.033681},
		zoom: 8,
		scaleControl: true,
		zoomControl: true,
		draggableCursor:'crosshair'
	});
	var infoWindow = new google.maps.InfoWindow({
    	cuurntontent: ""
  	});
	 //load cuurnt
    $scope.loadMap = function() {
    	//var navigator = $window.navigator;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                $scope.map.setCenter(pos);
            }, function() {
                handleLocationError(true, infoWindow, $scope.map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation

            handleLocationError(false, infoWindow, $scope.map.getCenter());
        }
    };
    
    // error
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
    }

    function showMarkerMap(){
    	if(marker){
			marker.setMap(null);
		}
		if(self.selectedPicture.latitude){
	    		marker = new google.maps.Marker({
				position: {lng: self.selectedPicture.longitude, lat: self.selectedPicture.latitude},
				draggable: true,
				animation: google.maps.Animation.DROP,
				title:"Hello World!"
			});
			marker.setMap($scope.map);
		}
    }
	/**Map show end*/
	/** 上傳照片 start*/
	self.checks = [];
	self.checkCategories = [];
	self.checkcategorytypes = [];
	self.selectedCheck = null;
	self.selectedCheckCategory = null;
	self.selectedCheckCategoryType = null;
	self.projectItems = [];
	ForgeService.getChecks(function(code, checks){
		if(code == "SUC027-1"){
			self.checks = checks;
		}
	})

	ForgeService.getCheckCategories(function(code, checkCategories){
		if(code == "SUC025-1"){
			self.checkCategories = checkCategories;
		}
	})

	ForgeService.getProjectItems(function(result){
		console.log(result)
		if(result){
			self.projectItems = result;
		}
	})

	self.didSelectedCheck = function(check){
		self.selectedCheck = check;
	}

	self.didselectCheckCategoryType = function(CheckCategoryType){
		self.selectedCheckCategoryType = CheckCategoryType;
	}

	self.didSelectedCheckCategory = function(checkCategory){
		self.selectedCheckCategory = checkCategory;
		ForgeService.getCheckCategortTypesByCheckCategory(checkCategory.name, function(code, checkcategorytypes){
			if(code == "SUC026-2"){
				self.checkcategorytypes = checkcategorytypes;
			}
		})
	}

	self.clickUploadPictures = function(){

		if(!(self.selectedCheck && self.selectedCheckCategory && self.selectedCheckCategoryType)){
			return null;
		}
		var fd = new FormData();
		var count = 0;
		var targetProjectItem = null;
		var body = {
			pid:$localStorage.selectProject,
			checkcategory:self.selectedCheckCategory.name,
			checkcategoryType:self.selectedCheckCategoryType.name,
			ResultStatus:"正確",
			description:"安安安安安安安安安",
			ciid:UUID.newuuid()
		}
		var cs = JSON.stringify({id:self.selectedCheck.id.toString(),title:self.selectedCheck.title});
		var pi = "";//JSON.stringify({id:self.selectedProjectItem});
		for(var key in self.projectItems){
			if( self.projectItems[key].bimid == self.selectedProjectItem){
				pi = JSON.stringify({id:self.projectItems[key].id});
			}
		}
		fd.append('checkset',cs);
		fd.append('projectItem', pi)
		$.each(body, function(i, d){
			fd.append(i,d)
		})
		$.each($("input[type='file']")[0].files, function(i, file) {
		   	fd.append('photo', file );
		});
		ForgeService.uploadPictures(body, fd, function(result){
			console.log(result)
		})
	}
	/** 上傳照片 end*/
	/**
	Forge Viewer start
	*/
	var viewerApp;
	ForgeService.getToken(function(accessToken){
		if(accessToken){
			var options = {
				env: 'AutodeskProduction',
				getAccessToken: function(onGetAccessToken) {
					onGetAccessToken(accessToken, 60 * 30);
				}

			};
			ForgeService.getUrn(function(documentId){
				if(documentId){
					Autodesk.Viewing.Initializer(options, function onInitialized(){
						console.log(documentId)
						viewerApp = new Autodesk.Viewing.ViewingApplication('MyViewerDiv');
						var config3d = {
						  extensions: []
						};
						viewerApp.registerViewer(viewerApp.k3D, Autodesk.Viewing.Private.GuiViewer3D, config3d);
						viewerApp.loadDocument(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
						//console.log(viewerApp)
  						//viewerApp.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onSelectionBinded);
						//console.log("initialization");
					});
				}
			})
			
		}else{
			console.log(accessToken);
		}
	});
	function onDocumentLoadSuccess(doc) {
		console.log("onDocumentLoadSuccess");

		// A document contains references to 3D and 2D viewables.
		var viewables = viewerApp.bubble.search({'type':'geometry'});
		if(viewables.length === 0) {
		    console.error('Document contains no viewables.');
		    return;
		}
		viewerApp.selectItem(viewables[0].data, onItemLoadSuccess, onItemLoadFail);
		//console.log(viewerApp.getSelectedItem());
	}	
	function onDocumentLoadFailure(viewerErrorCode) {
	    console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
	}

	function onItemLoadSuccess(viewer, item) {
		self.ShowPictureWall = true;
		self.ShowUploadinbPanel = true;
		var toolbar = new Autodesk.Viewing.UI.ControlGroup('CustomToolbar');
		var uploadingPanel = null;
		var PictureWallPanel = null;
		var CO2Panel = null
		var myChart = null;
		var detail = null;
		ForgeExtension.UI.CreateButton(viewer, this, {
			name:"showCO2",
			addClass:"CO2",
			Tip:"CO2",
			toolbar:toolbar,
			onClickEvent:(e)=>{
				if(self.selectedProjectItem == null){
					return
				}
				if(!CO2Panel){
					CO2Panel = ForgeExtension.UI.CO2Panel(viewer, "CO2", "CO2",{
						top:'0px',
						left:'0px',
						width:'500px',
						height:'500px',
						resize:'auto'
					});
				}
				CO2Panel.setVisible(!CO2Panel.isVisible());
				$('#CO2Panel').removeClass('ng-hide')
				var ctx = document.getElementById('myChart').getContext('2d');
				if(myChart != null) myChart.destroy()
				IotTalk.outdoor_CO2(-30000, co2=>{
					IotTalk.outdoor_PM2p5(-30000, pm=>{
						myChart = new Chart(ctx, {
							type: 'line',
							data: {
								labels: co2.times,
								datasets: [{
									label: 'MIRC311_CO2 平均',
									data: co2.values,
									borderWidth: 1,
									backgroundColor: 'rgb(0, 255, 0, 0.1)',
									borderColor: 'rgb(0, 255, 0, 0.8)'
								},
								{
									label: 'MIRC311_PM2.5 平均',
									data: pm.values,
									borderWidth: 1,
									backgroundColor: 'rgb(0, 150,200, 0.1)',
									borderColor: 'rgb(0, 150, 200, 0.8)'
								}]
							},
							options: {
								scales: {
									yAxes: [{
										ticks: {
											beginAtZero: true
										}
									}]
								}
							}
						});
					})
				});
			},
		});
		//  ForgeExtension.UI.CreateButton(viewer, this, {
		//  	name:"UploadPictureButton",
		//  	addClass:"UploadPictureButton",
		//  	Tip:"最近資料",
		//  	toolbar:toolbar,
		//  	onClickEvent:(e)=>{
		//  		if(!detail){
		// 			detail = ForgeExtension.UI.DetailPanel(viewer, "最近資料", "2020/01/22 11:30",{
		//  				top:'0px',
		//  				left:'0px',
		//  				width:'auto',
		//  				height:'auto',
		//  				resize:'auto'
		//  			});
		//  		}
		// 		 detail.setVisible(!detail.isVisible());
		// 		 $('#DetailPanel').removeClass('ng-hide')
		//  	},
		//  })
		// ForgeExtension.UI.CreateButton(viewer, this, {
		// 	name:"ShowPanelButton",
		// 	addClass:"ShowPanelButton",
		// 	Tip:"Show Panel",
		// 	toolbar:toolbar,
		// 	onClickEvent:(e)=>{
		// 		if(!PictureWallPanel){
		// 			PictureWallPanel = ForgeExtension.UI.MyPanel(viewer, "my_panel", 'Test Panel',{
		// 				top:'0px',
		// 				left:'0px',
		// 				width:'auto',
		// 				height:'auto',
		// 				resize:'auto'
		// 			})
		// 		}
		// 		PictureWallPanel.setVisible(!PictureWallPanel.isVisible());
		// 	}
		// })
		// 392c5f13-43a3-4729-b381-68b197d2f229-IOT-測試-IOT-圍束區位置-PR柱1-2019-11-23@0.0@0.0 16:31:50
		viewer.toolbar.addControl(toolbar);
		// 使用 Event 選擇元件事件
		ForgeExtension.Event.SelectedEvent(viewer, this, "rvt", function(Prop){
			if(Prop){
				if(Prop.hasOwnProperty('name')){
					self.selectedProjectItem = Prop.name.match("\[[0-9]*\]")[0].match(".?([0-9]*)")[1];
					ForgeService.checkProjectItemIsExist(self.selectedProjectItem, function(data){
						if(!data){
							self.selectedProjectItem = null
							if(CO2Panel){
								CO2Panel.setVisible(false);
							}
						}else{
							console.log(Prop)
							console.log(self.selectedProjectItem)
						}
					})
				}else{
					self.selectedProjectItem = null
					if(CO2Panel){
						CO2Panel.setVisible(false);
					}
				}
			}
			
		})
		
	}

	function onItemLoadFail(errorCode) {
		console.error('onItemLoadFail() - errorCode:' + errorCode);
	}

	/**
	Forge Viewer end
	*/
}]);