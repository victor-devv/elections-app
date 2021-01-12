const path = require("path");

const express = require("express");
const app = express();
app.use(express.json());

const rootDir = require("../helpers/path");

const router = express.Router();

const dbService = require("../dbservice");
// const { response } = require("express");

router.get("/", (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "all-results.html"));
});

//read
router.get("/lgas", (req, res, next) => {
  const db = dbService.getDbServiceInstance();

  const result = db.getLGAs();

  result
    .then((data) =>
      res.json({
        data: data,
      })
    )
    .catch((err) => console.log(err));
});

router.post("/lgas-pollunit", (req, res, next) => {
  const { lgaId } = req.body;

  const db = dbService.getDbServiceInstance();

  const result = db.getPollingUnits(lgaId);

  result
    .then((data) =>
      res.json({
        data: data,
      })
    )
    .catch((err) => console.log(err));
});

router.post("/lga-results", (req, res) => {
  const { lgaId } = req.body;

  const db = dbService.getDbServiceInstance();
  const result = db.getLGAResults(lgaId);

  result
    .then((data) =>
      res.json({
        data: data,
      })
    )
    .catch((err) => console.log(err));
});

router.post("/poll-results", (req, res) => {
  const { uniqueId } = req.body;

  const db = dbService.getDbServiceInstance();
  const result = db.getPUResults(uniqueId);

  result
    .then((data) =>
      res.json({
        data: data,
      })
    )
    .catch((err) => console.log(err));
});

router.get("/polling-results", (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "polling-unit-results.html"));
});

router.get("/add-results", (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "add-results.html"));
});

//insert
router.post("/add-result", (req, res, next) => {
  const { pdp, dpp, acn, ppa, cdc, jp, anpp, labo, cpp } = req.body;

  const db = dbService.getDbServiceInstance();
  const result = db.addPUResults(pdp, dpp, acn, ppa, cdc, jp, anpp, labo, cpp);

  result
    .then((data) =>
      res.json({
        data: data,
      })
    )
    .catch((err) => console.log(err));
});

module.exports = router;
