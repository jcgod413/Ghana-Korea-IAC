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

// 서버시간이 한국시간 기준이므로 가나 현지시간으로 변경
function getLocalDate()	{
	var date = new Date();	

	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();

	hour -= 9;
	if( hour < 0 )	{
		hour += 24;
		day--;

		if( day == 0 )	{
			month--;

			if( month == 0 )	{
				month = 12;
				year--;
			}

			// 월별 일 처리
			switch(month)	{
				case 1:  day = 31;	break;
				case 2:  day = 28;	break;
				case 3:  day = 31;	break;
				case 4:  day = 30;	break;
				case 5:  day = 31;	break;
				case 6:  day = 30;	break;
				case 7:  day = 31;	break;
				case 8:  day = 31;	break;
				case 9:  day = 30;	break;
				case 10: day = 31;	break;
				case 11: day = 30;	break;
				case 12: day = 31;	break;
			}

			// 윤년 처리
			if( year%4 == 0 && month == 2 )	{
				day = 29;
			}
		}
	}
	if( month < 10 )	{
		month = '0' + month;
	}
	if( day < 10 )	{
		day = '0' + day;
	}

	return '' + year + month + day;
}

function getLocalTime()	{
	var date = new Date();	
	
	var hour = date.getHours();
	var minute = date.getMinutes();

	hour -= 9;
	if( hour < 0 )	{
		hour += 24;
	}
	if( hour < 10 )	{
		hour = '0' + hour;
	}
	if( minute < 10 )	{
		minute = '0' + minute;
	}

	return hour + ':' + minute;
}

// 리스트 조회
exports.list = function(request, response)	{
	var date = getLocalDate();

	var sentence = 'SELECT * FROM Booking WHERE date=' + date;
	client.query(sentence, function(error, results)	{	
		var user = new Array();
		var userIndex = 0;
		for(var i=results.length-1; i>=0; i--)	{
			if( results[i].time_out == null )	{
				var obj = new Object();
				obj.index = results[i].index;
				obj.name = results[i].name;
				obj.time = results[i].time_in;
				obj.id = results[i].id;
				user[userIndex++] = obj;	
			}
		}
	
		var path = homeDir + '/public/views/bookingList.ejs';
	    fs.readFile(path, 'utf8', function (error, data) {
	        response.writeHead(200, { 'Content-Type': 'text/html' });
	        response.end(ejs.render(data, {rows:user}));
	    });
	});
};

// 리스트 조회 (모바일)
exports.list_mobile = function(request, response)	{
	var date = getLocalDate();

	var sentence = 'SELECT * FROM Booking WHERE date=' + date;
	client.query(sentence, function(error, results)	{	
		var user = new Array();
		var userIndex = 0;
		for(var i=results.length-1; i>=0; i--)	{
			if( results[i].time_out == null )	{
				var obj = new Object();
				obj.index = results[i].index;
				obj.name = results[i].name;
				obj.time = results[i].time_in;
				obj.id = results[i].id;
				user[userIndex++] = obj;	
			}
		}
	
		var path = homeDir + '/public/views/bookingList_mobile.ejs';
	    fs.readFile(path, 'utf8', function (error, data) {
	        response.writeHead(200, { 'Content-Type': 'text/html' });
	        response.end(ejs.render(data, {rows:user}));
	    });
	});
};

// 등록
exports.signup = function(request, response)	{
	var json={};

	request.on('data', function(data)	{
		console.log(data);
		data = data.toString();
		data = unescape(data);	// 아스키 코드를 문자로
        data = data.split('&');
        for(var i = 0; i < data.length; i++) {
            var _data = data[i].split("=");
            json[_data[0]] = _data[1];
		}
		console.log(json);
	});
	request.on('end', function()	{
		var name = json.firstName + ' ' + json.lastName;
		var level = json.level;
		var status = json.status;
		var gender = json.inlineRadioOptions;
		var id = json.idNo;
		var tel = json.tellNo;
		var email = json.email;

		var time = getLocalTime();
		var creationDate = getLocalDate();

		var sentence = 'SELECT * FROM User WHERE id=' + id;
		client.query(sentence, function(error, results)	{	
			if( results.length > 0 )	{
				console.log('Already registered ' + id);
				response.redirect('/booking');
			}
		});

		// DB
		var sentence = 'INSERT INTO User (name, tel, gender, status, level, id, email, creationDate) VALUES ("'+name+'", "'+tel+'", "'+gender+'", "'+status+'", "'+level+'", "'+id+'", "'+email+'", "'+creationDate+'")';
		client.query(sentence, function(error, results)	{	
			var sentence = 'INSERT INTO Booking (name, id, time_in, date) VALUES ("'+name+'", "'+id+'","'+time+'", "'+creationDate+'")';
			client.query(sentence, function(error, results)	{	
				response.redirect('/booking');
			});
		});
	});
};

// 로그인
exports.signin = function(request, response)	{
	var json={};

	request.on('data', function(data)	{
		data = data.toString();
        data = data.split('&');
        for(var i = 0; i < data.length; i++) {
            var _data = data[i].split("=");
            json[_data[0]] = _data[1];
		}
	});
	request.on('end', function()	{
		var id = json.idNo;

		var sentence = 'SELECT * FROM User WHERE id=' + id;
		client.query(sentence, function(error, results)	{	
			console.log(results);
			if( error || results.length == 0 )	{
				response.send('Failed. Check your ID');
			}

			var name = results[0].name;
			var time = getLocalTime();
			var date = getLocalDate();

			var sentence = 'INSERT INTO Booking (name, id, time_in, date) VALUES ("'+name+'", "'+id+'","'+time+'","'+date+'")';
			client.query(sentence, function(error, results)	{	
				response.redirect('/booking');
			});
		});	
	});
};

// 로그아웃
exports.signout = function(request, response)	{
	var id = request.param('id');

	var time = getLocalTime();
	var date = getLocalDate();

	// DB
	var sentence = 'UPDATE Booking SET time_out="'+time+'" WHERE id="'+id+'" AND date="'+date+'"';
	client.query(sentence, function(error, results)	{	
		response.redirect('/booking');
	});
};

// 로그인체크
exports.logincheck = function(request, response)	{
	var id = request.param('id');
	var date = getLocalDate();

	var sentence = 'SELECT time_out FROM Booking WHERE id="' + id + '" AND date="'+ date + '"';
	client.query(sentence, function(error, results)	{	
		var login = false;
		for(var i=0; i<results.length; i++)	{
			if( results[i].time_out == null )	{
				login = true;
			}
		}

		if( login )	{
			response.send('yes');
		}
		else	{
			response.send('no');
		}
	});
}

// 유저 중복 체크
exports.usercheck = function(request, response)	{
	var json={};

	request.on('data', function(data)	{
		data = data.toString();
        data = data.split('&');
        for(var i = 0; i < data.length; i++) {
            var _data = data[i].split("=");
            json[_data[0]] = _data[1];
		}
	});
	request.on('end', function()	{
		var id = json.idNo;

		var sentence = 'SELECT * FROM User WHERE id=' + id;
		client.query(sentence, function(error, results)	{	
			console.log(id);
			console.log(results);
			if( results.length > 0 )	{
				response.send('Already registered');
			}
			else	{
				var path = homeDir + '/public/views/register.ejs';
				fs.readFile(path, 'utf8', function (error, data) {
			        response.writeHead(200, { 'Content-Type': 'text/html' });
			        response.end(ejs.render(data, {idNo:id}));
			    });
			}
		});
	});
}