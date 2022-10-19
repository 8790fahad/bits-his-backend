var express = require('express');
var router = express.Router();

router.post('/addNewRecord', function(req, res, next) {
  var values = req.body;
  var sql =
    'insert into lab(test,sample,date,patient_id,seen_by,test_status) values ?';

  console.log(values);
  res.locals.connection.query(sql, [values], function(error, results, fields) {
    if (error) throw error;
    res.send(JSON.stringify(results));
  });
});

module.exports = router;
