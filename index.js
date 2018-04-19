var express = require('express');
var app = express();

var fs = require('fs');
var _ = require('lodash');
var engines = require('consolidate');

function getUserFilePath (username) {
  return path.join(__dirname, 'users', username) + '.json';
}

function getUser (username) {
  var user = JSON.parse(fs.readFileSync(getUserFilePath(username), {encoding: 'utf8'}))
  user.name.full = _.startCase(user.name.first + ' ' + user.name.last)
  _.keys(user.location).forEach(function (key) {
    user.location[key] = _.startCase(user.location[key])
  })
  return user
}

var users = [];

fs.readFile('users.json', {encoding: 'utf8'}, function(err, data) {
  if (err) throw err;

  JSON.parse(data).forEach(function (user) {
    user.name.full = _.startCase(user.name.first + " " + user.name.last);
    users.push(user);
  });

})

app.engine('hbs', engines.handlebars);

app.set('views', './views');
app.set('view engine', 'hbs');

app.use(express.static('images'));

app.get('/', function(req, res) {
  res.render('index', {users: users});
});

app.get(/big.*/, function(req, res, next) {
  console.log('BIG USER ACCESS');
  next(); //the next() function tells express to go to the next route handler
})

app.get('/:username', function (req, res) {
  var username = req.params.username
  var user = getUser(username)
  res.render('user', {
    user: user,
    address: user.location
  })
})

var server = app.listen(3000, function() {
  console.log("Server is running at http:localhost:" + server.address().port);
});
