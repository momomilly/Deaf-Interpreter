const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const vision = require('@google-cloud/vision')

// const router = express.Router();

app.use(express.json({ limit: '5mb' }), express.urlencoded({ extended: true, limit: '5mb' }));

app.use('/html', express.static(path.join(__dirname, 'html')));
// app.use(express.static(path.join(__dirname, 'html')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/html/index.html'));
  //__dirname : It will resolve to your project folder.
});


app.get('/word', function (req, res) {
  res.sendFile(path.join(__dirname + '/html/word.html'));
});

app.get('/sentence', function (req, res) {
  res.sendFile(path.join(__dirname + '/html/CAMtest4.html'));
});

app.get('/alphabet', function (req, res) {
  res.sendFile(path.join(__dirname + '/html/alphabet.html'));
});

app.get('/wordresult', function (req, res) {
  res.sendFile(path.join(__dirname + '/html/wordresult.html'));
});

app.get('/alphabetresult', function (req, res) {
  res.sendFile(path.join(__dirname + '/html/alphabetresult.html'));
});

// ({
//   keyFilename: './deaf-interpreter-2019-keyfile.json',
//   projectId: 'deaf-interpreter-2019'
// });

/*
set GOOGLE_APPLICATION_CREDENTIALS=C:\Users\JoyMonthita\Documents\GitHub\Deaf-Interpreter\server\deaf-interpreter-2019-keyfile.json
*/

app.post('/oldwordprocess', function (req, res) {
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

app.post('/wordprocess', function (req, res) {
  // console.log(req.body)
  // var base64Data = req.rawBody.replace(/^data:image\/png;base64,/, "");
  var base64Data = req.body.data.replace(/^data:image\/png;base64,/, "");
  // console.log(base64Data);
  fs.writeFile("html/out.png", base64Data, 'base64', async function (err) {
    const automl = require('@google-cloud/automl');
    const fs = require('fs');

    // Create client for prediction service.
    const client = new automl.PredictionServiceClient();
    const computeRegion = "us-central1";
  
    // work -> old
    // const projectId = "deaf-interpreter-2019";
    // const modelId = "ICN7231782644998995968";
  
    // work -> new
    const projectId = "deaffy";
    const modelId = "ICN6834339977883549696";
  
    const filePath = "html/out.png";

    const scoreThreshold = "0.5";

    // Get the full path of the model.
    const modelFullId = client.modelPath(projectId, computeRegion, modelId);

    // Read the file content for prediction.
    const content = fs.readFileSync(filePath, 'base64');

    const params = {};

    if (scoreThreshold) {
      params.score_threshold = scoreThreshold;
    }

    // Set the payload by giving the content and type of the file.
    const payload = {};
    payload.image = { imageBytes: content };

    // params is additional domain-specific parameters.
    // currently there is no additional parameters supported.
    const [response] = await client.predict({
      name: modelFullId,
      payload: payload,
      params: params,
    });
    console.log(`Prediction results:`);
    response.payload.forEach(result => {
      console.log(`Predicted class name: ${result.displayName}`);
      console.log(`Predicted class score: ${result.classification.score}`);
    });
    res.end(JSON.stringify(response));
  });
});

app.post('/alphabetprocess', function (req, res) {
  // console.log(req.body)
  // var base64Data = req.rawBody.replace(/^data:image\/png;base64,/, "");
  var base64Data = req.body.data.replace(/^data:image\/png;base64,/, "");
  // console.log(base64Data);
  fs.writeFile("html/alphabet.png", base64Data, 'base64', async function (err) {
    const automl = require('@google-cloud/automl');
    const fs = require('fs');

    // Create client for prediction service.
    const client = new automl.PredictionServiceClient();
    const computeRegion = "us-central1";
  
    // work -> old
    // const projectId = "deaf-interpreter-2019";
    // const modelId = "ICN7231782644998995968";
  
    // work -> new
    const projectId = "deaffy";
    const modelId = "ICN6834339977883549696";
  
    const filePath = "html/alphabet.png";

    const scoreThreshold = "0.5";

    // Get the full path of the model.
    const modelFullId = client.modelPath(projectId, computeRegion, modelId);

    // Read the file content for prediction.
    const content = fs.readFileSync(filePath, 'base64');

    const params = {};

    if (scoreThreshold) {
      params.score_threshold = scoreThreshold;
    }

    // Set the payload by giving the content and type of the file.
    const payload = {};
    payload.image = { imageBytes: content };

    // params is additional domain-specific parameters.
    // currently there is no additional parameters supported.
    const [response] = await client.predict({
      name: modelFullId,
      payload: payload,
      params: params,
    });
    console.log(`Prediction results:`);
    response.payload.forEach(result => {
      console.log(`Predicted class name: ${result.displayName}`);
      console.log(`Predicted class score: ${result.classification.score}`);
    });
    res.end(JSON.stringify(response));
  });
});


//add the router
// app.use('/', router);
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');
