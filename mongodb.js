const router = require("./routes/index.js");
const { MongoClient, ObjectId } = require("mongodb");
// const app = express();
require("dotenv").config();

function myDB() {
  let project_database;
  let username_global;

  const myDB = {};

  // MongoDB Connection URI
  const uri = process.env.MONGO_URL;

  myDB.establishConnection = async () => {
    // Create a new MongoClient
    const client = new MongoClient(uri);
    project_database = client.db("cs5610project2");
    try {
      // Connect the client to the server
      await client.connect();
      // Establish and verify connection
      await client.db("admin").command({ ping: 1 });
      console.log("Connected successfully to server");
    } catch (e) {
      console.log(e);
    }
  };

  myDB.insert_feedback = async (subject, message) => {
    const feedback_database = project_database.collection("Feedback Box");
    const doc = {
      user: username_global,
      subject: subject,
      comment: message,
    };
    const execute = await feedback_database.insertOne(doc);
    console.log("Feedback Successfully Submitted!");
  };

  myDB.create_account = async (username, password, res) => {
    const collection_info = project_database.collection("Username_Password");
    const query = {
      username: username,
    };
    const execute = await collection_info.findOne(query);

    if (execute != null) {
      res.redirect("/account-already-exists");
    } else {
      myDB
        .insert_username_password(username, password, collection_info)
        .catch(console.dir);
      username_global = username;
      res.redirect("/login");
    }
  };

  myDB.edit_feedback = async (originalId, editedtext, editedSubject) => {
    const feedback_database = project_database.collection("Feedback Box");
    const query = { _id: ObjectId(originalId) };
    const updateDoc = {
      $set: {
        comment: editedtext,
        subject: editedSubject,
      },
    };
    const execute = await feedback_database.updateOne(query, updateDoc);
    console.log("Comment successfully edited!");
    //Attempt to reload comments.
    myDB.getComments().catch(console.dir);
  };

  myDB.delete_feedback = async (originalId) => {
    const feedback_database = project_database.collection("Feedback Box");
    const query = { _id: ObjectId(originalId) };
    console.log(query);
    const execute = feedback_database.deleteOne(query);
    console.log("Comment successfully deleted!");
    //Attempt to reload comments.
    myDB.getComments().catch(console.dir);
  };

  myDB.insert_username_password = async (
    username,
    password,
    collection_info
  ) => {
    const write_info = {
      username: username,
      password: password,
    };
    const execute = await collection_info.insertOne(write_info);
    console.log("A Username Password Pair has been inserted successfully.");
  };

  myDB.process_username_password_input = async (username, password, res) => {
    const collection_info = project_database.collection("Username_Password");
    const query = {
      username: username,
    };
    const execute = await collection_info.findOne(query);
    if (execute == null) {
      res.redirect("/login-error");
    } else {
      if (password == execute.password) {
        username_global = username;
        let query2;
        if (username === "admin@admin") {
          query2 = {};
        } else {
          query2 = { user: username };
        }

        const comment_db = project_database.collection("Feedback Box");
        let comment_json = [];

        const comment_retrieved = await comment_db
          .find(query2)
          .forEach(function (doc) {
            comment_json.push(doc);
          });

        const user_comment = res.redirect("/feedback");

        return comment_json;
      } else {
        res.redirect("/login-error");
        return;
      }
    }
  };

  myDB.getComments = async () => {
    console.log("Reload comment has been executed.");
    let query2;
    if (username_global === "admin@admin") {
      query2 = {};
    } else {
      query2 = { user: username_global };
    }
    // const query2 = { user: username_global };
    const comment_db = project_database.collection("Feedback Box");
    return await comment_db.find(query2).toArray();
  };

  //get counts from certain collections
  myDB.getCounts = async (col_name) => {
    const performance_db = project_database.collection(col_name);
    return await performance_db.count();
  };

  return myDB;
}

module.exports = myDB();

// let project_database;
// let username_global;
//
// // MongoDB Connection URI
// const uri = process.env.MONGO_URL;
//
// async function establishConnection() {
//   // Create a new MongoClient
//   const client = new MongoClient(uri);
//   project_database = client.db("cs5610project2");
//   try {
//     // Connect the client to the server
//     await client.connect();
//     // Establish and verify connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Connected successfully to server");
//   } catch (e) {
//     console.log(e);
//   }
// }
//
// // Create an account
// // Return Boolean.
// async function create_account(username, password, res) {
//   const collection_info = project_database.collection("Username_Password");
//   const query = {
//     username: username,
//   };
//   const execute = await collection_info.findOne(query);
//
//   if (execute != null) {
//     res.redirect("/account-already-exists");
//   } else {
//     insert_username_password(username, password).catch(
//       console.dir
//     );
//     username_global = username;
//     res.redirect("/login");
//   }
// }
//
// async function insert_feedback(subject, message) {
//   const feedback_database = project_database.collection("Feedback Box");
//   const doc = {
//     user: username_global,
//     subject: subject,
//     comment: message,
//   };
//   const execute = feedback_database.insertOne(doc);
//   console.log("Feedback Successfully Submitted!");
// }
//
// async function edit_feedback(originalId, editedtext, editedSubject) {
//   const feedback_database = project_database.collection("Feedback Box");
//   const query = { _id: ObjectId(originalId) };
//   const updateDoc = {
//     $set: {
//       comment: editedtext,
//       subject: editedSubject,
//     },
//   };
//   const execute = await feedback_database.updateOne(query, updateDoc);
//   console.log("Comment successfully edited!");
//   //Attempt to reload comments.
//   getComments().catch(console.dir);
// }
//
// async function delete_feedback(originalId) {
//   const feedback_database = project_database.collection("Feedback Box");
//   const query = { _id: ObjectId(originalId) };
//   console.log(query);
//   const execute = feedback_database.deleteOne(query);
//   console.log("Comment successfully deleted!");
//   //Attempt to reload comments.
//   getComments().catch(console.dir);
// }
//
// async function insert_username_password(
//   username,
//   password
// ) {
//   //connect to the collection and deal with mongoDB data
//   const collection_info = project_database.collection("Username_Password");
//
//   const write_info = {
//     username: username,
//     password: password,
//   };
//   const execute = await collection_info.insertOne(write_info);
//   console.log("A Username Password Pair has been inserted successfully.");
// }
//
// async function process_username_password_input(
//   username,
//   password,
//   res
// ) {
//   const collection_info = project_database.collection("Username_Password");
//   const query = {
//     username: username,
//   };
//   const execute = await collection_info.findOne(query);
//   if (execute == null) {
//     res.redirect("/login-error");
//   } else {
//     if (password == execute.password) {
//       username_global = username;
//       let query2;
//       if (username === "admin@admin") {
//         query2 = {};
//       } else {
//         query2 = { user: username };
//       }
//
//       const comment_db = project_database.collection("Feedback Box");
//       let comment_json = [];
//
//       const comment_retrieved = await comment_db
//         .find(query2)
//         .forEach(function (doc) {
//           comment_json.push(doc);
//         });
//
//       app.get("/comment-text", function (req, res) {
//         res.json(comment_json);
//       });
//
//       // login_status = true;
//
//       const user_comment = res.redirect("/feedback");
//     } else {
//       res.redirect("/login-error");
//     }
//   }
// }
//
// async function getComments() {
//   console.log("Reload comment has been executed.");
//   let query2;
//   if (username_global === "admin@admin") {
//     query2 = {};
//   } else {
//     query2 = { user: username_global };
//   }
//   // const query2 = { user: username_global };
//   const comment_db = project_database.collection("Feedback Box");
//   return await comment_db.find(query2).toArray();
// }
