var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs=require('fs');
// require more modules/folders here!



exports.handleRequest = function (req, res) {
  console.log("In handle Request Function");
  var headers=require('./http-helpers.js').headers;

  //req==OPTIONS
  //req==POST
  //if req is in sites
  //if req is archived
  var statusCode;
  headers['Allow'] = "HEAD, GET, PUT, DELETE, OPTIONS";
  if (req.method==='OPTIONS') {
    res.writeHead(200, headers)
    res.end();
  } else if (req.method==='POST') {
    //check to see if url is in file
    //  if in file and archived, serve up archive
    //  else, send to waiting page and add to file

    var message;
    req.on('data', function(chunk) {
      message= JSON.parse(chunk.toString());

      archive.isUrlArchived(message, function(present) {
        if (present) {
          //serve up html
          res.writeHead(200, headers);
          var fileName=path.join(process.cwd(), '../archives/sites', message);
          var fileStream = fs.createReadStream(fileName);
          fileStream.pipe(res);

        } else {
          //check if site site is in list
          //  if site not in list, add to list
          //redirect to loading.html
          archive.addUrlToList(message);
          res.writeHead(200, headers);
          var fileName=path.join(process.cwd(), '../web/public', 'loading.html');
          var fileStream = fs.createReadStream(fileName);
          fileStream.pipe(res);
        }

      });

    });
  }




  // res.end(archive.paths.list);
};
