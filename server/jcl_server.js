var express = require('express');
var bodyParser = require('body-parser');
var https = require('https'); 
var querystring = require('querystring');  
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// post job
app.post('/zos/job', function (req, res) {
    console.log(req.body.content)
    var postData = req.body.content;
    var options = {  
        hostname: '10.60.48.5',  
        port: 8800,  
        path: '/zosmf/restjobs/jobs',  
        method: 'PUT',  
        headers:{
        'Content-Type':'text/plain',
        'Cookies': ''
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
    res.send('Hello World');
});

// get the job status
app.get('/zos/job/:job_name/:job_id', function (req, res) {
    var options = {  
        hostname: '10.60.48.5',  
        port: 8800,  
        path: '/zosmf/restjobs/jobs/' + req.params.job_name + '/' + req.params.job_id,  
        method: 'get',  
        headers: {
            'Cookies': ''
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
    res.send('Hello World');
});

// get the detail output
app.get('/zos/job/:job_name/:job_id/files/:id/records', function (req, res) {
    var options = {  
        hostname: '10.60.48.5',  
        port: 8800,  
        path: '/zosmf/restjobs/jobs/' + req.params.job_name + '/' + req.params.job_id + 
            + '/files/' + req.params.id  + '/records',  
        method: 'get',  
        headers: {
            'Cookies': ''
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
    res.send('Hello World');
});
// get the list of output
app.get('/zos/job/:job_name/:job_id/files', function (req, res) {
    var options = {  
        hostname: '10.60.48.5',  
        port: 8800,  
        path: '/zosmf/restjobs/jobs/' + req.params.job_name + '/' + req.params.job_id + 
            + '/files',  
        method: 'get',  
        headers: {
            'Cookies': ''
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
    res.send('Hello World');
});
 
var server = app.listen(8081, function () {
 
    var host = server.address().address
    var port = server.address().port
    
    console.log("JCL Job Server, The Location http://%s:%s", host, port)
})