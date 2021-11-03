console.log("running mongodb_venturehighlight.js");
//fetching the route
var express = require("express");
var router = express.Router();

//fetching mongo db
const { MongoClient, ObjectId } = require("mongodb");
const url = process.env.MONGO_URL || "mongo://localhost:2701";
const client = new MongoClient(url);
const project_database = client.db("cs5610project2");

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to server");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

//Initialize MongoDB Connection
run().catch(console.dir);

//get counts from certain collections
async function getCounts(col_name) {
  const performance_db = project_database.collection(col_name);
  return await performance_db.count();
}

//get counts on the venture database
router.get("/venture-count", async function (req, res) {
  const VentureCounts = await getCounts("Performance Data");
  try {
    res.send({ value: VentureCounts });
  } catch (e) {
    res.send(err);
  }
});

//get counts on the launched venture database
router.get("/launched-venture-count", async function (req, res) {
  const LaunchedVentureCounts = await getCounts("launched_ventures");
  try {
    res.send({ value: LaunchedVentureCounts });
  } catch (e) {
    res.send(err);
  }
});

//get counts on the gap funding database
router.get("/gpfund-count", async function (req, res) {
  const GapFundVentureCounts = await getCounts("gap_funding");
  try {
    res.send({ value: GapFundVentureCounts });
  } catch (e) {
    res.send(err);
  }
});

module.exports = router;
