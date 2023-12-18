const express = require('express');
const app = express();
exports.app = app;
const ejs = require('ejs');

// EJS를 뷰 엔진으로 설정
app.set('view engine', 'ejs');

// 정적 파일을 제공하기 위해 express.static 미들웨어 사용
app.use(express.static(__dirname + '/public'));

// 서버를 3000 포트에서 시작
app.listen(3000, () => {
   console.log('Server is running on port 3000');
});


