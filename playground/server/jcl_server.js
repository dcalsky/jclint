const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const hostname = '10.60.45.8';
const username = '';
const port = 8800;
let cookie = null;

// auth
app.post('/auth', (req, res) => {
  const { userid, password } = req.body;
  const b = Buffer.from(`${userid}:${password}`);
  const base64string = b.toString('base64');
  const options = {
    hostname,
    port,
    path: '/zosmf',
    rejectUnauthorized: false,
    method: 'POST',
    headers: {
      Authorization: `Basic ${base64string}`,
    },
  };
  const response = res;
  var req = https.request(options, (res) => {
    cookie = res.headers['set-cookie'][0].split(';')[0];
    res.setEncoding('utf-8');

    response.send(cookie);
    res.on('data', (chun) => {});
    res.on('end', () => {});
  });
  req.on('error', (err) => {
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
  const { job, userid, password } = req.body;
  const response = res;
  // if the cookie is no null and , then submit the job
  if (cookie == null || this.username != req.body.userid) {
    const promise = new Promise((resolve, reject) => {
      const b = new Buffer(`${userid}:${password}`);
      const base64string = b.toString('base64');
      // console.log(base64string)
      const options = {
        hostname,
        port,
        path: '/zosmf',
        rejectUnauthorized: false,
        method: 'POST',
        headers: {
          Authorization: `Basic ${base64string}`,
        },
      };
      const req = https.request(options, (res) => {
        // console.log('Status:', res.statusCode);
        // console.log('headers:', JSON.stringify(res.headers));
        // console.log('Cookie:', res.headers['set-cookie'][0].split(';')[0])
        console.log(res.headers);
        const cookie = res.headers['set-cookie'][0].split(';')[0];
        res.setEncoding('utf-8');
        resolve(cookie);
      });
      req.on('error', (err) => {
        reject(err);
      });
      req.end();
    });
    // await promise is wrong
    promise
      .then((cookie) => {
        this.cookie = cookie;
        const postData = job;
        const options = {
          hostname,
          port: 8800,
          path: '/zosmf/restjobs/jobs',
          rejectUnauthorized: false,
          method: 'PUT',
          headers: {
            'Content-Type': 'text/plain',
            Cookie: cookie,
          },
        };
        const req = https.request(options, (res) => {
          res.setEncoding('utf-8');
          res.on('data', (chun) => {
            // get data
            const resJob = JSON.parse(chun);
            const jobDetail = {
              jobname: resJob.jobname,
              jobid: resJob.jobid,
              url: resJob.url,
            };
            response.send(JSON.stringify(jobDetail));
          });
          res.on('end', (err) => {});
        });
        req.on('error', (err) => {
          console.error(err);
        });
        req.write(postData);
        req.end();
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    const options = {
      hostname,
      port: 8800,
      path: '/zosmf/restjobs/jobs',
      rejectUnauthorized: false,
      method: 'PUT',
      headers: {
        'Content-Type': 'text/plain',
        Cookie: cookie,
      },
    };
    var req = https.request(options, (res) => {
      res.setEncoding('utf-8');
      res.on('data', (chun) => {
        // get data
        const resJob = JSON.parse(chun);
        const jobDetail = {
          jobname: resJob.jobname,
          jobid: resJob.jobid,
          url: resJob.url,
        };
        response.send(JSON.stringify(jobDetail));
      });
      res.on('end', (err) => {});
    });
    req.on('error', (err) => {
      console.error(err);
    });
    req.write(postData);
    req.end();
  }
});

// get the job status
app.get('/zos/job/:job_name/:job_id', (req, res) => {
  const options = {
    hostname,
    port: 8800,
    rejectUnauthorized: false,
    path: `/zosmf/restjobs/jobs/${req.params.job_name}/${req.params.job_id}`,
    method: 'get',
    headers: {
      Cookies: cookie,
    },
  };
  var req = https.request(options, (res) => {
    res.setEncoding('utf-8');
    res.on('data', (chun) => {
      console.log('body---------------------------------\r\n');
      console.info(chun);
    });
    res.on('end', () => {
      console.log('No more data in response.********');
    });
  });
  req.on('error', (err) => {
    console.error(err);
  });
  req.write(postData);
  req.end();
  res.send('HELLO');
});

// get the detail output
app.get('/zos/job/:job_name/:job_id/files/:id/records', (req, res) => {
  const options = {
    hostname,
    port: 8800,
    rejectUnauthorized: false,
    path: `/zosmf/restjobs/jobs/${req.params.job_name}/${req.params.job_id}${+'/files/'}${
      req.params.id
    }/records`,
    method: 'get',
    headers: {
      Cookies: cookie,
    },
  };
  var req = https.request(options, (res) => {
    console.log('Status:', res.statusCode);
    console.log('headers:', JSON.stringify(res.headers));
    res.setEncoding('utf-8');
    res.on('data', (chun) => {});
    res.on('end', () => {});
  });
  req.on('error', (err) => {
    console.error(err);
  });
  req.write(postData);
  req.end();
  res.send('HELLO');
});
// get the list of output
app.get('/zos/job/:job_name/:job_id/files', (req, res) => {
  const options = {
    hostname,
    port: 8800,
    rejectUnauthorized: false,
    path: `/zosmf/restjobs/jobs/${req.params.job_name}/${req.params.job_id}${+'/files'}`,
    method: 'get',
    headers: {
      Cookies: cookie,
    },
  };
  var req = https.request(options, (res) => {
    console.log('Status:', res.statusCode);
    console.log('headers:', JSON.stringify(res.headers));
    res.setEncoding('utf-8');
    res.on('data', (chun) => {});
    res.on('end', () => {});
  });
  req.on('error', (err) => {
    console.error(err);
  });
  req.write(postData);
  req.end();
  res.send('HELLO');
});

var server = app.listen(8084, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log('JCL Job Server, The Location http://%s:%s', host, port);
});
