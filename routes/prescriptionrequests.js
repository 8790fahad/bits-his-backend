var express = require('express');
var router = express.Router();

router.post('/submitDrug', function(req, res, next) {
  var sql =
    'insert into prescriptionrequests(drug,dosage,duration,period,frequency,price,drug_status,date,patient_id,seen_by) values ?';
  var values = req.body;

  res.locals.connection.query(sql, [values], function(error, results, fields) {
    if (error) throw error;
    res.send(JSON.stringify(results));
  });
});

router.post('/addDrugWithQuantity', function(req, res, next) {
  var user = req.body;
  res.locals.connection.query(
    'insert into prescriptionrequests(date,drug,price,dosage,patient_id,seen_by,drug_status,quantity) values("' +
      req.body.date +
      '","' +
      req.body.drug +
      '","' +
      req.body.price +
      '","' +
      req.body.dosage +
      '","' +
      req.body.id +
      '", "' +
      req.body.seen_by +
      '", "' +
      req.body.drug_status +
      '","' +
      req.body.quantity +
      '")',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
    }
  );
});

router.get('/pendingDrugsList', function(req, res, next) {
  res.locals.connection.query(
    'select * from prescriptionrequests where drug_status="pending" ',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
    }
  );
});

router.get('/getPrescriptionById', function(req, res, next) {
  res.locals.connection.query(
    'select * from prescriptionrequests where patient_id="' +
      req.query.id +
      '" and drug_status="pending" ',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
    }
  );
});

router.get('/allDrugs', function(req, res, next) {
  res.locals.connection.query('select * from prescriptionrequests', function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    res.send(JSON.stringify(results));
  });
});

router.get('/pendingRequests', function(req, res, next) {
  res.locals.connection.query(
    'SELECT id,firstname,surname,DOB,gender,phoneNo,assigned_to FROM `patientrecords` WHERE id in (SELECT patient_id from prescriptionrequests where drug_status = "pending")',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
    }
  );
});

router.post('/dispenseSingle', function(req, res, next) {
  res.locals.connection.query(
    // 'update prescriptionrequests set quantity_dispensed = "' +
    //   req.body.quantity_dispensed +
    //   '", drug_status = "completed" where drug_request_id = "' +
    //   req.body.drug_request_id +
    //   '"',
    'call dispensed(' +
      req.body.patient_id +
      ', ' +
      req.body.drug_request_id +
      ', ' +
      req.body.quantity_dispensed +
      ')',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
    }
  );
});

// router.post('/dispense', function(req, res, next) {
//   req.body.forEach(obj => {
//     res.locals.connection.query(
//     'call dispensed3(' +
//       obj.patient_id +
//       ', ' +
//       obj.drug_request_id +
//       ', ' +
//       obj.quantity_dispensed +
//       ')',
//     function(error, results, fields) {
//       if (error) throw error;
//       res.send(JSON.stringify(results));
//     }
//   );
//   })
// });

module.exports = router;
