var express = require('express');
var router = express.Router();

//list patient records
router.get('/patientlist', function(req, res, next) {
  res.locals.connection.query('select * from patientrecords', function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    res.json({ results });
  res.locals.connection.end()
  });
});

router.get('/unassignedPatientlist', function(req, res, next) {
  res.locals.connection.query(
    'select * from patientrecords where assigned_to =""',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
      res.locals.connection.end()
    }
  );
});

router.get('/patientClarking', function(req, res, next) {
  res.locals.connection.query(
    'select * from patientrecords where id=1 ',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
      res.locals.connection.end()
    }
  );
});

router.get('/fetchUserById', function(req, res, next) {
  res.locals.connection.query(
    'select * from patientrecords where id="' + req.query.id + '" ',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
      res.locals.connection.end()
    }
  );
});

router.get('/doctor', function(req, res, next) {
  const param = req.query.q;
  res.locals.connection.query(
    'select * from patientrecords where assigned_to = "' + param + '" ',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
      res.locals.connection.end()
    }
  );
});

router.get('/getId', function(req, res, next) {
  res.locals.connection.query(
    'select max(id) + 1 from patientrecords',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify({ id: results[0]["max(id) + 1"]}));
      res.locals.connection.end()
    }
  );
});

router.post('/new', function(req, res, next) {
  var user = req.body;
  res.locals.connection.query(
    'insert into patientrecords(id,firstname,surname,Gender,age,maritalstatus,DOB,tribe,religion, phoneNo,email,nationality,state,lga,occupation,address,kinName,kinRelationship,kinPhone,kinEmail,kinoccupation,kinAddress) values("' +
      req.body.id +
      '","' +
      req.body.firstname +
      '","' +
      req.body.surname +
      '","' +
      req.body.Gender +
      '","' +
      req.body.age +
      '", "' +
      req.body.maritalstatus +
      '", "' +
      req.body.DOB +
      '", "' +
      req.body.tribe +
      '","' +
      req.body.religion +
      '" ,"' +
      req.body.phoneNo +
      '", "' +
      req.body.email +
      '", "' +
      req.body.nationality +
      '", "' +
      req.body.state +
      '","' +
      req.body.lga +
      '","' +
      req.body.occupation +
      '", "' +
      req.body.address +
      '", "' +
      req.body.kinName +
      '","' +
      req.body.kinRelationship +
      '","' +
      req.body.kinPhone +
      '","' +
      req.body.kinEmail +
      '","' +
      req.body.kinOccupation +
      '","' +
      req.body.kinAddress +
      '" )',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
      res.locals.connection.end()
    }
  );
});

router.post('/upload', function(req, res, next) {
  var user = req.body;
  res.locals.connection.query(
    'insert into patientrecords(passport) values("' + req.body.fd + '")',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
      res.locals.connection.end()
    }
  );
});

// search for patient via username and first name
// router.get('/', function(req, res) {
//   var patientID = req.param('id');
//   var patientFirstName = req.param('firstname');
//   var patientSurname = req.param('surname');
//   res.send(patientID + '' + '');
// });

router.post('/edit', function(req, res, next) {
  var user = req.body;
  res.locals.connection.query(
    'update patientrecords set  firstname = "' +
      req.body.firstname +
      '",surname = "' +
      req.body.surname +
      '",Gender = "'+ req.body.Gender + '",age = "'+ req.body.age + '",maritalstatus = "'+ req.body.maritalstatus + '",DOB = "'+ req.body.DOB + '",tribe = "'+ req.body.tribe + '",religion = "'+ req.body.religion + '",phoneNo = "'+ req.body.phoneNo + '",email = "'+ req.body.email + '",nationality = "'+ req.body.nationality + '",state = "'+ req.body.state + '",lga = "'+ req.body.lga + '",occupation = "'+ req.body.occupation + '",address = "'+ req.body.address + '",kinName = "'+ req.body.kinName + '",kinRelationship = "'+ req.body.kinRelationship + '",kinPhone = "'+ req.body.kinPhone + '",kinEmail = "'+ req.body.kinEmail + '",kinOccupation = "'+ req.body.kinOccupation + '",kinAddress = "'+ req.body.kinAddress + '" where id = "'+ req.body.id + '"',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
      res.locals.connection.end()
    }
  );
});

router.post('/delete', function(req, res, next) {
  var user = req.body;
  res.locals.connection.query(
    'delete from patientrecords where id= "' + req.body.id + '"',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
      res.locals.connection.end()
    }
  );
});

router.post('/assign', function(req, res, next) {
  var user = req.body;
  res.locals.connection.query(
    'update patientrecords set  assigned_to = "' +
      req.body.assigned_to +
      '"  where id = "' +
      req.body.id +
      '"',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
      res.locals.connection.end()
    }
  );
});

router.get('/patientAssignedToday', function(req, res, next) {
  res.locals.connection.query(
    'SELECT assigned_to Doctors, COUNT(id) Patients FROM `patientrecords` where assigned_to !="" GROUP by assigned_to ORDER BY assigned_to',
    function(error, results, fields) {
      console.log(results);
      if (error) throw error;
      res.send(JSON.stringify(results));
      res.locals.connection.end()
    }
  );
});

router.get('/fetchByDoctor', function(req, res, next) {
  var user = req.body;
  res.locals.connection.query(
    'select * from patientrecords where assigned_to = "' +
      req.body.assigned_to +
      '"',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
      res.locals.connection.end()
    }
  );
});

router.get('/getAll', function(req, res, next) {
  var user = req.body;
  res.locals.connection.query('select * from patientrecords', function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    res.send(JSON.stringify(results));
    res.locals.connection.end()    
  });
});

module.exports = router;
