/**
 * Module dependencies.
 * 모듈을 추가합니다.
 */
var express = require('express');
var http = require('http');
var fs = require('fs');
var menu = require('./routes/menu');

// 웹 서버를 생성합니다.
var app = express();

// 미들웨어를 설정합니다.
app.configure(function() {
    app.set('views', __dirname + '/views');

    app.use(app.router);
    app.use(express.logger());
    app.use(express.cookieParser());

    app.use(express.static('public'));
});
app.configure('development', function() {
    app.use(express.errorHandler());
    
    // source 가 예쁘게 출력되게 하는 옵션
    app.locals.pretty = true;
});


http.createServer(app).listen(8002, function (request, response)	{ 
	console.log('Server running at http://127.0.0.1:8002');
}); 

app.get('/', menu.index);
app.get('/about', menu.about);
app.get('/facilities/:name', menu.facilities);
app.get('/events', menu.events);
app.get('/reservation', menu.reservation);
app.get('/partners/:name', menu.partners);
app.get('/booking', menu.booking);
app.get('/news', menu.news);