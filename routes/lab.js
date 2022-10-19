var express = require('express');
var router = express.Router();

router.post('/getLab', function(req, res, next) {
  var user = req.body;
  res.locals.connection.query(
    'insert into lab(date,patient_id,labName,seen_by,status,test_status,sample) values("' +
      req.body.date +
      '","' +
      req.body.id +
      '","' +
      req.body.labName +
      '","' +
      req.body.seen_by +
      '","' +
      req.body.status +
      '","' +
      req.body.test +
      '","' +
      req.body.sample +
      '")',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
    }
  );
});

router.post('/submitLab', function(req, res, next) {
  var values = req.body;
  var sql =
    'insert into lab(test,sample,date,patient_id,seen_by,test_status) values ?';

  console.log(values);
  res.locals.connection.query(sql, [values], function(error, results, fields) {
    if (error) throw error;
    res.send(JSON.stringify(results));
  });
});

// router.post('/analyzeSample', function(req, res, next) {
//   var values = req.body;
//   values.forEach(val => {
//     let sql =
//       'UPDATE lab SET `result`="' +
//       val[1] +
//       '",`appearance`="' +
//       val[2] +
//       '",`microscopy`="' +
//       val[3] +
//       '",`culture`="' +
//       val[4] +
//       '", test_status="sample_analyzed", `antibiotic`="' +
//       val[5] +
//       '" WHERE test_id="' +
//       val[0] +
//       '"';
//     console.log(sql);
//     res.locals.connection.query(sql, function(error, results, fields) {
//       if (error) throw error;
//       res.send(JSON.stringify(results));
//     });
//   });
// });

router.post('/analyzeSample', function(req, res, next) {
  res.locals.connection.query(
    'update lab set appearance="' +
      req.body.appearance +
      '", microscopy="' +
      req.body.microscopy +
      '", culture="' +
      req.body.culture +
      '", antibiotic="' +
      req.body.antibiotic +
      '", test_status="sample_analyzed" where test_id="' +
      req.body.test_id +
      '"',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
    }
  );
});

router.get('/pendingRequests', function(req, res, next) {
  res.locals.connection.query(
    'SELECT id,firstname,surname,DOB,gender,phoneNo FROM `patientrecords` WHERE id in (SELECT patient_id from lab where test_status = ("pending" or "sample_collected" or "sample_analyzed"))',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
    }
  );
});

// WARNING!!!!
// This is not a repetition!, the two routes are being used differently
router.get('/pending', function(req, res, next) {
  res.locals.connection.query(
    'SELECT id,firstname,surname,DOB,gender,phoneNo FROM `patientrecords` WHERE id in (SELECT patient_id from lab where test_status = "pending")',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
    }
  );
});

router.post('/submitSamplesCollected', function(req, res, next) {
  var user = req.body;
  var sql = 'call UpdateSampleCollected(?)';
  var val = user.join(',');

  // UPDATE `lab` SET `test_status`='sample_collected' WHERE id IN ('5210', '5290', '5190')
  res.locals.connection.query(sql, val, function(error, results, fields) {
    if (error) throw error;
    res.send(JSON.stringify(results));
  });
});

router.get('/getSampleCollected', function(req, res, next) {
  res.locals.connection.query(
    'SELECT id,firstname,surname,DOB,gender,phoneNo FROM `patientrecords` WHERE id in (SELECT patient_id from lab where test_status = "sample_collected")',
    // 'select * from lab where test_status="sample_collected" ',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
    }
  );
});

router.get('/sampleAnalyzed', function(req, res, next) {
  res.locals.connection.query(
    'SELECT id,firstname,surname,DOB,gender,phoneNo FROM `patientrecords` WHERE id in (SELECT patient_id from lab where test_status = "sample_analyzed")',
    // 'select * from lab where test_status="sample_analyzed" ',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
    }
  );
});

router.get('/testCompleted', function(req, res, next) {
  res.locals.connection.query(
    'select * from lab where test_status="ready" ',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
    }
  );
});

router.post('/submitResult', function(req, res, next) {
  var user = req.body;
  res.locals.connection.query(
    'INSERT INTO `lab`(`date`, `patient_id`, `test`, `test_status`, `seen_by`, `sample`, `result`, `appearance`, `microscopy`, `culture`, `antibiotic`) VALUES("' +
      req.body.date +
      '","' +
      req.body.id +
      '","' +
      req.body.labName +
      '","' +
      req.body.seen_by +
      '","' +
      req.body.status +
      '","' +
      req.body.test +
      '","' +
      req.body.sample +
      '")',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
    }
  );
});

router.post('/saveLabResult', function(req, res, next) {
  // var user = req.body;
  res.locals.connection.query(
    'update lab set  antibiotic = "' +
      req.body.antibiotic +
      '",appearance = "' +
      req.body.appearance +
      '", culture = "' +
      req.body.culture +
      '",microscopy = "' +
      req.body.microscopy +
      '", result = "' +
      req.body.result +
      '", test_status = "sample_analysed" where test_id = "' +
      req.body.test_id +
      '"',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
    }
  );
});

router.post('/savePathologicalComment', function(req, res, next) {
  var user = req.body;
  res.locals.connection.query(
    'update lab set  comment = "' +
      req.body.comment +
      '", test_status = "ready" where test_id = "' +
      req.body.test_id +
      '"',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
    }
  );
});

router.get('/getReqById', function(req, res, next) {
  res.locals.connection.query(
    'select * from lab where patient_id=' + req.query.id,
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
    }
  );
});

router.get('/pendingReqById', function(req, res, next) {
  res.locals.connection.query(
    'SELECT * FROM `lab` WHERE patient_id=' + req.query.id+' and test_status="pending"',
    // 'select * from lab where patient_id=' + req.query.id+' and ',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
    }
  );
});

router.get('/collectedSamplesById', function(req, res, next) {
  res.locals.connection.query(
    'SELECT * FROM `lab` WHERE patient_id=' + req.query.id+' and test_status="sample_collected"',
    // 'select * from lab where patient_id=' + req.query.id+' and ',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
    }
  );
});

router.get('/analyzedSamplesById', function(req, res, next) {
  res.locals.connection.query(
    'SELECT * FROM `lab` WHERE patient_id=' + req.query.id+' and test_status="sample_analyzed"',
    // 'select * from lab where patient_id=' + req.query.id+' and ',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
    }
  );
});

router.get('/fetchResult', function(req, res, next) {
  res.locals.connection.query(
    'select date,test,sample,result, appearance, microscopy, culture, antibiotic from lab where patient_id=' +
      req.query.id,
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
    }
  );
});

module.exports = router;
