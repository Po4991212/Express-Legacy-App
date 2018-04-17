var express = require('express');
var app = express();

var fs = require('fs');
var _ = require('lodash');
var users = [];

fs.readFile('users.json', {encoding: 'utf8'}, function(err, data) {
  if (err) throw err;

  JSON.parse(data).forEach(function (user) {
    user.name.full = _.startCase(user.name.first + " " + user.name.last);
    users.push(user);
  });

})
app.get('/', function(req, res) {
  var buffer = '';

  users.forEach(function (user) {
    buffer += '<a href="/' + user.username + '">' + user.name.full + '</a><br>';
  })
  res.send(buffer);
});

app.get(/big.*/, function(req, res, next) {
  console.log('BIG USER ACCESS');
  next(); //the next() function tells express to go to the next route handler
})

app.get('/:username', function(req, res) {
  var username = req.params.username; //params.username needs to match the app.get url path
  res.send(username); //username parameter passed here needs to match variable used for callback
})

var server = app.listen(3000, function() {
  console.log("Server is running at http:localhost:" + server.address().port);
});
