// use express
var express = require('express');
// use path
var path = require('path');
// use cookie parser
var cookieParser = require('cookie-parser');
//var session = require('express-session');
//var FileStore = require('session-file-store')(session);
// use body parser
var bodyParser = require('body-parser');
// use morgan
var logger = require('morgan');
//
var compression = require('compression');
//
var cors = require('cors');
// jwt
//var jwt = require('jwt-express');
var jwt = require('jwt-simple');
// passport
//var Passport = require( 'passport' );
//var LocalStrategy = require( 'passport-local' ).Strategy;

// helmet
var helmet = require('helmet');

// self
var pagerouter = require('./route/pageroute');
var adminpageroute = require('./route/adminpage')
var admin = require('./route/admin');
var user = require('./route/user');
var auth = require('./route/auth');
var board = require('./route/project');
var uploader = require('./route/upload');
var items = require('./route/items');
var check = require('./route/check');
var forge = require('./route/forge')
var coor = require('./route/coorConverter')
var codes = require('./codedefine');



var tokenAuth = require('./route/apiprotected').tokenAuth;
var pageAuth = require('./route/pageProtected').loginAuth;
var adPageAuth = require('./route/pageProtected').adloginAuth;


// new
var AuthCtrl = require('./Ctrl/authCtrl');

//var Ctrls = require('./Ctrl/ctrls');

var app = express();

//var server = require('http').createServer(app);
//var io = require('socket.io').listen(server);
app.set('port',process.env.PORT || 9453);
//app.set('semantic', path.join(__dirname, 'semantic'));
app.set('views', path.join(__dirname, 'views'));

//app.engine('handlebars', handlebars.engine);
app.set('view engine', 'jade');

//app.set('hello', '123');

var IsInit = false;
if(IsInit){
  var initCtrl = require('./Ctrl/initCtrl')
  initCtrl.permissionInit((result1)=>{
    initCtrl.groupInit((result2)=>{
      initCtrl.adminAccount((result3)=>{
        initCtrl.checkcategory((result4)=>{
          initCtrl.normalAccount((result5)=>{

          })
        })
      })
    })
  })
}
var isTest = false;

// jwt

// use 3rd party
app.use(logger('dev'));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/resource',express.static(path.join(__dirname, 'resource')));
app.use('/semantic',express.static(path.join(__dirname, 'semantic')));
app.use(cors());
// security helmet
app.use(helmet());

//app.use('/initsystem',initsystem);
//app.use(pageAuth);
if(!isTest)
  app.use(AuthCtrl.loginAuth);
app.use('/', pagerouter);

//app.use(adPageAuth);

if(!isTest)
  app.use(AuthCtrl.adloginAuth)
app.use('/ad', adminpageroute);

// token auth 第一次使用要先關掉
//app.use(tokenAuth);

if(!isTest)
  app.use(AuthCtrl.tokenAuth)
//app.use(AuthCtrl.tokenAuth)
app.use('/api/upload', uploader);
app.use('/api/admin', admin);
app.use('/api/user',user);
app.use('/api/auth', auth);
app.use('/api/board', board);
app.use('/api/item',items);
app.use('/api/check',check);
app.use('/api/forge', forge);
app.use('/api/coor', coor);

app.use(function(req, res, next){
  var err = new Error('Not found');
  err.status = 404;
  next(err);
});

/*
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send('500 - server error');
  });
}
*/
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send('500 - server error');
    
});
/*
var onlineCount = 0;

// 當發生連線事件
io.on('connection', (socket) => {
    onlineCount ++;
    //送人數到前面
    io.emit("online", onlineCount);
    // 當發生離線事件
    socket.on('disconnect', () => {
        onlineCount = (onlineCount < 0) ? 0 : onlineCount-=1;
        io.emit("online", onlineCount);
    });
});
*/
app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:'+ app.get('port') + '; press Ctrl-C to terminate.');
});

