var express = require('express');
var bodyParser = require('body-parser');
var https = require('https'); 
var querystring = require('querystring');  
var cors = require('cors');
var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var hostname = '10.60.45.8'
var username = ''
var port = 8800
var cookie = null

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
    var response = res
    var that = this
    var req = https.request(options, function(res) {  
        console.log('Status:', res.statusCode);  
        console.log('headers:', JSON.stringify(res.headers));  
        console.log('Cookie:', res.headers['set-cookie'][0].split(';')[0])
        that.cookie = res.headers['set-cookie'][0].split(';')[0]
        res.setEncoding('utf-8'); 

        response.send(that.cookie);
        res.on('data', function(chun) {  
            // get cookies
            console.log('succuss')
        });  
        res.on('end', function() {  

        });  
    });    
    req.on('error',function(err) {  
        console.error(err);  
    });
    req.end();
});


// {
//     "username": "155xxxxx',
//     "password": "xxxxxx",
//     "job": "xxxx"
// }
// post job
app.post('/zos/job', function (req, res) {
    var job = req.body.job
    var userid = req.body.username;
    var password = req.body.password;
    var response = res;
    // if the cookie is no null and , then submit the job
    if (cookie == null || this.username != req.body.userid) {
        let promise = new Promise((resolve, reject) => {
            var b = new Buffer(userid + ':' + password);
            var base64string = b.toString('base64');
            // console.log(base64string)
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
                // console.log('Status:', res.statusCode);  
                // console.log('headers:', JSON.stringify(res.headers));  
                // console.log('Cookie:', res.headers['set-cookie'][0].split(';')[0])
                console.log(res.headers)
                var cookie = res.headers['set-cookie'][0].split(';')[0]
                res.setEncoding('utf-8'); 
                resolve(cookie)
            });    
            req.on('error',function(err) {  
                reject(err)
            });
            req.end();
        });
        // await promise is wrong
        promise.then((cookie) => {
            this.cookie = cookie;
            var postData = job;
            // console.log(cookie)
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
                // console.log('Status:', res.statusCode);  
                // console.log('headers:', JSON.stringify(res.headers));  
                res.setEncoding('utf-8');  
                res.on('data', function(chun) {  
                    // get data
                    var resJob = JSON.parse(chun);
                    var jobDetail = {
                        rc: resJob.retcode,
                        jobname: resJob.jobname,
                        jobid: resJob.jobid,
                        url: resJob.url
                    }
                    console.log(resJob); 
                    response.send(JSON.stringify(jobDetail));
                });  
                res.on('end', function(err) { 
                    
                });  
            });    
            req.on('error',function(err) {  
                console.error(err);  
            });  
            req.write(postData);  
            req.end();
        }).catch((err) => {
            console.log(err)
        })
    } else {
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
            // console.log('Status:', res.statusCode);  
            // console.log('headers:', JSON.stringify(res.headers));  
            res.setEncoding('utf-8');  
            res.on('data', function(chun) {  
                // get data
                var resJob = JSON.parse(chun);
                var jobDetail = {
                    rc: resJob.retcode,
                    jobname: resJob.jobname,
                    jobid: resJob.jobid,
                    url: resJob.url
                }
                console.log(resJob); 
                response.send(JSON.stringify(jobDetail));
            });  
            res.on('end', function(err) { 
                
            });  
        });    
        req.on('error',function(err) {  
            console.error(err);  
        });  
        req.write(postData);  
        req.end();
    }   
});
// get status
app.post('/zos/job/status', function (req, res) {
    var path = '/zosmf' + req.body.url.split('/zosmf')[1];
    var userid = req.body.username;
    var password = req.body.password;
    var response = res;
    if (cookie == null || this.username != req.body.userid)  {
        let promise = new Promise((resolve, reject) => {
            var b = new Buffer(userid + ':' + password);
            var base64string = b.toString('base64');
            // console.log(base64string)
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
                // console.log('Status:', res.statusCode);  
                // console.log('headers:', JSON.stringify(res.headers));  
                // console.log('Cookie:', res.headers['set-cookie'][0].split(';')[0])
                console.log(res.headers)
                var cookie = res.headers['set-cookie'][0].split(';')[0]
                res.setEncoding('utf-8'); 
                resolve(cookie)
            });    
            req.on('error',function(err) {  
                reject(err)
            });
            req.end();
        });
        promise.then((cookie) => {
            this.cookie = cookie;
            console.log(cookie + path)
            var options = {  
                hostname: hostname,  
                port: 8800,  
                rejectUnauthorized: false,
                path: path,  
                method: 'GET',  
                headers: {
                    'cookie': cookie
                }  
            }
            var response = res
            var req = https.request(options, function(res) {  
                // console.log('Status:', res.statusCode);  
                // console.log('headers:', JSON.stringify(res.headers));  
                res.setEncoding('utf-8');  
                res.on('data', function(chun) {  
                    console.info(chun);  
                    var resJob = JSON.parse(chun);
                    response.send(resJob.retcode);
                });  
                res.on('end', function() {  
                    console.log('No more data in response.********');
                });  
            });    
            req.on('error',function(err) {  
                console.error(err);  
            });
            req.end();
        }).catch((err) => {
            console.log(err)
        })
       
    }
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
 
var server = app.listen(8080, function () {

    var host = server.address().address
    var port = server.address().port
    
    console.log("JCL Job Server, The Location http://%s:%s", host, port)
})