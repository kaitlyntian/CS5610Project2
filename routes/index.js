const express = require("express");
const router = express.Router();
const myDB = require("../mongodb.js");
const path = require("path");
let username_global;

myDB.establishConnection().catch(console.dir);

path.join(__dirname, "..", "test", "karma.conf.js");
let comment_json;

// Route to Homepage
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/../public/index.html"));
  // res.sendFile(__dirname + "/../public/index.html");
});

// Route to Login Page
router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "/../public/login.html"));
  // res.sendFile(__dirname + "/../public/login.html");
});

//route to login error page
router.get("/login-error", (req, res) => {
  res.sendFile(path.join(__dirname, "/../public/login-error.html"));
  // res.sendFile(__dirname + "/../public/login-error.html");
});

//route to account already exist page
router.get("/account-already-exists", (req, res) => {
  res.sendFile(path.join(__dirname, "/../public/account-already-exist.html"));
  // res.sendFile(__dirname + "/../public/account-already-exist.html");
});

//route to create account page
router.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "/../public/register.html"));
  // res.sendFile(__dirname + "/../public/register.html");
});

// Route to Feedback Page
router.get("/feedback", (req, res) => {
  res.sendFile(path.join(__dirname, "/../public/feedback.html"));
  // res.sendFile(__dirname + "/../public/feedback.html");
});

//Change the behavior after user put in username and password in login page.
router.post("/login-auth", async (req, res) => {
  console.log("Processing...");
  // Insert Login Code Here
  const username = req.body.username;
  const password = req.body.password;
  comment_json = await myDB
    .process_username_password_input(username, password, res)
    .catch(console.dir);
});

router.get("/comment-text", function (req, res) {
  res.json(comment_json);
});

// Reaction when user created an account
router.post("/account-register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  await myDB.create_account(username, password, res).catch(console.dir);
});

router.post("/submit-feedback", async (req, res) => {
  console.log("Processing Feedback Submission");
  const subject = req.body.subject;
  const message = req.body.message;
  await myDB.insert_feedback(subject, message).catch(console.dir);
  await myDB.getComments().catch(console.dir);
  res.redirect("/feedback");
});

router.post("/feedback-edit", async (req, res) => {
  console.log("Feedback Edit Request Received! (Backend)");
  const subject = req.body.textsubject;
  const originalid = req.body.originaltext;
  const editedtext = req.body.textarea;
  await myDB.edit_feedback(originalid, editedtext, subject).catch(console.dir);
  res.redirect("/feedback");
});

router.post("/feedback-delete", async (req, res) => {
  console.log("Feedback Delete Request Received! (Backend)");
  const originalid = req.body.originaltext;
  await myDB.delete_feedback(originalid).catch(console.dir);
  res.redirect("/feedback");
});

router.get("/comment-text-update", async function (req, res) {
  const comment_json = await myDB.getComments();
  res.json(comment_json);
});

module.exports = router;
