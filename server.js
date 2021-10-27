const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");

//Connection test
app.listen(port, () => {
  console.log(`Project running at http://localhost:${port}`);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/client")));

// Route to Homepage
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client/index.html");
});

// Route to Login Page
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/client/login.html");
});

// Route to Feedback Page
app.get("/feedback", (req, res) => {
  res.sendFile(__dirname + "/client/feedback.html");
});

// MongoDB Connection URI
const uri =
  "mongodb+srv://admin2:654321hjkl@cs5610project2.0fsdg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// Create a new MongoClient
const client = new MongoClient(uri);
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

//Change the behavior after user put in username and password in login page.
app.post("/login-auth", (req, res) => {
  console.log("Processing...");
  // Insert Login Code Here
  const username = req.body.username;
  const password = req.body.password;
  const username_password_db = project_database.collection("Username_Password");
  const user_info = process_username_password_input(
    username,
    password,
    username_password_db,
    res
  );
});

app.post("/submit-feedback", (req, res) => {
  console.log("Processing Feedback Submission");
  const name = req.body.name;
  const email = req.body.email;
  const subject = req.body.subject;
  const message = req.body.message;
  console.log("Name is: " + name);
  console.log("Email is: " + email);
  console.log("Subject is: " + subject);
  console.log("Message is: " + message);

  const feedback_database = project_database.collection("Feedback Box");
  const doc = {
    user: name,
    comment: message,
  };
  const execute = feedback_database.insertOne(doc);
  console.log("Feedback Successfully Submitted!");
});

//Need to finish code tomorrow.
//Need to verify functionality tomorrow.
//Need to handle with front end html code. (Update the list of comments)
app.post("/feedback-edit", (req, res) => {
  console.log("Feedback Edit Request Received! (Backend)");
  const originalid = req.body.originaltext;
  const editedtext = req.body.textarea;
  edit_feedback(originalid, editedtext).catch(console.dir);

  //Front end unable to access child tag of other tags. Fix?
  //question here: If I refresh the page the deleted line still exists. How do I pertain the change on refresh?
});

//Need to verify functionality tomorrow.
//Need to handle with front end html code. (Update the list of comments)
app.post("/feedback-delete", (req, res) => {
  console.log("Feedback Delete Request Received! (Backend)");
  const originalid = req.body.originaltext;
  delete_feedback(originalid).catch(console.dir);
  //question here: If I refresh the page the deleted line still exists. How do I pertain the change on refresh?
});

//might need to change to id here.
async function edit_feedback(originalId, editedtext) {
  const feedback_database = project_database.collection("Feedback Box");
  const query = { _id: ObjectId(originalId) };
  const updateDoc = {
    $set: {
      comment: editedtext,
    },
  };
  const execute = await feedback_database.updateOne(query, updateDoc);
  console.log("Comment successfully edited!");
}

async function delete_feedback(originalId) {
  const feedback_database = project_database.collection("Feedback Box");
  const query = { _id: ObjectId(originalId) };
  console.log(query);
  const execute = feedback_database.deleteOne(query);
  console.log("Comment successfully deleted!");
}

// Insert Username Password pair to MongoDB database.
async function insert_username_password(
  username,
  password,
  collection_info,
  res
) {
  //connect to the collection and deal with mongoDB data

  const write_info = {
    username: username,
    password: password,
  };
  const execute = await collection_info.insertOne(write_info);
  console.log("A Username Password Pair has been inserted successfully.");
}

//Process username and password input.
async function process_username_password_input(
  username,
  password,
  collection_info,
  res
) {
  const query = {
    username: username,
  };
  const execute = await collection_info.findOne(query);
  if (execute == null) {
    insert_username_password(username, password, collection_info).catch(
      console.dir
    );
  } else {
    if (password == execute.password) {
      const query2 = { user: username };
      const comment_db = project_database.collection("Feedback Box");
      let comment_json = [];
      // console.log("Below is the comment retrieved: ");
      const comment_retrieved = await comment_db
        .find(query2)
        .forEach(function (doc) {
          comment_json.push(doc);
          // console.log(doc);
        });

      app.get("/comment-text", function (req, res) {
        res.json(comment_json);
      });
      const user_comment = res.redirect("/feedback");
    } else {
      //either redirect to login page or show password error.
    }
  }
}
