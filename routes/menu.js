var fs = require('fs');

exports.index = function(request, response)	{
	// response.writeHead(200, {'Content-Type': 'text/html'});
	// fs.createReadStream('main.html').pipe(response);
	response.sendfile('./views/main.html');

	// fs.readFile('./views/main.html', function (err, html) {
	//     if (err) {
	//         throw err; 
	//     }       

 //        fs.readFile('./views/mainCSS.css', function (err, css) {
	// 	    if (err) {
	// 	        throw err; 
	// 	    }   

	// 	    response.writeHeader(200, {"Content-Type": "text/html"});  
	//         response.write(html);  
	//         response.end();      
		    
	//         response.writeHeader(200, {"Content-Type": "text/css"});  
	//         response.write(css);  
	//         response.end();  
	// 	});
	// });

	// response.render('./views/main.html');
};

exports.about = function(request, response)	{
	response.send('<h1>About Us</h1>');
};

exports.facilities = function(request, response)	{
	var name = request.param('name');

	switch( name )	{
		case 'IT-TrainingLab' :
			break;
		case 'ConferenceRoom' :
			break;
		case 'SeminarRooms' :
			break;
		case 'InternetLounge' :
			break;
		case 'Reception' :
			break;
	}

	response.send('<h1>Facilities ' + name + '</h1>');
};

exports.events = function(request, response)	{
	response.send('<h1>Events</h1>');
};

exports.reservation = function(request, response)	{
	response.redirect('http://libcal.ug.edu.gh/rooms.php?i=11908');
};

exports.partners = function(request, response)	{
	var name = request.param('name');

	switch( name )	{
		case 'NIA' :
			response.redirect('http://www.naver.com');
		case 'KIV' :
			response.redirect('http://www.naver.com');
		case 'IAC-NET' :
			response.redirect('http://www.naver.com');
		default :
			response.send('Invalid partners');
	}
};

exports.booking = function(request, response)	{
	response.redirect('http://197.255.68.236:81');
};

exports.news = function(request, response)	{
	response.send('<h1>News</h1>');
};