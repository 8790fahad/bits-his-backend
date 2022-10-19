var express = require('express');
var router = express.Router();

router.post('/addHead', function(req, res, next) {
  var values = req.body;
  var sql = 'addHead(' + values.headtitle + ',' + values.headcode + ',' + values.description + ',' + values.amount + ')';
//   console.log(values);
  res.locals.connection.query(sql, function(error, results, fields) {
    if (error) throw error;
    res.send(JSON.stringify(results));
  });
});

module.exports = router;
