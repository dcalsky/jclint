var express = require('express');
var bodyParser = require('body-parser');
var https = require('https'); 
var querystring = require('querystring');  
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var hostname = '10.60.45.8'
var port = 8800
var cookie = 'ltpaToken2=/7SwzNONpkfjvgOoo+qGiL1KPEjgJTmJuRipSA8JVgXTUqn6W1cqgezIe7bpmgmlto9KddXbQW8qVnpylwVCt9vBCCkE+vJDH2OGs+2NCsOTjKnCcShiqWQY5pjwELSVQeVuID+xJBeGK2bbOt3P2wzPo6kBh7cJka0xt1b8M4F7oAD8ielih5QIU1Cc8nC2THxFAJlUbrOjTK5+kr/GEbtp+S7yJTzy6I3zH2f/K+1E/f/V5s7wbM4dDV/QDLzmk2k6Xx/6siSJixnaZjM9WotAkRW8xvjxGJiZHWdyhZs92oMg1a8CErBZ1Oo3WmFb'

// auth
app.post('/auth', function (req, res) {
    var userid = req.body.userid;
    var password = req.body.password;
    var b = new Buffer(userid + ':' + password);
    var base64string = b.toString('base64');
    console.log(base64string)
    var options = {  
        hostname: hostname,  
        port: port,  
        path: '/zosmf',  
        rejectUnauthorized: false,
        method: 'POST',  
        headers:{
            'Authorization': 'Basic ' + base64string
        }  
    }
    var req = https.request(options, function(res) {  
        console.log('Status:', res.statusCode);  
        console.log('headers:', JSON.stringify(res.headers));  
        console.log('Cookie:', res.headers['set-cookie'][0].split(';')[0])
        cookie = res.headers['set-cookie'][0].split(';')[0]
        res.setEncoding('utf-8');  
        res.on('data', function(chun) {  
            // get cookies
            console.log(chun)
        });  
        res.on('end', function() {  

        });  
    });    
    req.on('error',function(err) {  
        console.error(err);  
    });
    req.end();
    res.send('HELLO');
});


// post job
app.post('/zos/job', function (req, res) {
    console.log(req.body.content)
    var postData = req.body.content;
    var options = {  
        hostname: hostname,  
        port: 8800,  
        path: '/zosmf/restjobs/jobs',  
        rejectUnauthorized: false,
        method: 'PUT',  
        headers:{
        'Content-Type':'text/plain',
        'Cookie': cookie
        }  
    }
    var req = https.request(options, function(res) {  
        console.log('Status:', res.statusCode);  
        console.log('headers:', JSON.stringify(res.headers));  
        res.setEncoding('utf-8');  
        res.on('data', function(chun) {  
            // get data
            console.log(chun);  
        });  
        res.on('end', function(err) { 
            
        });  
    });    
    req.on('error',function(err) {  
        console.error(err);  
    });  
    req.write(postData);  
    req.end();
    res.send('HELLO');
});

// get the job status
app.get('/zos/job/:job_name/:job_id', function (req, res) {
    var options = {  
        hostname: hostname,  
        port: 8800,  
        rejectUnauthorized: false,
        path: '/zosmf/restjobs/jobs/' + req.params.job_name + '/' + req.params.job_id,  
        method: 'get',  
        headers: {
            'Cookies': cookie
        }  
    }
    var req = https.request(options, function(res) {  
        console.log('Status:', res.statusCode);  
        console.log('headers:', JSON.stringify(res.headers));  
        res.setEncoding('utf-8');  
        res.on('data', function(chun) {  
            console.log('body分隔线---------------------------------\r\n');  
            console.info(chun);  
        });  
        res.on('end', function() {  
            console.log('No more data in response.********');  
        });  
    });    
    req.on('error',function(err) {  
        console.error(err);  
    });  
    req.write(postData);  
    req.end();
    res.send('HELLO');
});

// get the detail output
app.get('/zos/job/:job_name/:job_id/files/:id/records', function (req, res) {
    var options = {  
        hostname: hostname,  
        port: 8800,  
        rejectUnauthorized: false,
        path: '/zosmf/restjobs/jobs/' + req.params.job_name + '/' + req.params.job_id + 
            + '/files/' + req.params.id  + '/records',  
        method: 'get',  
        headers: {
            'Cookies': cookie
        }  
    }
    var req = https.request(options, function(res) {  
        console.log('Status:', res.statusCode);  
        console.log('headers:', JSON.stringify(res.headers));  
        res.setEncoding('utf-8');  
        res.on('data', function(chun) {  
            
        });  
        res.on('end', function() {  
           
        });  
    });    
    req.on('error',function(err) {  
        console.error(err);  
    });  
    req.write(postData);  
    req.end(); 
    res.send('HELLO');
});
// get the list of output
app.get('/zos/job/:job_name/:job_id/files', function (req, res) {
    var options = {  
        hostname: hostname,  
        port: 8800,  
        rejectUnauthorized: false,
        path: '/zosmf/restjobs/jobs/' + req.params.job_name + '/' + req.params.job_id + 
            + '/files',  
        method: 'get',  
        headers: {
            'Cookies': cookie
        }  
    }
    var req = https.request(options, function(res) {  
        console.log('Status:', res.statusCode);  
        console.log('headers:', JSON.stringify(res.headers));  
        res.setEncoding('utf-8');  
        res.on('data', function(chun) {  
            
        });  
        res.on('end', function() {  
            
        });  
    });    
    req.on('error',function(err) {  
        console.error(err);  
    });  
    req.write(postData);  
    req.end(); 
    res.send('HELLO');
});
 
var server = app.listen(8084, function () {

    var host = server.address().address
    var port = server.address().port
    
    console.log("JCL Job Server, The Location http://%s:%s", host, port)
})