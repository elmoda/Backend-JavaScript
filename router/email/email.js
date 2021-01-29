var express = require('express')
var app = express()
var router = express.Router(); //router메소드 불러줌.
var path = require('path') // 상대경로로 이동
var mysql = require('mysql') //모듈 등록

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
router.post('/form', function(req,res){
	console.log(req.body.email)
	res.render('email.ejs',{'email':req.body.email})
})

router.post('/ajax', function(req, res){
	var email = req.body.email; //클라이언트가 보낸 변수를 이메일에 담기
	var responseData = {} //json을 주기위해 objectment를 초기화

	var query = connection.query('select name from user where email="' + email + '"', function(err, rows){
		//쿼리를 날리기
		//connection 객체를 이용해서 query라는 메소드 이용
		//name 값을 table은 user 테이블에서 email 정보를 넣고 function을 넣는다.
		
		if(err) throw err;
		if(rows[0]) { //row[0]은 첫번째 데이터 값
			//console.log(rows[0].name) //{name: hello}로 출력
			responseData.result = 'ok';
			responseData.name = rows[0].name;
		} else {
			responseData.result = 'none';
			responseData.name = "";
			//console.log('none : ' + rows[0])  //undefined로 출력
		}
		res.json(responseData); //응답 값을 주는 것 
		//(query 라는 콜백함수에서 비동기로 동작되기때문에)
	})
	
	//res.json(responseData); //여기서 응답 값을 주면 없는 결과가 나온다.
})

module.exports = router;