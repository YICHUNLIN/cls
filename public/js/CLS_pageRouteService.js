var service = angular.module('CLS_pageRouteService',[]);

var api_addr = "http://localhost:9453";

service.factory('PageRoute', ['$http','$localStorage', function($http, $localStorage){
	return{
		goto:(page)=>{
			$http({
				method:'GET',
				headers: {
					'Content-Type': 'application/json',
					'vic-token':$localStorage.tkn
				},
				url:api_addr+page
			});
		}
	}
}])