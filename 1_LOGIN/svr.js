const express = require('express') // web server와 통신 
const mysql = require('mysql') // mysql과 통신
const path = require('path') // 경로 단축키 
const static = require('serve-static') // 현재 디렉토리가 조상님 
const dbconfig = require('./config/dbconfig.json')


// ====================== Database Connection Pool(sql과 연결)============= 
const pool = mysql.createPool({ // 서버와 sql이 통신하기 위한 길'들' 뚫기
    connectionLimit: 10, // 뚫을 길 개수
    host: dbconfig.host, // 데이터베이스의 IP 주소
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,
    debug: false
})

const app = express() 
app.use(express.urlencoded({extended:true})) // urlencoded:전송에 유리하도록 URL 형태 변경 
app.use(express.json()) // json 파일이 와도 해석할 수 있도록 === > 정보가 깔끔하게 들어올 수 있도록 해줌 
app.use('/public', static(path.join(__dirname, 'public'))) // /public = _29_1_MYSQL_LOGIN/public


app.post('/process/login', (req, res)=> {
    console.log('/process/login 호출됨'+req)
    const paramID = req.body.id
    const paramPassword = req.body.password

    console.log('로그인 요청 '+paramID+' '+paramPassword)

    pool.getConnection((err, conn)=> {
        if (err) {
            conn.release();
            console.log('Mysql getConnection error aborted')
            return;
        }

        const exec = conn.query('select `id`, `name` from `users` where `id`=? and `password`=md5(?)',
        [paramID, paramPassword],
        (err, rows) => {
            conn.release()
            console.log('실행된 SQL query: '+exec.sql);

            if(err) {
                console.dir(err)
                return;
            }

            if(rows.length > 0) {
                console.log(`아이디 ${paramID}, 패스워드가 일치하는 ${rows[0].name}`)
                res.send(`<script type="text/javascript">alert("${paramID}님 환영합니다!"); history.go(-1); </script>`);
                res.end();
                // return
            }

            else {
                console.log(`아이디 ${paramID}, 패스워드 일치 X`)
                res.send(`<script type="text/javascript">alert("아이디, 패스워드가 일치하지 않습니다."); history.go(-1); </script>`);
                //return;
            }
        })
    })
})

app.post('/process/adduser', (req, res) => { // post 명령으로 들어온 것은 여기에서 처리함
    // req : web broswer에서 들어온 정보
    // res : web broswer에게 넘기는 정보

    console.log('/process/adduser 호출됨 '+req)
    const paramId = req.body.id; // req의 body 안에 있는 id
    const paramName = req.body.name;
    const paramAge = req.body.age;
    const paramPassword = req.body.password;


    // sql이랑 찐 통신해야 할 차례.. 놀고 있는 connection (길) 하나 호출
    pool.getConnection((err, conn) => {
        // conn : 진짜 DB랑 연결돼있는 끈

        if (err) { // 놀고 있는 애가 없다던지, 연결 자체가 안됐을 때
            conn.release();
            console.log('mySQL getconnction error')
            
            res.end();
        }

        // 연결 됐을 때
        console.log('데이터베이스 연결 끈 얻음')
        
        // db에 회원 정보 넣기 
        const exec = conn.query('insert into users (id, name, age, password) values (?,?,?,md5(?));',
        [paramId, paramName, paramAge, paramPassword], 
         // query 후
            
            (err, result)=>{
                conn.release();
                console.log('실행된 SQL: '+exec.sql)

                if (err) { // query 오류
                    console.log('sql 실행 시 오류 발생')
                    console.dir(err)
                    res.writeHead('200', {'Content-Type':'text/html; charset=utf8'})
                    res.write('<h2>sql query 실행 실패</h2>')
                    res.end();
                    return;
                }

                if (result) { // query 성공
                    console.dir(result)
                    console.log('Inserted 성공')
                    res.send(`<script type="text/javascript">alert("회원가입을 축하드립니다! 로그인 페이지로 이동합니다."); history.go(-2); </script>`);
                    res.end();
                }
                else { //  실패
                    console.log('Inserted 실패')

                    // web broswer에 성공했다는 코드 200번, 사용자 추가 성공 텍스트 전송
                    res.writeHead('200', {'Content-Type':'text/html; charset=utf8'})
                    res.write('<h1>사용자 추가 실패</h1>')
                    res.end();
                }

                
            }
        )
        
    })
})

app.listen(3000, ()=> {
    console.log('listening on port 3000')
})