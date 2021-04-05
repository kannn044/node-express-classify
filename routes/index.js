let express = require('express');
let router = express.Router();
let limdu = require('limdu');
let XLSX = require('xlsx')

let cf = new limdu.classifiers.DecisionTree();

/* GET home page. */
router.get('/', function (req, res, next) {
  let riskScore = req.query.riskScore;
  let issrAmt = req.query.issrAmt;
  let workbook = XLSX.readFile('./data/data.xlsx');
  let sheet_name_list = workbook.SheetNames;
  let xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

  let data = [];
  for (let v of xlData) {
    const obj = { input: { "risk_score": v.risk_score, "issr_amt": v.issr_amt }, output: v.status }
    data.push(obj);
  }

  cf.trainBatch(data);
  let predict = cf.classify({ "risk_score": riskScore, "issr_amt": issrAmt });

  res.send({ ok: true, "score": riskScore, "issr": issrAmt, "predict": predict })
});

module.exports = router;
