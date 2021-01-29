var express = require('express')
var app = express()
var router = express.Router(); //router메소드 불러줌.
var path = require('path') // 상대경로로 이동
var mysql = require('mysql'); //모듈 등록
const passport = require('passport');
const { authenticate } = require('passport');
var LocalStrategy = require('passport-local').Strategy

//DATABASE SETTING
var connection = mysql.createConnection({
	host : 'localhost',
	port : 3306,
	user : 'root',
	password : 'psh5746',
	database : 'jsman'
})

connection.connect()

//Router 처리!!!
router.get('/', function(req,res){
    var msg;
    var errMsg = req.flash('error')
    if(errMsg) msg = errMsg;
    res.render('login.ejs', {'message' : msg})
}); 

passport.serializeUser(function(user, done) {
    console.log('passport session save : ', user.id)
    done(null, user.id);
}); 

passport.deserializeUser(function(id, done) {
    console.log('passport session get id : ', id)
    done(null, id);
  })

passport.use('local-login', new LocalStrategy({
     usernameField: 'email',
     passwordField: 'password',
     passReqToCallback: true
    }, function(req, email, password, done){
      var query = connection.query('select * from user where email=?',[email],function(err,rows){
          if(err) return done(err);

          if(rows.length){ //email 주소가 있으면
              return done(null, {'email' : email, 'id' : rows[0].UID})
          } else{
              //message는 router.post의 info로 들어간다.
              return done(null, false, {'message' : 'your login info is not found'});
          }
      })
    }
))

 //여기선 json으로 응답을 준다 (custom callback 이용하기!)
router.post('/', function(req, res, next){
    passport.authenticate('local-login', function(err, user, info){
        if(err) res.status(500).json(err);
        if (!user) return res.status(401).json(info.message);
        req.logIn(user, function(err) {  
            //logIn으로 serializeUser 처리를 이어지게 해준다.
            //passport에서 정상적인 처리가 됬다는 것을 알려준다.
            if (err) { return next(err); }
            return res.json(user); //json으로 응답함.
        })
    })(req, res, next);
})
module.exports = router;