var express = require('express')
var app = express()
var router = express.Router(); //router메소드 불러줌.
var path = require('path') // 상대경로로 이동

//main page는 login이 될 때만 ( 즉 세션 정보가 있을 때만) 접근이 가능하게 하자.
router.get('/',function(req, res){ //요청이 오는 것을 기다리면서 대기중
    console.log('main js loaded', req.user)
    var id = req.user
    //만약 아이디 값이 없으면 login pape로 이동
    if(!id) res.render('login.ejs');
    res.render('main.ejs', {'id' : id})
});

//라우터가 export됨으로써 다른 파일에서 이파일을 쓸 수 있게해준다.
module.exports = router; //하나의 만들어진 모듈을 export할 수 있다.
