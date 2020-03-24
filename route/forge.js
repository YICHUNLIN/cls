var express = require('express');
var router = express.Router();
var forgeCtrl = require('../Ctrl/forgeCtrl')
var projectCtrl = require('../Ctrl/projectCtrl')
var request = require('request');
var fs = require('fs');
var multer = require('multer');
var ForgeUploader = require('../Ctrl/forgeUploader') 
//const upload = multer({ dest: './tmp' });
var base64 = require('base-64');
var utf8 = require('utf8');
var client_id = 'iJQkR3kold9Ea5V2kAFI0KEapnZj98gO';
var client_secret = 'tQ1i37NqxGopbke8';
//var bucketKey = 'viclin_testing_bucket3';
var bucketKey="boiler";
var codes = require('../codedefine');

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
		callback(null, './BIMmodel');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
var upload = multer({ storage: storage })
function defaultHandleError(err) {
	console.error('\x1b[31m Error:', err, '\x1b[0m' ) ;
}

router.get('/getToken', (req, res)=>{
	var oa2Object = forgeCtrl.oAuth2TwoLeggedObject(client_id, client_secret, ['viewables:read', 'data:read', 'data:write', 'bucket:create', 'bucket:read'])

	forgeCtrl.credentials(oa2Object, (credentials)=>{
		res.json(credentials);
	})
})

router.get('/buckets', (req, res)=>{
	var oa2Object = forgeCtrl.oAuth2TwoLeggedObject(client_id, client_secret, ['viewables:read', 'data:read', 'data:write', 'bucket:create', 'bucket:read'])
	forgeCtrl.credentials(oa2Object, (credentials)=>{
		forgeCtrl.getBuckets(oa2Object, credentials, (buckets)=>{
			res.json({"Result":buckets});
		});
	});
})

router.get('/hubs', (req, res)=>{

	var oa2Object = forgeCtrl.oAuth2TwoLeggedObject(client_id, client_secret, ['viewables:read', 'data:read', 'data:write', 'bucket:create', 'bucket:read'])
	forgeCtrl.credentials(oa2Object, (credentials)=>{
		forgeCtrl.getHubs(oa2Object, credentials, (response)=>{
			res.json({"Result":response});
		});
	});
})

/**
* @method GET
* 取得URN
* URL /:pid/urn
*/
router.get('/urn/:pid', (req, res)=>{
	projectCtrl.GetProjectUrn(req.params.pid, function(result){
		if(result){
			console.log(codes.forge.getUrnSuccess)
			res.json({URN:result, CODE:codes.forge.getUrnSuccess});
		}else{
			res.json({URN:null, CODE:codes.forge.getUrnField});
		}
	})
})


//1
router.post('/uploadfile', upload.single('upload'), (req, res)=>{
    
    //var contentLength = req.file.size;
    //console.log(new Buffer(req.file.buffer));
	var oa2Object = forgeCtrl.oAuth2TwoLeggedObject(client_id, client_secret, ['viewables:read', 'data:read', 'data:write','bucket:create', 'bucket:read'])
	
	ForgeUploader(bucketKey, req.file.originalname, req.file.path, oa2Object, function(urn){
		console.log("上傳完成..." + urn);
		projectCtrl.UploadURNbyId(req.body.pid, urn, function(result){
			res.json({"CODE":codes.forge.uploaderSuccess});
		})
	});
})

//2
router.post('/translateSVF', (req, res)=>{
	if(!req.body.b64urn) return res.json({"error":"body error"})
	var oa2Object = forgeCtrl.oAuth2TwoLeggedObject(client_id, client_secret, ['viewables:read', 'data:read','data:write', 'bucket:create', 'bucket:read'])
	forgeCtrl.credentials(oa2Object, (credentials)=>{
		var job = {
			"input":{
				"urn":req.body.b64urn
			},"output":{
				"formats":[{
					"type":"svf",
					"views":["2d","3d"]
				}]
			}
		}
		forgeCtrl.translateSVF(job, oa2Object, credentials).then((success)=>{
			console.log(success);
			res.json({"result":success})
		}, (error)=>{
			res.json({"result":error})
		})
	});
});

router.post('/getManifest', (req, res)=>{
	if(!req.body.urn) return res.json({"error":"no urn"});
	var oa2Object = forgeCtrl.oAuth2TwoLeggedObject(client_id, client_secret, ['viewables:read', 'data:read', 'data:write', 'bucket:create', 'bucket:read'])
	forgeCtrl.credentials(oa2Object, (credentials)=>{
		forgeCtrl.getManifest(req.body.urn, oa2Object, credentials, function(response){
			res.json({"Result":response})
		})
	});
})

router.get('/bucketObjects', (req, res)=>{
	var oa2Object = forgeCtrl.oAuth2TwoLeggedObject(client_id, client_secret, ['viewables:read', 'data:read', 'data:write', 'bucket:create', 'bucket:read'])
	forgeCtrl.credentials(oa2Object, (credentials)=>{
		
		forgeCtrl.getObjects(bucketKey, oa2Object, credentials, function(response){
			res.json(response);
		})
	});
})

router.get('/test', (req, res)=>{
	var parm = {
		method:'GET',
		url:'https://www.macys.com/shop/catalog/product/newthumbnail/json?productId=2451215&source=100',
		header:{
			'Content-Type':'application/json'
		}
	};
	request(parm,(err, response, body)=>{
		res.json({err:err, response:response, body:body});
	})
	
})

module.exports = router;

