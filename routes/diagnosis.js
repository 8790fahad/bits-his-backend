var express = require('express');
var router = express.Router();


router.get('/patientClarking', function(req, res, next) {
  res.locals.connection.query('select * from patientrecords', function (error, results, fields) {
      if(error) throw error;
      res.send(JSON.stringify(results));
  });
});

router.post('/clarking', function(req, res, next) {

  var user = req.body;
    res.locals.connection.query('insert into diagnosis (BMR, LLL, RLL, RUL, abdomen, allergy, asthmatic, athropometry_height, athropometry_weight, bloodpressure, cns, cvs, date, dehydration, development, diabetic, dresswith, drugHistory, eye_opening, generalexamination, headcircumference, historyOfPresentingComplaints, hypertensive, id, immunization, management_plan, mss, muac, nutrition, observation_request, obtsGyneaHistory, otherAllergies, otherSocialHistory, otherSysExamination, others, palor, partToDress, pastMedicalHistory, pbnh, problem1, problem2, problem3, problem4, problem5, provisionalDiagnosis1, provisionalDiagnosis2, provisionalDiagnosis3, provisionalDiagnosis4, provisionalDiagnosis5, pulse, respiratory, respiratoryRate, seen_by, social, tempreture, vital_height, vital_weight) values("'+req.body.BMR+'","'+req.body.LLL+'","'+req.body.RLL+'","'+req.body.RUL+'","'+req.body.abdomen+'","'+req.body.allergy+'","'+req.body.asthmatic+'","'+req.body.athropometry_height+'","'+req.body.athropometry_weight+'","'+req.body.bloodpressure+'","'+req.body.cns+'","'+req.body.cvs+'","'+req.body.date+'","'+req.body.dehydration+'","'+req.body.development+'","'+req.body.diabetic+'","'+req.body.dresswith+'","'+req.body.drugHistory+'","'+req.body.eye_opening+'","'+req.body.generalexamination+'","'+req.body.headcircumference+'","'+req.body.historyOfPresentingComplaints+'","'+req.body.hypertensive+'","'+req.body.id+'","'+req.body.immunization+'","'+req.body.management_plan+'","'+req.body.mss+'","'+req.body.muac+'","'+req.body.nutrition+'","'+req.body.observation_request+'","'+req.body.obtsGyneaHistory+'","'+req.body.otherAllergies+'","'+req.body.otherSocialHistory+'","'+req.body.otherSysExamination+'","'+req.body.others+'","'+req.body.palor+'","'+req.body.partToDress+'","'+req.body.pastMedicalHistory+'","'+req.body.pbnh+'","'+req.body.problem1+'","'+req.body.problem2+'","'+req.body.problem3+'","'+req.body.problem4+'","'+req.body.problem5+'","'+req.body.provisionalDiagnosis1+'","'+req.body.provisionalDiagnosis2+'","'+req.body.provisionalDiagnosis3+'","'+req.body.provisionalDiagnosis4+'","'+req.body.provisionalDiagnosis5+'","'+req.body.pulse+'","'+req.body.respiratory+'","'+req.body.respiratoryRate+'","'+req.body.seen_by+'","'+req.body.social+'","'+req.body.tempreture+'","'+req.body.vital_height+'","'+req.body.vital_weight+'")', function (error, results, fields) {
      if(error) throw error;
      res.send(JSON.stringify(results));
  });
});

router.get('/fullDiagnosis', function(req, res, next) {
  // const param = req.query.q;
  const param = req.query.q;

  res.locals.connection.query('select * from diagnosis where id = "'+param+'" ', function (error, results, fields) {
      if(error) throw error;
      res.send(JSON.stringify(results));
  });
});


module.exports = router;