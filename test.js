var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
var mysql = require('mysql');
var mysqlx = require('@mysql/xdevapi');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var patientrecordsRouter = require('./routes/patientrecords');
var diagnosisRouter = require('./routes/diagnosis');
var drugsRouter = require('./routes/drugs');
var labRouter = require('./routes/lab');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('trust proxy', 1); // trust first proxy
app.use(cors());
var db
// connection configurations
//connect to server
var client = mysqlx.getClient(
  { user: 'root', host: 'localhost', port: 33060 },
  {
    pooling: {
      enabled: true,
      maxIdleTime: 5000,
      maxSize: 25,
      queueTimeout: 20000,
    },
  }
);

client
  .getSession()
  .then(session => {
    console.log(session.inspect());
    return session.close(); // the connection becomes idle in the client pool
  })
  .then(() => {
    return client.getSession();
  })
  .then(function(session) {
    db = session.getSchema('test');
    //create new collection 'my_collection'
    return db.createCollection('my_collection');
  })
  .then(function(myColl) {
    //insert documents
    return Promise.all([
      myColl.add({ name: 'Isah', age: '10' }).execute(),
      myColl.add({ name: 'User', age: '39' }).execute(),
      myColl.add({ name: 'Javascript', age: '24' }).execute(),
    ]).then(function() {
      //find a document
      return myColl
        .find('name like :name && age < :age')
        .bind({ name: 'S%', age: 20 })
        .limit(1)
        .execute(function(doc) {
          //print doc
          console.log(doc);
        });
    });
  })
  .then(function(docs) {
    //Drop the collection
    return db.dropCollection('my_collection');
  })
  .catch(function(err) {
    console.log(err);
  })
  .then(session => {
    console.log(session.inspect());
    return client.close(); // closes all connections and destroys the pool
  });

// mysqlx
//   .getSession({
//     user: 'root',
//     password: '',
//     host: 'localhost',
//     port: '33060',
//   })
//   .then(function(session) {
//     db = session.getSchema('test');
//     //create new collection 'my_collection'
//     return db.createCollection('my_collection');
//   })
//   .then(function(myColl) {
//     //insert documents
//     return Promise.all([
//       myColl.add({ name: 'Isah', age: '10' }).execute(),
//       myColl.add({ name: 'User', age: '39' }).execute(),
//       myColl.add({ name: 'Javascript', age: '24' }).execute(),
//     ]);
//   })
//   .then(function(docs) {
//     //Drop the collection
//     return db.dropCollection('my_collection');
//   })
//   .catch(function(err) {
//     console.log(err);
//   });
// app.use(function(req, res, next) {
//   res.locals.connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'hms',
//   });
//   res.locals.connection.connect(function(err) {
//     if (!err) {
//       console.log('Database connection successful !!!');
//     } else {
//       console.log('Database connection failure !!!');
//     }
//   });
//   next();
// });

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/patientrecords', patientrecordsRouter);
app.use('/diagnosis', diagnosisRouter);
app.use('/drugs', drugsRouter);
app.use('/lab', labRouter);

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

app.listen(4000);
