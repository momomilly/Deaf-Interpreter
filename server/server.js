const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const vision = require('@google-cloud/vision')

// const router = express.Router();

app.use(express.json({ limit: '5mb' }), express.urlencoded({ extended: true, limit: '5mb' }));

app.use('/html', express.static(path.join(__dirname, 'html')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/html/index.html'));
  //__dirname : It will resolve to your project folder.
});

app.get('/word', function (req, res) {
  res.sendFile(path.join(__dirname + '/html/word.html'));
});

// ({
//   keyFilename: './deaf-interpreter-2019-keyfile.json',
//   projectId: 'deaf-interpreter-2019'
// });

/*
set GOOGLE_APPLICATION_CREDENTIALS=C:\Users\JoyMonthita\Documents\GitHub\Deaf-Interpreter\server\deaf-interpreter-2019-keyfile.json
*/

app.post('/wordprocess', function (req, res) {
  // console.log(req.body)
  // var base64Data = req.rawBody.replace(/^data:image\/png;base64,/, "");
  var base64Data = req.body.data.replace(/^data:image\/png;base64,/, "");
  // console.log(base64Data);
  fs.writeFile("out.png", base64Data, 'base64', async function (err) {
    // Creates a client
    const client = new vision.ImageAnnotatorClient();
    // Performs label detection on the image file
    const [result] = await client.labelDetection('./out.png');
    const labels = result.labelAnnotations;
    console.log('---- Labels: ----');
    labels.forEach(label => console.log(label.description));
  });
});

//add the router
// app.use('/', router);
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');
