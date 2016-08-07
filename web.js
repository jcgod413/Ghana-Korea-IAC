/**
 * Module dependencies.
 * 모듈을 추가합니다.
 */
var express = require('express');
var http = require('http');
var fs = require('fs');
var booking = require('./routes/booking');
var news = require('./routes/news');
var path = require('path');
var ejs = require('ejs');

// 웹 서버를 생성합니다.
var app = express();

app.configure(function()    {
    // 미들웨어를 설정합니다.
    // app.set('views', __dirname + '/views');
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');
    app.use(app.router);
    app.use(express.bodyParser());
    app.use(express.logger());
    app.use(express.cookieParser());
    app.use(express.static(__dirname + '/public')); 
    app.use(express.errorHandler());

    app.engine('ejs', require('ejs-locals'));
});

http.createServer(app).listen(8003, function (request, response)	{ 
	console.log('Server running');
}); 

app.get('/', function(request, response)    {
    // fs.readFile(__dirname + '/public/views/main.html', function (err, html) {
    //     response.writeHeader(200, {"Content-Type": "text/html"});  
    //     response.write(html);  
    //     response.end(); 
    // });
    response.redirect('views/main.html');
});

// app.get('/upload', function(request, response)  {
//     var path = __dirname + '/public/views/upload.html';
//     fs.readFile(path, 'utf8', function (error, data) {
//         response.writeHead(200, { 'Content-Type': 'text/html' });
//         response.end(data);
//     });
// });

// app.post('/upload', function(request, response)  {
//     // 읽어드릴 파일 경로 지정
//     var readPath = request.files.thumbnail.path;
//     // 저장할 파일 경로를 지정
//     var writePath = __dirname + "/public/images" + request.files.thumbnail.name;

//     fs.readFile(readFile, function(error, data)    {    
//         fs.writeFile(writePath, data, function(error)    {
//             if( error ) {
//                 throw error;
//             }
//             else    {
//                 response.send('File uploaded to: ' + writePath);
//             }
//         });
//     });
// });

app.get('/booking', booking.list);
app.get('/booking_mobile', booking.list_mobile);
app.post('/booking/signup', booking.signup);
app.post('/booking/signin', booking.signin);
app.get('/booking/signout', booking.signout);
app.get('/booking/logincheck', booking.logincheck);
app.post('/booking/usercheck', booking.usercheck);

app.get('/news/list', news.list);
app.get('/news', news.show);
app.put('/news', news.edit);
app.del('/news', news.remove);
app.post('/news', news.add);