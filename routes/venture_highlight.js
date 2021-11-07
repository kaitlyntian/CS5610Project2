const express = require("express");
const router = express.Router();
const myDB = require("../mongodb.js");

//get counts on the venture database
router.get("/venture-count", async function (req, res) {
  const VentureCounts = await myDB.getCounts("Performance Data");
  try {
    res.send({ value: VentureCounts });
  } catch (e) {
    res.send(e);
  }
});

//get counts on the launched venture database
router.get("/launched-venture-count", async function (req, res) {
  const LaunchedVentureCounts = await myDB.getCounts("launched_ventures");
  try {
    res.send({ value: LaunchedVentureCounts });
  } catch (e) {
    res.send(e);
  }
});

//get counts on the gap funding database
router.get("/gpfund-count", async function (req, res) {
  const GapFundVentureCounts = await myDB.getCounts("gap_funding");
  try {
    res.send({ value: GapFundVentureCounts });
  } catch (e) {
    res.send(e);
  }
});
module.exports = router;
