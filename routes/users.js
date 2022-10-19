var express = require('express');
var router = express.Router();

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get('/usersList', function(req, res, next) {
  res.locals.connection.query('select * from users', function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    res.send(JSON.stringify(results));
  });
});

router.post('/new', function(req, res, next) {
  var user = req.body;
  res.locals.connection.query(
    'insert into users(name,username,password,role,speciality,records,doctors,pharmacy,admin) values("' +
      req.body.name +
      '","' +
      req.body.username +
      '","' +
      req.body.password +
      '","' +
      req.body.role +
      '","' +
      req.body.speciality +
      '","' +
      req.body.records +
      '","' +
      req.body.doctors +
      '","' +
      req.body.pharmacy +
      '","' +
      req.body.admin +
      '")',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
    }
  );
});

router.get('/edit', function(req, res, next) {
  res.locals.connection.query(
    'update members set name = "' +
      req.body.name +
      '", email = "' +
      req.body.email +
      '" where id = "' +
      req.body.id +
      '"',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
    }
  );
});

router.get('/delete', function(req, res, next) {
  var user = req.body;
  res.locals.connection.query(
    'DELETE from members where name = ' + req.body.name + '',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
    }
  );
});

router.get('/doctorsList', function(req, res, next) {
  res.locals.connection.query(
    'select * from users where role="doctor"',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));

      res.locals.connection.end()
    }
  );
});

module.exports = router;
