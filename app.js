var createError = require('http-errors');
var express = require('express');
var port = process.env.PORT || 4000;
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
var mysql = require('mysql');
var cors = require('cors');
const cloudinary = require('cloudinary');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var patientrecordsRouter = require('./routes/patientrecords');
var diagnosisRouter = require('./routes/diagnosis');
var prescriptionrequestsRouter = require('./routes/prescriptionrequests');
var labRouter = require('./routes/lab');
var drugsRouter = require('./routes/drugs');
var transactionsRouter = require('./routes/transactions');
var accountRouter = require('./routes/account');

var app = express();

cloudinary.config({
  cloud_name: 'emaitee',
  api_key: '686693879643855',
  api_secret: 'JxH0QfWz-4k-HsMRQcQmWiM2_Jg'
})

app.post('/image-upload-single', (req, res) => {
  const image = req.body.file;
  cloudinary
    .uploader
    .upload(image.path)
    .then(result => res.json({ result }))
})


// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('trust proxy', 1); // trust first proxy
app.use(cors());
// app.use(cookieSession({
//   name: 'session',
//   keys: ['key1', 'key2'],
//   // Cookie Options
//   maxAge: 24 * 60 * 60 * 1000 // 24 hours
// }))

var db_config = {
  host: 'us-cdbr-iron-east-03.cleardb.net',
  user: 'bc15507e0f6489',
  password: 'b71496c7',
  database: 'heroku_9192c12aeae062f',
  connectionLimit: 10
  // port: '33060',
}

// var db_config = {
//   host: 'pscprime.com',
//   user: 'pscprime_admin',
//   password: 'admin@pscprime.com',
//   database: 'pscprime_hms',
//   connectionLimit: 10
//   // port: '33060',
// }

// var local_db_config = {
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'hms',
//   connectionLimit: 10
//   // port: '33060',
// }

app.use(function(req, res, next) {
  res.locals.connection = mysql.createPool(db_config);
  res.locals.connection.getConnection(function(err, connection) {
    if (err) {
      console.log('unable to connect to db', err)
      // setTimeout(() => handleDisconnect(res), 2000)
    } else {
      console.log('Database connection successful !!!');
    }
  });
  // res.locals.connection.on('error', (err) => {
  //   console.log('db error', err);
  //   if(err.code === 'PROTOCOL_CONNECTION_LOST') {
  //     handleDisconnect(res.locals)
  //   } else {
  //     throw err;
  //   }
  // });
  next();
});

// function handleDisconnect(res){
//   res.connection = mysql.createConnection(db_config);// = mysql.createConnection(db_config); // Recreate the connection, since
//                                                   // the old one cannot be reused.

//   res.connection.connect(function(err) {              // The server is either down
//     if(err) {                                     // or restarting (takes a while sometimes).
//       console.log('error when connecting to db:', err);
//       setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
//     }                                     // to avoid a hot loop, and to allow our node script to
//   });                                     // process asynchronous requests in the meantime.
//                                           // If you're also serving http, display a 503 error.
//   res.connection.on('error', function(err) {
//     console.log('db error', err);
//     if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
//       handleDisconnect();                         // lost due to either server restart, or a
//     } else {                                      // connnection idle timeout (the wait_timeout
//       throw err;                                  // server variable configures this)
//     }
//   });
// }

// // connection configurations
// app.use(function(req, res, next) {
//   res.locals.connection = mysql.createConnection(db_config);
//   res.locals.connection.connect(function(err) {
//     if (err) {
//       console.log('unable to connect to db', err)
//       setTimeout(() => handleDisconnect(res), 2000)
//     } else {
//       console.log('Database connection successful !!!');
//     }
//   });
//   res.locals.connection.on('error', (err) => {
//     console.log('db error', err);
//     if(err.code === 'PROTOCOL_CONNECTION_LOST') {
//       handleDisconnect(res.locals)
//     } else {
//       throw err;
//     }
//   });
//   next();
// });

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/patientrecords', patientrecordsRouter);
app.use('/diagnosis', diagnosisRouter);
app.use('/prescriptionrequests', prescriptionrequestsRouter);
app.use('/lab', labRouter);
app.use('/drugs', drugsRouter);
app.use('/transactions', transactionsRouter);
app.use('/account', accountRouter);

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

app.listen(port, () => console.log(`App is listening on http://localhost:${port}`));
