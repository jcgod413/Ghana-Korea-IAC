var fs = require('fs');
var ejs = require('ejs');
var mysql = require('mysql');

var homeDir = '/home/hosting_users/qeqe94/apps/qeqe94_iac/';

// 데이터베이스와 연결합니다.
var client = mysql.createConnection({
	host: '10.0.0.1',
	port: '3306',
	user: 'qeqe94',
	database: 'qeqe94',
	password: 'q1w2e3r4'
});

// 리스트 조회
exports.list = function(request, response)	{    
    var page = request.param('page');

    // Database
    var sentence = 'SELECT * FROM News';
	client.query(sentence, function(error, results)	{	
		console.log(results);

		var news = new Array();
		var newsIndex = 0;

		var st = 6 * (page-1);
		var end = 6 * page;
		if( results.length < end )	{
			end = results.length;
		}

		for(var i=st; i<end; i++)	{
			var obj = new Object();
			obj.id = results[i].id;
			obj.title = results[i].title;
			obj.contents = results[i].contents;
			obj.image = results[i].image;
			
			news[newsIndex++] = obj;
		}

		var maxPage = results.length / 6;
		if( results.length%6 > 0 )	{
			maxPage++;
		}

		var path = homeDir + '/public/views/news.ejs';
		fs.readFile(path, 'utf8', function (error, data) {
	        response.writeHead(200, { 'Content-Type': 'text/html' });
	        response.end(ejs.render(data, {row:news, 'maxPage':maxPage}));
	    });
	});
};

// News 상세보기
exports.show = function(request, response)	{    
	var id = request.param('id');

	var sentence = 'SELECT * FROM News WHERE id=' + id;
	client.query(sentence, function(error, results)	{	
		if( results.length == 0 )	{
			response.redirect('/');
		}

		var article = {
			title : results[0].title,
			contents : results[0].contents,
			image : results[0].image
		};
		var path = homeDir + '/public/views/newsContents.ejs';
		fs.readFile(path, 'utf8', function (error, data) {
	        response.writeHead(200, { 'Content-Type': 'text/html' });
	        response.end(ejs.render(data, {news:article}));
	    });
	});
};

// News 추가
exports.add = function(request, response)	{    
	var title = request.param('title');
	var contents = request.param('contents');
	var image = request.param('image');

	var sentence = 'INSERT INTO News (title, contents, image) VALUES ("'+title+'","'+contents+'","'+image+'")';
	client.query(sentence, function(error, results)	{	
		if( error )	{
			response.send('fail');
		}
		else	{
			response.send('success');
		}
	});

	// var json={};

	// request.on('data', function(data)	{
	// 	data = data.toString();
 //        data = data.split('&');
 //        for(var i = 0; i < data.length; i++) {
 //            var _data = data[i].split("=");
 //            json[_data[0]] = _data[1];
	// 	}
	// });
	// request.on('end', function()	{
	// 	var title = json.title;
	// 	var contents = json.contents;

	// 	var sentence = 'INSERT INTO News (title, contents) VALUES ("'+title+'","'+contents+'")';
	// 	client.query(sentence, function(error, results)	{	
	// 		if( error )	{
	// 			response.send('fail');
	// 		}
	// 		else	{
	// 			response.send('success');
	// 		}
	// 	});
	// });
};

// News 제거
exports.remove = function(request, response)	{   
	var id = request.param('id');

	// DB
	var sentence = 'DELETE FROM News WHERE id="'+id+'"';
	client.query(sentence, function(error, results)	{	
		response.redirect('/news/list?page=1');
	});
};

// News 수정
exports.edit = function(request, response)	{   
	var id = request.param('id');
	var title = request.param('title');
	var contents = request.param('contents');

	// DB
	var sentence = 'UPDATE News SET title="'+title+'", contents="'+contents+'" WHERE id="'+id+'"';
	client.query(sentence, function(error, results)	{	
		if( error )	{
				response.send('fail');
			}
			else	{
				response.send('success');
			}
	});
};