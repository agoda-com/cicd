const express = require("express");
const app = express();

app.get('/', function (req, res) {
  res.send('<h1>Hello Janettre!!!!!!!!!!</h1>');
});

var port = process.env.PORT || 9000;
app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});

module.exports = app;
