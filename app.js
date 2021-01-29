var express = require('express')
var app = express()
var bodyParser = require('body-parser')//모듈 등록

var router = require('./router/index')

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var session = require('express-session')
var flash = require('connect-flash')//오류 메세지를 전달해주는 변수

app.listen(3000, function(){
	console.log("start, express server on port 3000");
}); 

app.use(express.static('public'))
//express 서버에 bodyparser를 쓸 것을 알려주어야한다.
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine', 'ejs')

app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash()) //flash : 메시지를 쉽게 전달하는 것

app.use(router)
