// Create web server application with express
// Run with: node comments.js
// Access with: http://localhost:3000/comments

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');

// Serve static files
app.use(express.static('public'));

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Load comments from file
function loadComments() {
  var comments = fs.readFileSync('comments.json');
  return JSON.parse(comments);
}

// Save comments to file
function saveComments(comments) {
  fs.writeFileSync('comments.json', JSON.stringify(comments, null, 2));
}

// GET /comments
// Returns all comments
app.get('/comments', function(req, res) {
  var comments = loadComments();
  res.send(comments);
});

// POST /comments
// Creates a new comment
app.post('/comments', function(req, res) {
  var comments = loadComments();
  var comment = req.body;
  comment.id = comments.length + 1;
  comments.push(comment);
  saveComments(comments);
  res.send(comment);
});

// GET /comments/:id
// Returns a comment with given id
app.get('/comments/:id', function(req, res) {
  var comments = loadComments();
  var id = req.params.id;
  for (var i = 0; i < comments.length; i++) {
    if (comments[i].id == id) {
      res.send(comments[i]);
      return;
    }
  }
  res.status(404).send('Not found');
});

// PUT /comments/:id
// Updates a comment with given id
app.put('/comments/:id', function(req, res) {
  var comments = loadComments();
  var id = req.params.id;
  for (var i = 0; i < comments.length; i++) {
    if (comments[i].id == id) {
      comments[i].name = req.body.name;
      comments[i].comment = req.body.comment;
      saveComments(comments);
      res.send(comments[i]);
      return;
    }
  }
  res.status(404).send('Not found');
});

// DELETE /comments/:id
// Deletes a comment with given id
app.delete('/comments/:id', function(req, res) {
  var comments
