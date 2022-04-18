const express = require('express')
const app = express();
const port = 8081;
const schedule=require('node-schedule');

var fs = require('fs')
var https = require('https');//For accessing https url we need this module instead of http.

var file_name = 'data.xml'//This will be the name of file we will be generating.
var DOWNLOAD_DIR =__dirname+'/';
var xml2js = require('xml2js');

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '',
  user     : '',
  password : '',
  database : ''
}, {multipleStatements: true});


//=======================================================
schedule.scheduleJob('01 * * * *', function(){
console.log('Download')
console.log('Time ' + Date())
console.log(' ')
download()
});

schedule.scheduleJob('03 * * * *', function(){
console.log('Update')
console.log('Time ' + Date())
banana()
console.log(' ')
console.log(' ')
});
//=======================================================

//PUBLIC

app.use(
  function (req, res, next){
    console.log('Time ' + Date())
    next();
  }, 
  express.static('public')
)



// //RESPONSE
// app.get('/', (req, res) => {
//   res.sendFile('public/index.html', {root });
//   console.log('Site Visited')
//   console.log('Time ' + Date())
//   // banana()
//   console.log(' ')
//   console.log(' ')
// });

//OPEN
app.listen(port, () => {
  console.log(`Example app listning on port ${port}!`)
   download()
   banana()
});





function download(){
 file_url='https://feeds.bbci.co.uk/news/rss.xml'
 file =
 fs.createWriteStream(DOWNLOAD_DIR +file_name,{'flags': 'w'});
 const request = https.get(file_url, function(response) {
 response.pipe(file);
 });
}

// download()





var parser = new xml2js.Parser();



var parseString = require("xml2js").parseString;
var stripPrefix = require("xml2js").processors.stripPrefix;




function banana() {
  xml = fs.readFileSync("data.xml", "utf8");
  parseString(xml, { tagNameProcessors: [stripPrefix] }, function(err, result) {
    if (err) throw err;
      i=0;
      connec_string=''
      logger(Date());
      for (let i = 1; i < 6; i++) {
        atitle = result.rss.channel[0].item[i].title
        aretitle = JSON.stringify(atitle).slice(2,-2)
        console.log(aretitle)
        artitle=aretitle.replace("'", "").replace("'", "")
        console.log(artitle)
        ardate = new Date().toISOString().slice(0, 19).replace('T', ' ')
        arrank=i
        console.log(artitle+ardate+arrank)
        connec_string = ' insert into article values (\'' + artitle+ '\', \'' + ardate + '\',\'' + arrank +'\');'
        mysqler(connec_string)
        logger(connec_string)
      
      }

    })
  }



function logger(infodta) {
    fs.appendFile('logger.txt', '\n'+infodta, (err) => {
    if (err) throw err;})
}


function mysqler(arstring) {


connection.query(arstring, function (error, results, fields) {
  console.log(arstring)

  })

}


function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}   