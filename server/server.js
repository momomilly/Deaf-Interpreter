const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

app.use('/html',express.static(path.join(__dirname,'html')));


router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/html/index.html'));
  //__dirname : It will resolve to your project folder.


});

router.get('/word',function(req,res){
  res.sendFile(path.join(__dirname+'/html/word.html'));
});

router.get('/sitemap',function(req,res){
  res.sendFile(path.join(__dirname+'/sitemap.html'));
});

//add the router
app.use('/', router);
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');
