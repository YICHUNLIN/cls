var ForgeSDK = require('forge-apis');
var ObjectsApi = new ForgeSDK.ObjectsApi();
var BucketsApi = new ForgeSDK.BucketsApi(); //Buckets Client
var DerivativesApi = new ForgeSDK.DerivativesApi();
var ForderApi = new ForgeSDK.FoldersApi();
var ActivitiesApi = new ForgeSDK.ActivitiesApi();
var HubsApi = new ForgeSDK.HubsApi();
var request = require('request');
var autoRefresh = true; // or false

var fs = require('fs');
 
var uploader = require('./forgeUploader') 



module.exports = {

	oAuth2TwoLeggedObject:(client_id, client_secret, scope)=>{
		return new ForgeSDK.AuthClientTwoLegged(client_id, client_secret, scope, autoRefresh);
	},
	credentials:(oa22lo, callback)=>{
		oa22lo.authenticate().then(function(credentials){
			callback(credentials);
		}, function(err){
		    console.error(err);
		});
	},
	getBuckets:(oa22lo, credentials, callback)=>{
		BucketsApi.getBuckets({}, oa22lo, credentials).then(function(buckets){
		    callback(buckets);
		}, function(err){
		     console.error(err);
		});
	},
	uploadObject:function(bucket, objName, length, data, oAuth2TwoLeggedObj, tkn, callback){

		ObjectsApi.uploadObject(bucket,objName,length,data,{},oAuth2TwoLeggedObj,tkn
	    ).then((uploadResponse) => {
	    	console.log(uploadResponse)
	        callback(uploadResponse);
	    }, (error) => {
	        callback(null)
	    });
	},
	translateSVF:function(job, oa22lo, credentials){

		return new Promise(function(resolve, reject) {
		    DerivativesApi.translate(job, {}, oa22lo, credentials).then(
		        function(res){
					console.log("success")
		        	console.log(res);
		            resolve(res);
		        },function(err){
					console.log("error")
		        	console.log(err);
		            reject(err);
		        }
		    )   

		});
	},
	getManifest:function(urn,oa22lo, credentials, callback){
		DerivativesApi.getManifest(urn,"",oa22lo, credentials).then(function(manifstResponse){
			callback(manifstResponse);
		},function(error){
			console.log(error);
			callback(null);
		})
	},
	createBucket:(payload, oa22lo, credentials)=>{

	},
	getObjects:(bucketKey, oa22lo, credentials,callback)=>{
		ObjectsApi.getObjects(bucketKey, {}, oa22lo, credentials).then((objectsResponse)=>{
			callback(objectsResponse.body.items);
		},(error)=>{
			console.log(error);
			callback(null);
		})
	},getHubs:(oa22lo, credentials, callback)=>{
		HubsApi.getHubs({},oa22lo, credentials).then((hubsResponse)=>{
			callback(hubsResponse);
		}, (error)=>{
			console.log(error);
			callback(null);
		})
	},
	newUploader:(bucketkey, filename, filePath, oAuth2TwoLegged, callback)=>{
		
	}

}