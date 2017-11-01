/* Note Taker (18.2.6)
 * backend
 * ==================== */

// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var logger = require("morgan");

var app = express();

// Set the app up with morgan, body-parser, and a static folder
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static("public"));

// Database configuration
var databaseUrl = "mongodb://michaeldimanshtein:michael89@ds241875.mlab.com:41875/michael_note_taker";
var collections = ["notes"];

// Hook mongojs config to db variable
var db = mongojs(databaseUrl, collections);

// Log any mongojs errors to console
db.on("error", function (error) {
  console.log("Database Error:", error);
});


// Routes
// ======

// Simple index route
app.get("/", function (req, res) {
  res.send(index.html);
});


// TODO: You will make six more routes. Each will use mongojs methods
// to interact with your mongoDB database, as instructed below.
// -/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/


// 1. Save a note to the database's collection
// ===========================================
app.post("/submit", function (req, res) {
  console.log(req.body);
  var newNote = req.body;
  var title = newNote.title;
  var note = newNote.note;
  var date = newNote.created;

  if (title && note) {
    db.notes.insert({
      title: title,
      note: note,
      date: date


    },
      function (error, inserted) {
        if (error) {
          console.log(error);
        } else {
          console.log(inserted);
          res.send(inserted);
        }
      });

  }
});



// 2. Retrieve all notes from the database's collection
// ====================================================
app.get("/all", function (req, res) {
  db.notes.find().sort({ name: 1 }, function (error, found) {
    if (error) {
      console.log(error);
    } else {
      console.log(found);
      res.json(found);

    }
  });
});



// 3. Retrieve one note in the database's collection by it's ObjectId
// TIP: when searching by an id, the id needs to be passed in
// as (mongojs.ObjectId(IDYOUWANTTOFIND))
// ==================================================================

app.get("/find/:note", function (req, res) {
  var selectedNote = req.params.note;

  //console.log(`This is the selected note id: ${selectedNote}`);
  db.notes.findOne({
    _id: mongojs.ObjectId(selectedNote)
  }, function (error, doc) {
    if (error) {
      console.log(error)
    } else {
      res.send(doc);
      //console.log(doc);
    }



  })
});



// 4. Update one note in the database's collection by it's ObjectId
// (remember, mongojs.ObjectId(IDYOUWANTTOFIND)
// ================================================================
app.post("/update/:note", function (req, res) {

  db.notes.update({
    "_id": mongojs.ObjectId(req.params.note)
  }, {
      $set: {
        "title": req.body.title,
        "note": req.body.note,
        "modified": Date.now()
      }
    }, function (error, edited) {
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        console.log(edited);
        res.send(edited);
      }


    });
});



// 5. Delete one note from the database's collection by it's ObjectId
// (remember, mongojs.ObjectId(IDYOUWANTTOFIND)
// ==================================================================
app.get("/delete/:note", function (req, res) {
  
  db.notes.remove({
    "_id": mongojs.ObjectId(req.params.note)

  }, function (error, removed) {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      console.log(removed);
      res.send(removed);
    }
  });
});



// 6. Clear the entire note collection
// ===================================
app.get("/clearall", function (req, res) {
  console.log("clear-all");
  db.notes.remove({}, function (error, doc) {
    if (error) {
      console.log(error);
    } else {
      res.send(doc);
    }

  });
});


// Listen on port 3000
app.listen(3000, function () {
  console.log("App running on port 3000!");
});
