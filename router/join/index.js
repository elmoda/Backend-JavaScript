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
    res.render('join.ejs', {'message' : msg})
}); 

//user라는 객체이름으로 반환하여 user.id로 접근해서 사용가능하다.
//그 값을 session에 저장한다.
passport.serializeUser(function(user, done) {
    console.log('passport session save : ', user.id)
    done(null, user.id);
}); 

passport.deserializeUser(function(id, done) {
    //섹션 값에서 id 값만 뽑아서 전달 해주는 역할이다.
    console.log('passport session get id : ', id)
    done(null, id);
  })

passport.use('local-join', new LocalStrategy({
     usernameField: 'email',
     passwordField: 'password',
     passReqToCallback: true
    }, function(req, email, password, done){
      //console.log('local-goin callback called');
      var query = connection.query('select * from user where email=?',[email],function(err,row){
          if(err) return done(err);

          if(row.length){
              console.log('existed user')
              return done(null, false, {message : 'your email is already used'})
          } else{
              var sql = {email : email, pw : password};
              var query = connection.query('insert into user set ?', sql, function(err,rows){
                  if(err) throw err
                  return done(null, {'email' : email, 'id' : rows.insertId})
              })
          }
      })
    }
))

router.post('/',passport.authenticate('local-join',{
    successRedirect: '/main',
    failureRedirect: '/join',
    failureFlash: true
})) 

// router.post('/',function(req,res){
//     var body = req.body;
//     var email = body.email;
//     var name = body.name;
//     var passwd = body.password;
//     //console.log(email + ", " + name + ", " + passwd);
    
//     //그다음 db 쿼리를 해주어야한다. 그러기 위해 connection정보를 위에 입력했다.
//     var sql = {email : email, name : name, pw : passwd}; //sql을 위에서 받은 변수로 객체 형태로 만든다.
//     var query = connection.query('insert into user set ?', sql, function(err,rows){
//         //sql에 객체를 넣어 set 뒤에 할당된다.
//         if(err) throw err
//         else res.render('welcome.ejs', {'name' : name, 'id' : rows.insertId})
//         //console.log('ok db insert : ', rows.insertId,name);
//     }) 
// })
module.exports = router;