var express = require('express')
var app = express()
var router = express.Router(); //router메소드 불러줌.
var path = require('path') // 상대경로로 이동
var mysql = require('mysql'); //모듈 등록
const passport = require('passport');
const { doesNotMatch } = require('assert');

//DATABASE SETTING
var connection = mysql.createConnection({
	host : 'localhost',
	port : 3306,
	user : 'root',
	password : 'psh5746',
	database : 'jsman'
})

connection.connect()

router.get('/list', function(req, res){
    res.render('movie.ejs')
})

//1. /movie GET
router.get('/',function(req, res){
    
    var responseData = {} //json을 주기위해 objectment를 초기화

	var query = connection.query('select title from movie', function(err, rows){
		//쿼리를 날리기
		//connection 객체를 이용해서 query라는 메소드 이용
		//name 값을 table은 user 테이블에서 email 정보를 넣고 function을 넣는다.
		
		if(err) throw err;
        if(rows.length) { //row[0]은 첫번째 데이터 값
            console.log(rows);
			responseData.result = 1;
			responseData.data = rows;
		} else {
			responseData.result = 0;
			// responseData.data = "";
			//console.log('none : ' + rows[0])  //undefined로 출력
		}
		res.json(responseData); //응답 값을 주는 것 
		//(query 라는 콜백함수에서 비동기로 동작되기때문에)
	})
})

//2. /movie, POST
router.post('/', function(req, res){
	//클라이언트에서 받아야 할 것이 title, type,....
	var title = req.body.title;
	var type = req.body.type;
	var grade = req.body.grade;
	var actor= req.body.actor;

	// console.log('title', title);
	var sql = {title, type, grade, actor};
	var query = connection.query('insert into movie set ?',sql, function(err,rows){
		if(err) throw err;
		return res.json({'result': 1});
	})
})


//3. /movie/:title GET
router.get('/:title',function(req, res){
	var title = req.params.title;
	console.log('title =>', title);
    var responseData = {} //json을 주기위해 objectment를 초기화

	var query = connection.query('select * from movie where title=?',[title], function(err, rows){
		//쿼리를 날리기
		//connection 객체를 이용해서 query라는 메소드 이용
		//name 값을 table은 user 테이블에서 email 정보를 넣고 function을 넣는다.
		
		if(err) throw err;
        if(rows[0]) { //row[0]은 첫번째 데이터 값
			responseData.result = 1;
			responseData.data = rows;
		} else {
			responseData.result = 0;
			// responseData.data = "";
			//console.log('none : ' + rows[0])  //undefined로 출력
		}
		res.json(responseData); //응답 값을 주는 것 
		//(query 라는 콜백함수에서 비동기로 동작되기때문에)
	})
})

//4. /movie/:title DELETE
router.delete('/:title',function(req, res){
	var title = req.params.title;
	console.log('title =>', title);
    var responseData = {}

	var query = connection.query('delete from movie where title=?',[title], function(err, rows){
		if(err) throw err;
		console.log('row is ->' , rows)
        if(rows.affectedRows > 0) { 
			responseData.result = 1;
			responseData.data = title;
		} else {
			responseData.result = 0;
		}
		res.json(responseData);
	})
})

module.exports = router;