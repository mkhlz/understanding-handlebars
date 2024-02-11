var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs');
const hbs = require('hbs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// partials setup
function registerPartials(partialsDir) {
  const filenames = fs.readdirSync(partialsDir);

  filenames.forEach(function (filename) {
    const currentPath = path.join(partialsDir, filename);
    let fileInfo = fs.statSync(currentPath);
    if (fileInfo.isDirectory()) {
      return registerPartials(currentPath);
    }

    var matches = /^([^.]+).hbs$/.exec(filename);
    if (!matches) {
      return;
    }
    var name = matches[1];
    var template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
    hbs.registerPartial(name, template);
  });
}

registerPartials(path.join(__dirname, '/views/partials'));

function registerHelpers(dep) {
  const helpers = require('./views/HandlebarsHelpers')(dep, require('moment'));
  Object.keys(helpers).forEach(key => dep.registerHelper(key, helpers[key]));
}

registerHelpers(hbs);

// bootstrap and jquery setup
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))

// static folder
app.use('/static', express.static('assets'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
