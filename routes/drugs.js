var express = require('express');
var router = express.Router();

router.post('/addDrugs', function(req, res, next) {
  var values = req.body;
  var sql =
    'insert into drugs(date_brought,drug,unit_of_issue,quantity,price,expiry_date) values ?';

  console.log(values);
  res.locals.connection.query(sql, [values], function(error, results, fields) {
    if (error) throw error;
    res.send(JSON.stringify(results));
  });
});

router.get('/allDrugs', function(req, res, next) {
  res.locals.connection.query('select * from drugs', function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    res.send(JSON.stringify(results));
  });
});

router.get('/getPriceByDrugname', function(req, res, next) {
  res.locals.connection.query(
    'SELECT price from drugs where drug="' + req.query.drug + '"',
    function(error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
    }
  );
});

module.exports = router;
